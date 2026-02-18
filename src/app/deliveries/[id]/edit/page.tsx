"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  LocalShipping as DeliveryIcon,
} from "@mui/icons-material";
import { useDeliveryDetail, useDeliveryPersonnel } from "@/hooks/useDeliveries";
import axiosInstance from "@/lib/axios";

export default function DeliveryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);
  const { delivery, loading: loadingDelivery, error: deliveryError } = useDeliveryDetail(decodedId);
  const { personnel, loading: loadingCouriers } = useDeliveryPersonnel();

  const [formData, setFormData] = useState({
    status: "",
    courierId: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (delivery) {
      setFormData({
        status: delivery.order_status || delivery.status || "Pending",
        courierId: delivery.deliveryPerson?.id?.toString() || "",
        notes: "",
      });
    }
  }, [delivery]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Update delivery status and assign courier
      if (delivery?.id) {
        if (formData.courierId) {
          await axiosInstance.post(`delivery/assign/${delivery.id}`, {
            delivery_person_id: parseInt(formData.courierId),
          });
        }
        if (formData.status) {
          await axiosInstance.patch(`delivery/status/${delivery.id}`, {
            status: formData.status,
          });
        }
      }
      router.push(`/deliveries/${encodeURIComponent(decodedId)}`);
    } catch (err: any) {
      console.error("Error saving delivery:", err);
      alert(err?.response?.data?.message || "Failed to save delivery");
    } finally {
      setSaving(false);
    }
  };

  if (loadingDelivery) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (deliveryError || !delivery) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Alert severity="error" sx={{ borderRadius: "16px", mb: 2 }}>
          {deliveryError || "Delivery not found"}
        </Alert>
        <Button onClick={() => router.push("/deliveries")} variant="outlined">
          Back to Deliveries
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() =>
            router.push(`/deliveries/${encodeURIComponent(decodedId)}`)
          }
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Modify Delivery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Assign courier and update live delivery status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            boxShadow: "none",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <DeliveryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Assignment & Status
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Delivery Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Picked Up">Picked Up</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Delayed">Delayed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Assign Courier"
                  value={formData.courierId}
                  onChange={(e) =>
                    setFormData({ ...formData, courierId: e.target.value })
                  }
                  disabled={loadingCouriers}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {loadingCouriers ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    personnel.map((courier) => (
                      <MenuItem key={courier.id} value={courier.id.toString()}>
                        {courier.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Delivery Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Specific notes for the courier regarding this delivery.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter special instructions..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

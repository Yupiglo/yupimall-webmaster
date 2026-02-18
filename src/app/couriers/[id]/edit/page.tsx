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
  Person as PersonIcon,
  LocalShipping as VehicleIcon,
} from "@mui/icons-material";
import { useCourierDetail } from "@/hooks/useDeliveries";
import axiosInstance from "@/lib/axios";

export default function CourierEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);
  const { courier, loading, error } = useCourierDetail(decodedId);

  const [formData, setFormData] = useState({
    name: "",
    vehicle: "",
    phone: "",
    status: "Active",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courier) {
      setFormData({
        name: courier.name || "",
        vehicle: courier.vehicle || "",
        phone: courier.phone || "",
        status: courier.status || "Active",
      });
    }
  }, [courier]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Note: Update endpoint may vary based on your API structure
      // This is a placeholder - adjust based on actual API endpoint
      if (courier?.id) {
        await axiosInstance.put(`delivery/personnel/${courier.id}`, formData);
      }
      router.push(`/couriers/${encodeURIComponent(decodedId)}`);
    } catch (err: any) {
      console.error("Error saving courier:", err);
      alert(err?.response?.data?.message || "Failed to save courier");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !courier) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Alert severity="error" sx={{ borderRadius: "16px", mb: 2 }}>
          {error || "Courier not found"}
        </Alert>
        <Button onClick={() => router.push("/couriers")} variant="outlined">
          Back to Couriers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() =>
            router.push(`/couriers/${encodeURIComponent(decodedId)}`)
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
            Edit Courier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update courier profile and vehicle details.
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
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Personal Details
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
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
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <VehicleIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Vehicle Information
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Vehicle Type"
                  value={formData.vehicle}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  placeholder="e.g. Motorcycle, Car, Van"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

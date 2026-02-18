"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Output as ExitIcon,
} from "@mui/icons-material";
import axiosInstance from "@/lib/axios";

interface StockExitDetail {
  id: number;
  quantity: number;
  reason: string;
  notes: string | null;
  product?: { title: string };
}

export default function ExitEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? decodeURIComponent(String(params.id)) : "";
  const decodedId = id;

  const [exit, setExit] = useState<StockExitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    notes: "",
    reason: "sale",
  });

  useEffect(() => {
    if (!id) return;
    const fetchExit = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`stock/exits/${id}`);
        const data = response.data?.data ?? response.data;
        setExit(data);
        if (data) {
          setFormData({
            quantity: String(data.quantity ?? ""),
            notes: data.notes ?? "",
            reason: data.reason ?? "sale",
          });
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load stock exit");
      } finally {
        setLoading(false);
      }
    };
    fetchExit();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axiosInstance.put(`stock/exits/${decodedId}`, {
        quantity: parseInt(formData.quantity, 10) || 0,
        notes: formData.notes || null,
        reason: formData.reason,
      });
      router.push(`/exits/${encodeURIComponent(decodedId)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save exit");
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

  if (error && !exit) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Alert severity="error" sx={{ borderRadius: "16px", mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => router.push("/exits")} variant="outlined">
          Back to Exits
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push(`/exits/${encodeURIComponent(decodedId)}`)}
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
            Edit Exit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adjust outbound quantity or update delivery notes.
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
          Save Changes
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
                <ExitIcon color="error" />
                <Typography variant="h6" fontWeight="bold">
                  Shipment Status
                </Typography>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Exit Reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                >
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="damaged">Damaged</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="returned">Returned</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Quantity Dispatched"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
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
                Outbound Memo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Internal details for this inventory exit.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter memo..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

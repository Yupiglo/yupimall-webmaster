"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useDeliveryPersonnel } from "@/hooks/useDeliveries";

interface AddDeliveryModalProps {
  open: boolean;
  onClose: () => void;
}

interface Order {
  id: string;
  tracking_code?: string;
  shipping_name?: string;
  shipping_address?: string;
}

export default function AddDeliveryModal({
  open,
  onClose,
}: AddDeliveryModalProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    courierId: "",
    address: "",
    notes: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const { personnel, loading: loadingCouriers, error: couriersError } = useDeliveryPersonnel();

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const response = await axiosInstance.get("orders/all");
      const data = response.data?.orders || response.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setOrdersError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nueva entrega:", formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, fontWeight: "bold", fontSize: "1.25rem" }}>
        Assign New Delivery
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 24,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Stack spacing={3}>
            {ordersError && (
              <Alert severity="error">{ordersError}</Alert>
            )}
            <TextField
              select
              label="Select Order"
              required
              fullWidth
              value={formData.orderId}
              onChange={(e) =>
                setFormData({ ...formData, orderId: e.target.value })
              }
              disabled={loadingOrders}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {loadingOrders ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading orders...
                </MenuItem>
              ) : orders.length === 0 ? (
                <MenuItem disabled>No orders available</MenuItem>
              ) : (
                orders.map((order) => {
                  const orderId = order.tracking_code ? `#ORD-${order.tracking_code}` : order.id;
                  const customer = order.shipping_name || "Unknown Customer";
                  return (
                    <MenuItem key={order.id} value={order.id}>
                      {orderId} - {customer}
                    </MenuItem>
                  );
                })
              )}
            </TextField>

            {couriersError && (
              <Alert severity="error">{couriersError}</Alert>
            )}
            <TextField
              select
              label="Assign Courier"
              required
              fullWidth
              value={formData.courierId}
              onChange={(e) =>
                setFormData({ ...formData, courierId: e.target.value })
              }
              disabled={loadingCouriers}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            >
              {loadingCouriers ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading couriers...
                </MenuItem>
              ) : personnel.length === 0 ? (
                <MenuItem disabled>No couriers available</MenuItem>
              ) : (
                personnel.map((courier) => (
                  <MenuItem key={courier.id} value={courier.id}>
                    {courier.name}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              label="Delivery Address"
              required
              fullWidth
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              label="Notes"
              multiline
              rows={2}
              fullWidth
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              px: 3,
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              px: 4,
              boxShadow: "none",
            }}
          >
            Create Delivery
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

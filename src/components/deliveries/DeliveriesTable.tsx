"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useActiveDeliveries } from "@/hooks/useDeliveries";

export default function DeliveriesTable() {
  const router = useRouter();
  const { deliveries, loading, error } = useActiveDeliveries();
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "delivered":
        return "success";
      case "in transit":
        return "info";
      case "pending":
      case "processing":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: "16px" }}>
        {error}
      </Alert>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "background.default" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Delivery ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Order & Customer</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Courier</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No active deliveries found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            deliveries.map((delivery) => {
              const deliveryId = delivery.id ? `#DEL-${delivery.id}` : delivery.tracking_code || "N/A";
              const orderId = delivery.tracking_code ? `#ORD-${delivery.tracking_code}` : delivery.orderId || "N/A";
              const customer = delivery.shipping_name || delivery.customer || "N/A";
              const courier = delivery.deliveryPerson?.name || delivery.courier || "Unassigned";
              const address = delivery.shipping_address || delivery.address || delivery.shipping_city || "N/A";
              const status = delivery.order_status || delivery.status || "Unknown";
              const date = delivery.created_at || delivery.date;

              return (
                <TableRow
                  key={delivery.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: "medium" }}>{deliveryId}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {orderId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {customer}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {courier}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {address}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {formatDate(date)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status}
                      color={getStatusColor(status) as any}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderRadius: "100px",
                        px: 0.5,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() =>
                            router.push(
                              `/deliveries/${encodeURIComponent(delivery.id || deliveryId)}`
                            )
                          }
                        >
                          <ViewIcon fontSize="small" color="action" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print Delivery">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            router.push(
                              `/deliveries/${encodeURIComponent(
                                delivery.id || deliveryId
                              )}?print=true`
                            )
                          }
                        >
                          <PrintIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

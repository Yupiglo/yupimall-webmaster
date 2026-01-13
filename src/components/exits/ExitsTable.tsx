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
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const exits = [
  {
    id: "#EXT-001",
    product: "Classic Leather Jacket",
    sku: "JKT-001",
    quantity: 12,
    destination: "John Doe (Downtown)",
    date: "Oct 26, 2025, 11:45 AM",
    status: "Delivered",
  },
  {
    id: "#EXT-002",
    product: "Wireless Headphones",
    sku: "AUD-005",
    quantity: 5,
    destination: "TechStore Inc.",
    date: "Oct 25, 2025, 03:20 PM",
    status: "In Transit",
  },
  {
    id: "#EXT-003",
    product: "Organic Coffee Beans",
    sku: "CFE-012",
    quantity: 20,
    destination: "Café de Flore",
    date: "Oct 24, 2025, 10:00 AM",
    status: "Delivered",
  },
  {
    id: "#EXT-004",
    product: "Smart Watch Series 5",
    sku: "WCH-002",
    quantity: 3,
    destination: "Alice Smith",
    date: "Oct 23, 2025, 01:15 PM",
    status: "Cancelled",
  },
  {
    id: "#EXT-005",
    product: "Denim Jeans Slim Fit",
    sku: "JNS-009",
    quantity: 15,
    destination: "Fashion Hub",
    date: "Oct 22, 2025, 09:30 AM",
    status: "Delivered",
  },
];

export default function ExitsTable() {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "background.default" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Exit ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Destination</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exits.map((exit) => (
            <TableRow
              key={exit.id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ fontWeight: "medium" }}>{exit.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {exit.product}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SKU: {exit.sku}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>
                {exit.quantity}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {exit.destination}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {exit.date}
              </TableCell>
              <TableCell>
                <Chip
                  label={exit.status}
                  color={getStatusColor(exit.status) as any}
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
                        router.push(`/exits/${encodeURIComponent(exit.id)}`)
                      }
                    >
                      <ViewIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print Exit">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        router.push(
                          `/exits/${encodeURIComponent(exit.id)}?print=true`
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

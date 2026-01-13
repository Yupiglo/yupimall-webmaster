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

const entries = [
  {
    id: "#ENT-001",
    product: "Classic Leather Jacket",
    sku: "JKT-001",
    quantity: 25,
    supplier: "Global Leathers Inc.",
    date: "Oct 26, 2025, 10:30 AM",
    status: "Completed",
  },
  {
    id: "#ENT-002",
    product: "Wireless Headphones",
    sku: "AUD-005",
    quantity: 15,
    supplier: "TechAudio Supplies",
    date: "Oct 25, 2025, 02:45 PM",
    status: "Pending",
  },
  {
    id: "#ENT-003",
    product: "Organic Coffee Beans",
    sku: "CFE-012",
    quantity: 50,
    supplier: "EcoFarms Co.",
    date: "Oct 24, 2025, 09:15 AM",
    status: "Completed",
  },
  {
    id: "#ENT-004",
    product: "Smart Watch Series 5",
    sku: "WCH-002",
    quantity: 10,
    supplier: "GearNext Solutions",
    date: "Oct 23, 2025, 11:00 AM",
    status: "Cancelled",
  },
  {
    id: "#ENT-005",
    product: "Denim Jeans Slim Fit",
    sku: "JNS-009",
    quantity: 40,
    supplier: "Urban Wear Ltd.",
    date: "Oct 22, 2025, 04:20 PM",
    status: "Completed",
  },
];

export default function EntriesTable() {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
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
            <TableCell sx={{ fontWeight: "bold" }}>Entry ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Supplier</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ fontWeight: "medium" }}>{entry.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {entry.product}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SKU: {entry.sku}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "medium" }}>
                {entry.quantity}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {entry.supplier}
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {entry.date}
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.status}
                  color={getStatusColor(entry.status) as any}
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
                        router.push(`/entries/${encodeURIComponent(entry.id)}`)
                      }
                    >
                      <ViewIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print Entry">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        router.push(
                          `/entries/${encodeURIComponent(entry.id)}?print=true`
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

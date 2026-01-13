"use client";

import { Box, Stack } from "@mui/material";
import ExitsHeader from "@/components/exits/ExitsHeader";
import ExitsTable from "@/components/exits/ExitsTable";

export default function ExitsPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <ExitsHeader />
        <ExitsTable />
      </Stack>
    </Box>
  );
}

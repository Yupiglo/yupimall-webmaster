"use client";

import { Box, Stack } from "@mui/material";
import EntriesHeader from "@/components/entries/EntriesHeader";
import EntriesTable from "@/components/entries/EntriesTable";

export default function EntriesPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <EntriesHeader />
        <EntriesTable />
      </Stack>
    </Box>
  );
}

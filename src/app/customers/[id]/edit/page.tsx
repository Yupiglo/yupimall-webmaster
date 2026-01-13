"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";

/**
 * Customer Edit Page - DISABLED for Webmaster
 * Webmasters can only view customer information, not modify it.
 * This page redirects to the customer detail page.
 */
export default function CustomerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    // Redirect to the view page - editing is not allowed for webmaster
    router.replace(`/customers/${id}`);
  }, [router, id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">
        Redirection en cours...
      </Typography>
      <Typography variant="body2" color="text.disabled">
        La modification des clients n&apos;est pas autorisée pour les webmasters.
      </Typography>
    </Box>
  );
}

"use client";

import { useState, useEffect } from "react";
import WidgetList, { WidgetItem } from "./WidgetList";
import { useDeliveryPersonnel } from "@/hooks/useDeliveries";
import { CircularProgress, Box } from "@mui/material";

export default function TopCouriers() {
  const { personnel, loading } = useDeliveryPersonnel();
  const [topCouriers, setTopCouriers] = useState<WidgetItem[]>([]);

  useEffect(() => {
    if (personnel.length > 0) {
      // Sort by total deliveries (or active deliveries) and take top 5
      const sorted = [...personnel].sort((a, b) => {
        const aDeliveries = a.totalDeliveries || a.active_deliveries || 0;
        const bDeliveries = b.totalDeliveries || b.active_deliveries || 0;
        return bDeliveries - aDeliveries;
      });

      const top5 = sorted.slice(0, 5).map((courier, index) => {
        const deliveries = courier.totalDeliveries || courier.active_deliveries || 0;
        const rating = courier.rating ?? courier.average_rating;
        const status = courier.status || "Unknown";

        return {
          id: courier.id,
          title: courier.name,
          subtitle: rating != null ? `⭐ ${Number(rating).toFixed(1)} • ${deliveries} Deliveries` : `${deliveries} Deliveries`,
          value: status,
          image: courier.avatar || courier.photo || undefined,
          badge: index === 0 ? "Top Rated" : undefined,
          badgeColor: index === 0 ? "warning" : undefined,
        } as WidgetItem;
      });

      setTopCouriers(top5);
    }
  }, [personnel]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <WidgetList
      title="Top 5 Couriers"
      items={topCouriers}
      viewAllLink="/couriers"
    />
  );
}

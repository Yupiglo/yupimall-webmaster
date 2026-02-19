"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

export interface DeliveryPerson {
    id: number;
    name: string;
    email: string;
    phone: string;
    vehicle?: string;
    totalDeliveries?: number;
    active_deliveries?: number;
    rating?: number;
    average_rating?: number;
    avatar?: string;
    photo?: string;
    status: string;
}

export interface Delivery {
    id: number;
    orderId?: string;
    tracking_code?: string;
    customer?: string;
    shipping_name?: string;
    courier?: string;
    deliveryPerson?: {
        id: number;
        name: string;
    };
    address?: string;
    shipping_address?: string;
    shipping_city?: string;
    date?: string;
    created_at?: string;
    status?: string;
    order_status?: string;
}

export function useDeliveryPersonnel() {
    const [personnel, setPersonnel] = useState<DeliveryPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("delivery/personnel");
            const data = response.data?.personnel || response.data?.data || response.data || [];
            setPersonnel(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching delivery personnel:", err);
            setError(err?.response?.data?.message || "Impossible de charger les livreurs");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { personnel, loading, error, refresh: fetch };
}

export function useActiveDeliveries() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("delivery/active");
            const data = response.data?.deliveries || response.data?.data || response.data || [];
            setDeliveries(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching deliveries:", err);
            setError(err?.response?.data?.message || "Impossible de charger les livraisons");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { deliveries, loading, error, refresh: fetch };
}

export function useDeliveryDetail(id: string) {
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("delivery/active");
            const data = response.data?.deliveries || response.data?.data || [];
            const found = Array.isArray(data) 
                ? data.find((d: any) => d.id?.toString() === id || d.tracking_code === id || `#DEL-${d.id}` === id)
                : null;
            setDelivery(found || null);
        } catch (err: any) {
            console.error("Error fetching delivery:", err);
            setError(err?.response?.data?.message || "Impossible de charger la livraison");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetch(); }, [fetch]);

    return { delivery, loading, error, refresh: fetch };
}

export function useCourierDetail(id: string) {
    const [courier, setCourier] = useState<DeliveryPerson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("delivery/personnel");
            const data = response.data?.personnel || response.data?.data || [];
            const found = Array.isArray(data)
                ? data.find((p: any) => p.id?.toString() === id || `#COU-${p.id}` === id)
                : null;
            setCourier(found || null);
        } catch (err: any) {
            console.error("Error fetching courier:", err);
            setError(err?.response?.data?.message || "Impossible de charger le livreur");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetch(); }, [fetch]);

    return { courier, loading, error, refresh: fetch };
}

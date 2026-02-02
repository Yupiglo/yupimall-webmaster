"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axiosInstance.post("auth/logout");
      } catch (error) {
        console.error("Failed to revoke token on backend:", error);
      } finally {
        signOut();
        router.push("/login");
      }
    };

    performLogout();
  }, []);

  return null;
}

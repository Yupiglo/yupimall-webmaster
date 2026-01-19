"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import { CurrencyContextProvider } from "@/helpers/currency/CurrencyContext";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyContextProvider>
        <ThemeRegistry>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ThemeRegistry>
      </CurrencyContextProvider>
    </SessionProvider>
  );
}

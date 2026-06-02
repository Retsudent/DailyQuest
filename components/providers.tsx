"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "./providers/SidebarProvider";
import ToastCenter from "./ui/ToastCenter";
import PWARegister from "./pwa/PWARegister";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PWARegister />
      <SidebarProvider>
        {children}
        <ToastCenter />
      </SidebarProvider>
    </SessionProvider>
  );
}
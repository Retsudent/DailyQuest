"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerSW = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    registerSW();
  }, []);

  return null;
}

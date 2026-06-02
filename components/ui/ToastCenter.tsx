"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

export default function ToastCenter() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const custom = event as CustomEvent<ToastItem>;
      const payload = custom.detail;
      if (!payload?.id || !payload?.message || !payload?.type) return;

      setItems((prev) => [...prev, payload].slice(-4));
      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== payload.id));
      }, 3200);
    };

    window.addEventListener("dq:toast", onToast as EventListener);
    return () => window.removeEventListener("dq:toast", onToast as EventListener);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-[120] space-y-2 w-[min(90vw,360px)] pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl border px-4 py-3 backdrop-blur-xl shadow-lg text-sm font-semibold ${
            item.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-100"
              : item.type === "error"
                ? "bg-rose-500/15 border-rose-500/30 text-rose-100"
                : "bg-blue-500/15 border-blue-500/30 text-blue-100"
          }`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}

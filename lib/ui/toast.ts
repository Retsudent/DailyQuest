"use client";

export type ToastType = "success" | "error" | "info";

export function notify(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("dq:toast", {
      detail: { id: crypto.randomUUID(), message, type },
    })
  );
}

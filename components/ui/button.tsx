import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300",

        // PRIMARY
        variant === "primary" &&
          "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30",

        // SECONDARY
        variant === "secondary" &&
          "border border-white/10 bg-white/5 text-white hover:bg-white/10",

        // OUTLINE (FIX UNTUK LOGIN SOCIAL BUTTON)
        variant === "outline" &&
          "border border-zinc-600 bg-transparent text-white hover:bg-zinc-800",

        className
      )}
      {...props}
    />
  );
}
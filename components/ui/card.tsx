import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-xl shadow-black/20",
        "transition-all duration-300",
        "hover:border-blue-500/20 hover:bg-white/[0.07]",
        className
      )}
      {...props}
    />
  );
}
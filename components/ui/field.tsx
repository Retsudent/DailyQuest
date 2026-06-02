import * as React from "react";
import { cn } from "@/lib/utils";

/* FIELD WRAPPER */
export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props} />
  );
}

/* FIELD GROUP */
export function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props} />
  );
}

/* LABEL */
export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-white", className)}
      {...props}
    />
  );
}

/* DESCRIPTION */
export function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/* SEPARATOR */
export function FieldSeparator({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 text-sm text-gray-400", className)}
      {...props}
    >
      <div className="flex-1 h-px bg-gray-700" />
      <span>{children}</span>
      <div className="flex-1 h-px bg-gray-700" />
    </div>
  );
}
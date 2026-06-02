import React from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <button className="float-right text-gray-500" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
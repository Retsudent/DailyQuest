import React from "react";

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-blue-600 h-3 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

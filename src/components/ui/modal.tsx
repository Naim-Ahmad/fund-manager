"use client";

import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

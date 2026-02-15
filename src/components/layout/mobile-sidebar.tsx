"use client";

import Sidebar from "./sidebar";

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-64">
        <Sidebar collapsed={false} toggleCollapse={() => {}} />
      </div>
    </div>
  );
}

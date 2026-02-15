"use client";

import { supabase } from "@/lib/supabase/client";
import { Menu } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden">
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold">Personal Fund Manager</h1>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/auth/login";
        }}
        className="text-sm text-red-600"
      >
        Logout
      </button>
    </header>
  );
}

"use client";

import { useState } from "react";
import Header from "./header";
import MobileSidebar from "./mobile-sidebar";
import Sidebar from "./sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="hidden md:block h-screen bg-white">
        <Sidebar
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed((prev) => !prev)}
        />
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar({
  collapsed,
  toggleCollapse,
}: {
  collapsed: boolean;
  toggleCollapse: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white border-r border-gray-100 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } hidden md:flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="font-semibold text-lg">Fund Manager</h2>}

        <button onClick={toggleCollapse}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import AppShell from "@/components/layout/app-shell";
import Protected from "@/components/protected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <AppShell>{children}</AppShell>
    </Protected>
  );
}

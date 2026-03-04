import DashboardShell from '@/components/shared/DashboardShell';

/**
 * Dashboard layout shell — Server Component.
 *
 * All routes inside app/(dashboard)/ are rendered inside this shell.
 * The route group itself has no effect on the URL path.
 *
 * Must remain a Server Component (no 'use client') so Next.js can correctly
 * generate the client-reference-manifest for pages in this route group.
 * Interactive state lives in <DashboardShell> (a Client Component).
 *
 * Layout:
 *   ┌──────────┬────────────────────────────┐
 *   │          │  TopBar                    │
 *   │ Sidebar  ├────────────────────────────┤
 *   │          │  {children}                │
 *   └──────────┴────────────────────────────┘
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}

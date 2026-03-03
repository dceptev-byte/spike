'use client';

import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import TopBar from '@/components/shared/TopBar';
import AIChatWidget from '@/components/ai/AIChatWidget';
import HelpPanel from '@/components/onboarding/HelpPanel';
import ToastProvider from '@/components/shared/ToastProvider';

/**
 * Dashboard layout shell.
 *
 * All routes inside app/(dashboard)/ are rendered inside this shell.
 * The route group itself has no effect on the URL path.
 *
 * Layout:
 *   ┌──────────┬────────────────────────────┐
 *   │          │  TopBar                    │
 *   │ Sidebar  ├────────────────────────────┤
 *   │          │  {children}                │
 *   └──────────┴────────────────────────────┘
 *
 * Responsiveness:
 *   • Desktop (md+): sidebar is in the normal document flow; can be
 *     collapsed to icon-only by the user.
 *   • Mobile: sidebar is hidden; a hamburger button in the TopBar opens it
 *     as a fixed overlay drawer.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /** Controls the mobile overlay drawer. */
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Floating AI chat widget — fixed, sits above all content */}
      <AIChatWidget />

      {/* Help panel — fixed slide-in, rendered once for all dashboard routes */}
      <HelpPanel />

      {/* Toast notification stack — bottom-left, above everything */}
      <ToastProvider />
    </div>
  );
}

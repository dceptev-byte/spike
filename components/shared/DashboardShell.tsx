'use client';

import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import TopBar from '@/components/shared/TopBar';
import AIChatWidget from '@/components/ai/AIChatWidget';
import HelpPanel from '@/components/onboarding/HelpPanel';
import ToastProvider from '@/components/shared/ToastProvider';

/**
 * Client-side shell for the dashboard layout.
 *
 * Extracted from (dashboard)/layout.tsx so that the layout itself can remain
 * a Server Component — required by Next.js 14 App Router when the route group
 * layout serves pages that export `metadata` or other server-only features.
 *
 * All interactive state (mobile sidebar toggle) lives here.
 */
export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
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

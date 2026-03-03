'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore, type Toast, type ToastVariant } from '@/lib/store/toastStore';

// ---------------------------------------------------------------------------
// Style map
// ---------------------------------------------------------------------------

const VARIANT_STYLES: Record<
  ToastVariant,
  { bar: string; icon: React.ElementType; iconCls: string }
> = {
  success: { bar: 'border-l-emerald-500', icon: CheckCircle2, iconCls: 'text-emerald-500' },
  error:   { bar: 'border-l-red-500',     icon: AlertCircle,  iconCls: 'text-red-500'     },
  info:    { bar: 'border-l-blue-500',    icon: Info,         iconCls: 'text-blue-500'    },
};

// ---------------------------------------------------------------------------
// Single toast item
// ---------------------------------------------------------------------------

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { bar, icon: Icon, iconCls } = VARIANT_STYLES[toast.variant];

  return (
    <div
      role="alert"
      className={[
        'flex items-center gap-3 rounded-xl bg-white border border-gray-200',
        'border-l-4', bar,
        'shadow-lg shadow-black/5 px-4 py-3 min-w-[260px] max-w-sm',
      ].join(' ')}
    >
      <Icon size={16} className={`flex-shrink-0 ${iconCls}`} aria-hidden="true" />
      <span className="flex-1 text-sm font-medium text-gray-800 leading-snug">
        {toast.message}
      </span>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider — rendered once in the dashboard layout
// ---------------------------------------------------------------------------

export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 left-6 z-[60] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}

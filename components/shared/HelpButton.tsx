'use client';

import { HelpCircle } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';

interface HelpButtonProps {
  collapsed: boolean;
}

export default function HelpButton({ collapsed }: HelpButtonProps) {
  const { toggleHelpPanel } = useUIStore();

  return (
    <li>
      <button
        onClick={toggleHelpPanel}
        title={collapsed ? 'Help' : undefined}
        className={[
          'w-full flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
          'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          collapsed ? 'justify-center px-2' : 'px-3',
        ].join(' ')}
      >
        <HelpCircle size={17} className="flex-shrink-0" />
        {!collapsed && <span>Help</span>}
      </button>
    </li>
  );
}

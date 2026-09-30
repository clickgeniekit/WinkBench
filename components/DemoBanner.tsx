'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, X, ChevronRight } from 'lucide-react';

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-navy-900 text-slate-100 text-xs py-2 px-4 border-b border-navy-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase border border-teal-500/30 shrink-0">
            Phase 1 Foundation
          </span>
          <p className="truncate text-slate-300">
            WinkBench Preview: Live UI, Directory, Profile Template & Responsive Design. Firebase Auth & Cloud Firestore will connect in Phase 2.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/about"
            className="text-teal-300 hover:text-teal-200 font-medium inline-flex items-center gap-0.5 underline underline-offset-2"
          >
            System Architecture
            <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

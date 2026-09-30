'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface TrustBadgeProps {
  score: number; // 0 to 100
  ratingTier?: string;
  showExplanation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrustBadge({
  score,
  ratingTier = 'High',
  showExplanation = false,
  size = 'md',
}: TrustBadgeProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Color coding based on score
  const getBadgeStyle = (val: number) => {
    if (val >= 90) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (val >= 80) return 'bg-teal-50 text-teal-800 border-teal-200';
    if (val >= 70) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getPill = (val: number) => {
    if (val >= 90) return 'bg-emerald-600 text-white';
    if (val >= 80) return 'bg-teal-600 text-white';
    if (val >= 70) return 'bg-amber-600 text-white';
    return 'bg-slate-600 text-white';
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium text-xs tracking-tight ${getBadgeStyle(
          score
        )}`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Trust Score:</span>
        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${getPill(score)}`}>
          {score}/100
        </span>
        <span className="text-[11px] opacity-80">({ratingTier})</span>
      </div>

      {showExplanation && (
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label="How is Trust Score calculated?"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}

      {showTooltip && (
        <div className="absolute z-30 bottom-full left-0 mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl leading-relaxed">
          <p className="font-semibold mb-1 text-slate-100">WinkBench Trust Score</p>
          <p className="text-slate-300">
            A separate platform indicator independent of star ratings. Evaluates corporate registration, domain ownership verification, customer response rate, dispute resolution, and review authenticity audit trails.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-slate-400">
            Cannot be purchased or artificially inflated by paid plans.
          </div>
        </div>
      )}
    </div>
  );
}

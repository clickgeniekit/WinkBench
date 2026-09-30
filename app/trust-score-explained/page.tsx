'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Star, AlertCircle, Scale, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export default function TrustScoreExplainedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Methodology & Transparency
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
          How WinkBench Evaluates Trust
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          At WinkBench, we deliberately maintain two separate, unbundled metrics: the <strong>Customer Star Rating</strong> and the independent <strong>WinkBench Trust Score</strong>.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Customer Rating */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-950">1. Customer Rating</h2>
              <span className="text-xs text-slate-400">Scale: 1.0 to 5.0 Stars</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The customer rating is the direct statistical representation of verified consumer experiences submitted on WinkBench.
          </p>
          <ul className="text-xs space-y-2 text-slate-700 border-t border-slate-100 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Calculated as the arithmetic mean of all eligible reviews.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Flagged reviews under active moderation are withheld until verified.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full rating distributions (5, 4, 3, 2, 1 stars) are openly disclosed.</span>
            </li>
          </ul>
        </div>

        {/* Trust Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-950">2. WinkBench Trust Score</h2>
              <span className="text-xs text-slate-400">Scale: 0 to 100 Index</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            An algorithmic index evaluating structural integrity, official entity standing, and operational transparency.
          </p>
          <ul className="text-xs space-y-2 text-slate-700 border-t border-slate-100 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Corporate registry validation (Companies House, SEC, ASIC).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Domain authenticity, SSL age, and DNS verification.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Response velocity and formal dispute resolution metrics.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Non-Negotiable Charter */}
      <div className="bg-navy-950 text-white rounded-2xl p-8 space-y-4 border border-navy-800">
        <div className="flex items-center gap-2 text-teal-400">
          <Lock className="w-5 h-5" />
          <h3 className="font-bold text-base">The Non-Negotiable Independence Guarantee</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-navy-900/80 p-4 rounded-xl border border-navy-800 space-y-1">
            <h4 className="font-bold text-white">Never For Sale</h4>
            <p>No business, advertiser, or agency can pay to raise, boost, or alter a Trust Score. Subscriptions never influence algorithms.</p>
          </div>
          <div className="bg-navy-900/80 p-4 rounded-xl border border-navy-800 space-y-1">
            <h4 className="font-bold text-white">Full Score History</h4>
            <p>Trust Score changes are archived with historical timestamps and documented audit reasons to ensure platform transparency.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          Explore Business Directory with Trust Scores
        </Link>
      </div>

    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Building2, PenSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CommunityRedirectPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <Star className="w-8 h-8 fill-blue-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          WinkBench is Dedicated to Authentic Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          To maintain absolute integrity and prevent promotional noise, WinkBench is focused exclusively on verified customer reviews of businesses and website domains.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/directory"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          Browse Business Directory
        </Link>
        <Link
          href="/write-review"
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <PenSquare className="w-4 h-4" />
          Write a Review
        </Link>
      </div>
    </div>
  );
}

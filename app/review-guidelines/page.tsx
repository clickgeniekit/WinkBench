'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Check, X, AlertCircle } from 'lucide-react';

export default function ReviewGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      <div className="space-y-4">
        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Trust & Safety
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
          WinkBench Review Guidelines
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          These guidelines outline our standards for all reviews published on WinkBench.com to ensure authentic, helpful, and legally compliant consumer discourse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Do's */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            What to Include in Your Review
          </h2>
          <ul className="text-xs text-emerald-900 space-y-2.5">
            <li><strong>Genuine personal experience:</strong> Detail your own transaction, service contract, delivery, or support interaction.</li>
            <li><strong>Specific, factual context:</strong> Mention dates, service types, and clear timelines.</li>
            <li><strong>Constructive tone:</strong> Describe both what went well and where the company fell short.</li>
            <li><strong>Objective feedback:</strong> Stick to provable facts and honest reflections.</li>
          </ul>
        </div>

        {/* Don'ts */}
        <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-rose-950 flex items-center gap-2">
            <X className="w-5 h-5 text-rose-600" />
            What is Strictly Prohibited
          </h2>
          <ul className="text-xs text-rose-900 space-y-2.5">
            <li><strong>Incentivized reviews:</strong> Reviews written in exchange for discounts, payment, free gifts, or rebates.</li>
            <li><strong>Competitor defamation:</strong> Writing negative reviews targeting market rivals.</li>
            <li><strong>Employee self-reviews:</strong> Employees reviewing their own current or former employer.</li>
            <li><strong>Doxxing & private data:</strong> Including home addresses, phone numbers, or private personnel names.</li>
          </ul>
        </div>

      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
        <h3 className="font-bold text-sm text-navy-950">Moderation and Verification Protocol</h3>
        <p>
          WinkBench employs automated anomaly detection and a human Trust & Safety compliance team. When a review is flagged or disputed, the author may be prompted to provide neutral evidence of transaction (such as a redacted receipt, order confirmation, or service agreement).
        </p>
        <p>
          Businesses cannot delete customer reviews on their own authority. If a dispute is filed, our neutral moderators review both parties' evidence before any action is taken.
        </p>
      </div>

    </div>
  );
}

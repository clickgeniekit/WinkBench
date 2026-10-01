'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, HeartHandshake, Server, Globe2, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      
      {/* Title */}
      <div className="space-y-4">
        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          About WinkBench
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
          A Global Benchmark for Honest Business Reputation
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          WinkBench was created out of an urgent need in the digital economy: the erosion of trust caused by manipulated review scores, pay-to-play verification badges, and hidden negative feedback.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy-950">Independent Trust Score</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our Trust Score is mathematically decoupled from user star ratings and cannot be altered through sponsorship, advertising, or subscription tier upgrades.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy-950">Two-Way Verified Dialogue</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Businesses have a rightful voice to respond to customer inquiries and correct factual misunderstandings, but they can never hide, alter, or remove critical reviews.
          </p>
        </div>
      </div>

      {/* Architecture & Engineering Standards */}
      <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-teal-700" />
          <h2 className="text-base font-bold text-navy-950">Engineering & Deployment Architecture</h2>
        </div>
        <p className="text-slate-700 leading-relaxed">
          WinkBench is built with a modern, portable full-stack architecture tailored for production reliability:
        </p>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Framework:</strong> Next.js App Router with TypeScript and strict type checking.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Production Hosting Target:</strong> Hostinger Node.js runtime with zero vendor lock-in to proprietary cloud functions.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Data Engine (Planned):</strong> Hostinger MySQL with Drizzle ORM for robust relational schema integrity, foreign keys, and role-based access control.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Zero Compromise:</strong> Server-side authorization prevents browser-level privilege spoofing.</span>
          </li>
        </ul>
      </div>

      {/* Navigation CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/directory"
          className="w-full sm:w-auto px-6 py-3 bg-navy-900 text-white text-xs font-bold rounded-xl hover:bg-navy-800 transition-colors text-center"
        >
          Explore Companies Directory
        </Link>
        <Link
          href="/trust-score-explained"
          className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors text-center"
        >
          Trust Score Methodology
        </Link>
      </div>

    </div>
  );
}

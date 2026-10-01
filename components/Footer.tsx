'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Globe2, HeartHandshake, Server, Database } from 'lucide-react';
import WinkBenchLogo from './WinkBenchLogo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800 text-xs">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 bg-slate-900/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Dynamic Domain Indexing</h4>
              <p className="text-[11px] text-slate-400">Search any website domain worldwide to read or post permanent reviews.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Global Country Reach</h4>
              <p className="text-[11px] text-slate-400">Supports all 200+ nations. Buyers and businesses across every continent.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Hostinger Native Runtime</h4>
              <p className="text-[11px] text-slate-400">100% self-hosted persistent database. No external Firebase dependency.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <WinkBenchLogo size="md" variant="light" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              WinkBench.com is an independent global business reviews and reputation platform. Discover trustworthy businesses, search any domain, and read verified customer feedback.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
              <Server className="w-3 h-3 text-blue-400" />
              Hostinger Platform Target
            </div>
          </div>

          {/* Directory Column */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Browse & Discover</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/directory" className="hover:text-blue-400 transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-blue-400 transition-colors">
                  All Global Categories
                </Link>
              </li>
              <li>
                <Link href="/write-review" className="hover:text-blue-400 transition-colors font-semibold text-blue-400">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link href="/company/vccshoppro.com" className="hover:text-blue-400 transition-colors">
                  Check Domain Profile (e.g. vccshoppro.com)
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards Column */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Dashboards & Portals</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/dashboard/user" className="hover:text-blue-400 transition-colors">
                  User Dashboard & My Reviews
                </Link>
              </li>
              <li>
                <Link href="/user/demo-user" className="hover:text-blue-400 transition-colors">
                  User Public Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/company" className="hover:text-blue-400 transition-colors">
                  Company Owner Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition-colors">
                  Admin Management Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Policies Column */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Transparency & Rules</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About WinkBench
                </Link>
              </li>
              <li>
                <Link href="/trust-score-explained" className="hover:text-blue-400 transition-colors">
                  Trust Score Methodology
                </Link>
              </li>
              <li>
                <Link href="/review-guidelines" className="hover:text-blue-400 transition-colors">
                  Review Guidelines
                </Link>
              </li>
              <li>
                <Link href="/for-businesses" className="hover:text-blue-400 transition-colors">
                  Claim Company Profile
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} WinkBench.com. Hosted on Hostinger. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400">About</Link>
            <Link href="/review-guidelines" className="hover:text-slate-400">Guidelines</Link>
            <Link href="/directory" className="hover:text-slate-400">Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Globe2, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 mt-auto border-t border-navy-800 text-sm">
      {/* Top Value Banner */}
      <div className="border-b border-navy-800/80 bg-navy-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Unbiased Trust Score</h4>
              <p className="text-xs text-slate-400">Independent rating algorithm. Not purchasable by any business.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Global Coverage</h4>
              <p className="text-xs text-slate-400">Serving buyers and businesses across the US, UK, Canada, Australia, and worldwide.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-700/50 flex items-center justify-center text-teal-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Authentic Human Voices</h4>
              <p className="text-xs text-slate-400">Audit-trailed reviews, verified purchase tags, and business replies.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-white ring-1 ring-white/10">
                <span className="font-bold text-base text-teal-400">W</span>
                <span className="font-bold text-xs -ml-0.5 text-white">B</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Wink<span className="text-teal-400">Bench</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              WinkBench.com is a global business reviews, reputation, and community platform. We empower consumers to make informed buying decisions and help honorable businesses demonstrate authentic credibility.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-teal-950 text-teal-300 border border-teal-800">
                Phase 1 Preview
              </span>
              <span className="text-xs text-slate-500">
                Hostinger Next.js Architecture
              </span>
            </div>
          </div>

          {/* Directory Column */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/directory" className="hover:text-teal-400 transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-teal-400 transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link href="/write-review" className="hover:text-teal-400 transition-colors">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-teal-400 transition-colors">
                  Community Discussions
                </Link>
              </li>
              <li>
                <Link href="/directory?country=US" className="hover:text-teal-400 transition-colors">
                  United States Businesses
                </Link>
              </li>
              <li>
                <Link href="/directory?country=GB" className="hover:text-teal-400 transition-colors">
                  United Kingdom Businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">For Businesses</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/for-businesses" className="hover:text-teal-400 transition-colors">
                  Claim Your Company Profile
                </Link>
              </li>
              <li>
                <Link href="/trust-score-explained" className="hover:text-teal-400 transition-colors">
                  Trust Score Methodology
                </Link>
              </li>
              <li>
                <Link href="/review-guidelines" className="hover:text-teal-400 transition-colors">
                  Review Verification Policy
                </Link>
              </li>
              <li>
                <Link href="/business-owner-portal" className="hover:text-teal-400 transition-colors">
                  Business Owner Portal
                </Link>
              </li>
              <li>
                <Link href="/moderation-appeals" className="hover:text-teal-400 transition-colors">
                  Dispute & Appeals System
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Legal */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Policies & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  About WinkBench
                </Link>
              </li>
              <li>
                <Link href="/review-guidelines" className="hover:text-teal-400 transition-colors">
                  Review Guidelines
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-teal-400 transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy (Draft)
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-teal-400 transition-colors">
                  Terms of Service (Draft)
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-teal-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-8 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WinkBench.com. All rights reserved. Original platform design & implementation.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-400">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-slate-400">Terms</Link>
            <Link href="/cookies" className="hover:text-slate-400">Cookies</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

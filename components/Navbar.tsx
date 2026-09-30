'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  Shield, 
  Building2, 
  PenSquare, 
  Users, 
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/directory?q=${encodeURIComponent(headerSearch.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-md">
            <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
              <span className="font-extrabold text-lg tracking-tighter text-teal-400">W</span>
              <span className="font-bold text-xs -ml-0.5 text-white">B</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-navy-900 leading-none">
                Wink<span className="text-teal-600">Bench</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-tight">
                Global Trust Platform
              </span>
            </div>
          </Link>

          {/* Search bar in header (desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search company, brand, or service..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link 
              href="/directory" 
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 py-1"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              Directory
            </Link>
            <Link 
              href="/categories" 
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 py-1"
            >
              Categories
            </Link>
            <Link 
              href="/community" 
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 py-1"
            >
              <Users className="w-4 h-4 text-slate-400" />
              Community
            </Link>
            <Link 
              href="/write-review" 
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 py-1"
            >
              <PenSquare className="w-4 h-4 text-slate-400" />
              Write Review
            </Link>
            <Link 
              href="/for-businesses" 
              className="hover:text-teal-700 transition-colors flex items-center gap-1.5 py-1 text-slate-600 hover:text-navy-900"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              For Businesses
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-navy-800 hover:text-teal-700 px-3 py-1.5 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Join Free
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-navy-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search companies or categories..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 text-sm font-medium text-slate-800">
            <Link
              href="/directory"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              Company Directory
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              Categories
            </Link>
            <Link
              href="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-slate-500" />
              Community Discussions
            </Link>
            <Link
              href="/write-review"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2 text-teal-700"
            >
              <PenSquare className="w-4 h-4 text-teal-600" />
              Write a Review
            </Link>
            <Link
              href="/for-businesses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              For Businesses (Claim Profile)
            </Link>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm font-semibold text-navy-800 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800"
            >
              Join WinkBench
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

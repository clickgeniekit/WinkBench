'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  Building2, 
  PenSquare, 
  Layers, 
  User, 
  ShieldAlert,
  LayoutDashboard
} from 'lucide-react';
import WinkBenchLogo from './WinkBenchLogo';
import { normalizeDomain, isDomainQuery } from '@/lib/utils/domain';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = headerSearch.trim();
    if (!query) return;

    // Trustpilot-style direct domain check!
    // If the user typed a URL or domain (e.g. https://vccshoppro.com, www.vccshoppro.com, vccshoppro.com)
    if (isDomainQuery(query) || query.includes('http://') || query.includes('https://') || query.includes('www.')) {
      const cleanDomain = normalizeDomain(query);
      router.push(`/company/${cleanDomain}`);
      setHeaderSearch('');
      setMobileMenuOpen(false);
      return;
    }

    // Otherwise, keyword / category / location search in directory
    router.push(`/directory?q=${encodeURIComponent(query)}`);
    setHeaderSearch('');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo with uploaded user artwork & brand mark */}
          <Link href="/" className="flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
            <WinkBenchLogo size="md" />
          </Link>

          {/* Smart Search Bar in header (Direct domain or keyword search) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search domain (e.g. vccshoppro.com) or business..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <Link 
              href="/directory" 
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-1"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Categories & Directory
            </Link>
            <Link 
              href="/write-review" 
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-1 text-blue-600 font-bold"
            >
              <PenSquare className="w-3.5 h-3.5" />
              Write a Review
            </Link>
            <Link 
              href="/dashboard/company" 
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-1"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              For Businesses
            </Link>
            <Link 
              href="/dashboard/user" 
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-1"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              My Account
            </Link>
            <Link 
              href="/admin" 
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
              Admin
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/write-review"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <PenSquare className="w-3.5 h-3.5" />
              Review a Company
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search domain (e.g. vccshoppro.com)..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-800">
            <Link
              href="/directory"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              Browse Directory & Categories
            </Link>
            <Link
              href="/write-review"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-bold"
            >
              <PenSquare className="w-4 h-4" />
              Write a Review
            </Link>
            <Link
              href="/dashboard/user"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-slate-500" />
              User Dashboard
            </Link>
            <Link
              href="/dashboard/company"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              Company Owner Dashboard
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-600"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              Admin Management Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

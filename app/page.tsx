'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShieldCheck, 
  Star, 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CreditCard,
  Cpu,
  ShoppingBag,
  Activity,
  Plane,
  Home,
  Briefcase,
  Car,
  Globe2,
  FileText
} from 'lucide-react';
import { GLOBAL_CATEGORIES } from '@/lib/categories';
import { COUNTRIES } from '@/lib/countries';
import { DEMO_COMPANIES, DEMO_REVIEWS } from '@/lib/demoData';
import CompanyCard from '@/components/CompanyCard';
import ReviewCard from '@/components/ReviewCard';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';
import { normalizeDomain, isDomainQuery } from '@/lib/utils/domain';

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    // Trustpilot-style direct domain check!
    if (isDomainQuery(query) || query.includes('http://') || query.includes('https://') || query.includes('www.')) {
      const cleanDomain = normalizeDomain(query);
      router.push(`/company/${cleanDomain}`);
      return;
    }

    // Otherwise directory filter
    const params = new URLSearchParams();
    params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCountry) params.set('country', selectedCountry);
    router.push(`/directory?${params.toString()}`);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'Plane': return <Plane className="w-5 h-5 text-blue-600" />;
      case 'Home': return <Home className="w-5 h-5 text-blue-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Car': return <Car className="w-5 h-5 text-blue-600" />;
      default: return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Independent Global Business Reviews & Trust Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Read real customer reviews.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
              Search any company or website domain.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search any website domain worldwide to read authentic feedback. If a company is unlisted, WinkBench auto-generates a permanent profile so you can post the very first review!
          </p>

          {/* Prominent Search Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-900 max-w-3xl mx-auto border border-slate-200">
            <form onSubmit={handleHeroSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Enter domain (e.g. example.com, www.example.com) or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-slate-50 text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-3 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="">All Categories</option>
                  {GLOBAL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="py-3 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium max-w-[160px]"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flagEmoji} {c.name}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick search example domains (Trustpilot style!) */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
              <span className="font-semibold text-slate-400">Direct Domain Tryout:</span>
              <button 
                type="button" 
                onClick={() => router.push('/company/example.com')}
                className="hover:text-blue-600 text-slate-700 font-mono font-medium underline underline-offset-2"
              >
                example.com
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => router.push('/company/www.example.com')}
                className="hover:text-blue-600 text-slate-700 font-mono font-medium underline underline-offset-2"
              >
                www.example.com
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => router.push('/company/aurora-payments-global')}
                className="hover:text-blue-600 text-slate-700 font-medium underline underline-offset-2"
              >
                Aurora Payments
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => router.push('/company/nordicstack-cloud')}
                className="hover:text-blue-600 text-slate-700 font-medium underline underline-offset-2"
              >
                NordicStack Cloud
              </button>
            </div>
          </div>

          {/* Core metrics */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <p className="text-xl sm:text-2xl font-black text-white">Dynamic</p>
              <p className="text-xs text-slate-400">Any domain auto-creates profile</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <p className="text-xl sm:text-2xl font-black text-blue-400">100%</p>
              <p className="text-xs text-slate-400">Unpurchasable Trust Score</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <p className="text-xl sm:text-2xl font-black text-white">200+</p>
              <p className="text-xs text-slate-400">Global Countries Supported</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <p className="text-xl sm:text-2xl font-black text-blue-400">Hostinger</p>
              <p className="text-xs text-slate-400">Persistent local database</p>
            </div>
          </div>

        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Star className="w-6 h-6 fill-blue-600 text-blue-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Instant Domain Indexing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Just like Trustpilot, search any website domain. If no one has reviewed it yet, a permanent profile is instantly created ready for your review.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Independent Trust Scores</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Completely separate from user stars. Evaluates corporate domain standing, business verification, and dispute resolution. Never for sale.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Building2 className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Verified Company Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Business owners can claim their profile to publicly reply to customer reviews, broadcast official announcements, and publish articles.
            </p>
          </div>
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore Trustpilot-Style Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Browse verified businesses and reviews organized by global industry sectors</p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            All Categories & Subcategories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GLOBAL_CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/directory?category=${cat.slug}`}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{cat.companyCount.toLocaleString()} businesses</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED BUSINESSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Featured Business Profiles</h2>
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                Verified Directory
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Companies demonstrating high transparency, verified credentials, and prompt customer reply times.</p>
          </div>
          <Link
            href="/directory"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Explore Full Directory <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_COMPANIES.slice(0, 6).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      {/* RECENT REVIEWS FEED */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Customer Reviews</h2>
              <p className="text-xs text-slate-500 mt-1">Real feedback submitted by consumers worldwide with public business responses</p>
            </div>
            <Link
              href="/write-review"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Write a Review Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEMO_REVIEWS.slice(0, 4).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* DUAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Consumer CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-8 flex flex-col justify-between border border-slate-800 shadow-md">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                For Consumers
              </span>
              <h3 className="text-2xl font-bold leading-snug">
                Used a company or website recently?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Post your honest review. Even if the website isn&apos;t listed yet, entering their domain creates a profile and alerts the company.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/write-review"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md"
              >
                Write a Review
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Business CTA */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-slate-200 shadow-md">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                For Business Owners
              </span>
              <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                Claim your company profile on WinkBench
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Respond to customer feedback directly, publish company announcements, share blog articles, and demonstrate verified integrity.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/dashboard/company"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-sm"
              >
                Access Company Owner Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

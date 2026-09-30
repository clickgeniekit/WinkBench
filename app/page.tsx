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
  Car
} from 'lucide-react';
import { DEMO_CATEGORIES, DEMO_COMPANIES, DEMO_REVIEWS, DEMO_COMMUNITY_POSTS } from '@/lib/demoData';
import CompanyCard from '@/components/CompanyCard';
import ReviewCard from '@/components/ReviewCard';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCountry) params.set('country', selectedCountry);
    router.push(`/directory?${params.toString()}`);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-teal-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-teal-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-teal-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-600" />;
      case 'Plane': return <Plane className="w-5 h-5 text-teal-600" />;
      case 'Home': return <Home className="w-5 h-5 text-teal-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-teal-600" />;
      case 'Car': return <Car className="w-5 h-5 text-teal-600" />;
      default: return <Building2 className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-600/40 text-teal-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Independent & Unbought Business Reputation Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Real customer experiences.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-teal-200 to-emerald-400">
              Transparent Trust Scores.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover verified businesses worldwide. Read authentic reviews with audit trails, evaluate our unpurchasable Trust Score, and hold companies accountable.
          </p>

          {/* Prominent Search Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-900 max-w-3xl mx-auto border border-slate-200">
            <form onSubmit={handleHeroSearch} className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Search by company name, website, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl focus:outline-none focus:bg-slate-50 text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-3 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="">All Categories</option>
                  {DEMO_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="py-3 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="SE">Sweden</option>
                  <option value="CH">Switzerland</option>
                </select>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick search tags */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
              <span className="font-semibold text-slate-400">Trending:</span>
              <button 
                type="button" 
                onClick={() => { setSearchTerm('Aurora'); router.push('/directory?q=Aurora'); }}
                className="hover:text-teal-700 text-slate-600 underline underline-offset-2"
              >
                Aurora Payments
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => { setSearchTerm('NordicStack'); router.push('/directory?q=NordicStack'); }}
                className="hover:text-teal-700 text-slate-600 underline underline-offset-2"
              >
                NordicStack Cloud
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => { setSelectedCategory('financial-services'); router.push('/directory?category=financial-services'); }}
                className="hover:text-teal-700 text-slate-600 underline underline-offset-2"
              >
                Financial Services
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => { setSelectedCategory('home-services'); router.push('/directory?category=home-services'); }}
                className="hover:text-teal-700 text-slate-600 underline underline-offset-2"
              >
                Solar & Home Tech
              </button>
            </div>
          </div>

          {/* Social Proof metrics */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-navy-800/40 border border-navy-700/60 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400">Unpurchasable Trust Score</p>
            </div>
            <div className="bg-navy-800/40 border border-navy-700/60 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-bold text-teal-400">Dual</p>
              <p className="text-xs text-slate-400">Ratings & Trust Factors</p>
            </div>
            <div className="bg-navy-800/40 border border-navy-700/60 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-bold text-white">Full</p>
              <p className="text-xs text-slate-400">Audit-Trailed Reviews</p>
            </div>
            <div className="bg-navy-800/40 border border-navy-700/60 rounded-xl p-3">
              <p className="text-xl sm:text-2xl font-bold text-teal-400">Global</p>
              <p className="text-xs text-slate-400">US, UK, CA, AU & EU</p>
            </div>
          </div>

        </div>
      </section>

      {/* CORE VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Why buyers and businesses choose WinkBench
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Built from first principles to eradicate fake review syndicates and pay-to-play badge schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Star className="w-6 h-6 fill-teal-600 text-teal-700" />
            </div>
            <h3 className="font-bold text-lg text-navy-950">1. Verified Customer Reviews</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every review records specific experience dates, invoice or purchase receipt validation signals, and strict spam detection before publication.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg text-navy-950">2. Independent Trust Score</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kept strictly separate from customer stars. Assesses legal entity checks, domain legitimacy, response resolution, and dispute history. Cannot be bought.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-navy-950">3. Honest Two-Way Dialogue</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Claimed business owners can publicly respond to resolve disputes, but are strictly prohibited from hiding, editing, or suppressing negative feedback.
            </p>
          </div>
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Browse by Category</h2>
            <p className="text-xs text-slate-500 mt-1">Explore verified businesses across major industry sectors</p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/directory?category=${cat.slug}`}
              className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-teal-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-teal-50 group-hover:border-teal-200 transition-colors">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-bold text-sm text-navy-950 mt-3 group-hover:text-teal-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{cat.companyCount.toLocaleString()} companies</span>
                <span className="text-teal-600 font-semibold group-hover:translate-x-0.5 transition-transform">Explore →</span>
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
              <h2 className="text-2xl font-bold text-navy-950">Featured Business Profiles</h2>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                Demo Dataset
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Companies demonstrating high transparency, verified credentials, and prompt response times.</p>
          </div>
          <Link
            href="/directory"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            Explore Full Directory ({DEMO_COMPANIES.length}+) <ChevronRight className="w-4 h-4" />
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
              <h2 className="text-2xl font-bold text-navy-950">Recent Customer Reviews</h2>
              <p className="text-xs text-slate-500 mt-1">Real reviews submitted by verified consumers with company responses</p>
            </div>
            <Link
              href="/write-review"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
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

      {/* COMMUNITY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Community Discussions & Guides</h2>
            <p className="text-xs text-slate-500 mt-1">Consumers discussing purchasing decisions, contractual gotchas, and rights</p>
          </div>
          <Link
            href="/community"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            Visit Community <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_COMMUNITY_POSTS.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {post.category}
                </span>
                <h3 className="font-bold text-sm text-navy-950 mt-3 hover:text-teal-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>By {post.authorName} ({post.authorCountry})</span>
                <span className="flex items-center gap-2">
                  <span>👍 {post.likesCount}</span>
                  <span>💬 {post.commentsCount}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DUAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Consumer CTA */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-8 flex flex-col justify-between border border-navy-800 shadow-md">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                For Consumers
              </span>
              <h3 className="text-2xl font-bold leading-snug">
                Had an experience with a business recently?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether exceptional or disappointing, your feedback helps buyers make informed decisions and prompts companies to improve their standards.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/write-review"
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
              >
                Write a Review
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Business CTA */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-slate-200/90 shadow-md">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                For Business Owners
              </span>
              <h3 className="text-2xl font-bold text-navy-950 leading-snug">
                Claim your company profile on WinkBench
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify ownership, respond to customer feedback directly, showcase company updates, and access permitted analytics. Free to start.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/for-businesses"
                className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
              >
                Claim Your Company Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

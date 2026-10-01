'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Star, 
  MessageSquare, 
  Bookmark, 
  Bell, 
  Settings, 
  ExternalLink, 
  PenSquare, 
  Trash2, 
  CheckCircle2, 
  Globe2,
  ThumbsUp
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import { COUNTRIES } from '@/lib/countries';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'saved' | 'notifications' | 'settings'>('reviews');
  
  // User profile state
  const [displayName, setDisplayName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [country, setCountry] = useState('US');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // User's reviews
  const [myReviews, setMyReviews] = useState([
    {
      id: 'rev-usr-1',
      companyName: 'Aurora Payments Global',
      companySlug: 'aurora-payments-global',
      rating: 5,
      title: 'Flawless multi-currency payout processing',
      content: 'Settlement delays dropped from 4 business days to same-day EUR and USD clearing. Dedicated technical support was top-tier.',
      createdAt: '2026-09-18T10:00:00Z',
      helpfulCount: 14,
      reply: 'Thank you Alex! Swift clearing is our highest priority.',
    },
    {
      id: 'rev-usr-2',
      companyName: 'NordicStack Cloud',
      companySlug: 'nordicstack-cloud',
      rating: 4,
      title: 'Fast hosting and true green energy credentials',
      content: 'Excellent latency across European clusters. Uptime has remained exceptional over the past year.',
      createdAt: '2026-08-20T14:30:00Z',
      helpfulCount: 6,
    }
  ]);

  const [savedCompanies] = useState([
    { id: '1', name: 'Pacific Heritage Coffee Co.', slug: 'pacific-heritage-coffee-co', rating: 4.9, reviews: 1240 },
    { id: '2', name: 'Vanguard Solar & Battery Solutions', slug: 'vanguard-solar-battery-solutions', rating: 4.4, reviews: 186 },
  ]);

  const handleDeleteReview = (id: string) => {
    if (confirm('Are you sure you want to remove this review?')) {
      setMyReviews(myReviews.filter((r) => r.id !== id));
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* User Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
            {displayName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900">{displayName}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Verified Reviewer
              </span>
            </div>
            <p className="text-xs text-slate-500">{email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                {COUNTRIES.find((c) => c.code === country)?.name || 'United States'}
              </span>
              <span>·</span>
              <span>{myReviews.length} Reviews Written</span>
              <span>·</span>
              <span>Member since 2026</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/write-review"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <PenSquare className="w-3.5 h-3.5" />
            Write New Review
          </Link>
          <Link
            href={`/user/alex-morgan`}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          My Reviews ({myReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Companies ({savedCompanies.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Account Settings
        </button>
      </div>

      {/* TAB 1: My Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {myReviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/company/${rev.companySlug}`}
                    className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {rev.companyName}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={rev.rating} size="sm" showNumber />
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-slate-400 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{rev.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>

              {rev.reply && (
                <div className="bg-slate-50 border-l-4 border-l-blue-600 p-3 rounded-lg text-xs space-y-1 mt-3">
                  <span className="font-bold text-slate-800">Response from {rev.companyName}:</span>
                  <p className="text-slate-600">{rev.reply}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {rev.helpfulCount} people found this helpful
                </span>
                <span className="text-emerald-700 font-semibold">Status: Published (Hostinger Database)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Saved Companies */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedCompanies.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <Link href={`/company/${c.slug}`} className="font-bold text-sm text-slate-900 hover:text-blue-600">
                  {c.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={c.rating} size="sm" showNumber />
                  <span className="text-xs text-slate-400">({c.reviews} reviews)</span>
                </div>
              </div>
              <Link
                href={`/company/${c.slug}`}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View Profile →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
            <span className="font-bold text-blue-900 block">Company Reply Received</span>
            <p className="text-slate-600">
              <strong>Aurora Payments Global</strong> replied to your review: <em>"Thank you Alex! Swift clearing is our highest priority."</em>
            </p>
            <span className="text-[10px] text-slate-400 block pt-1">2 days ago</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 block">Review Helpful Vote</span>
            <p className="text-slate-600">3 users marked your review of NordicStack Cloud as helpful.</p>
            <span className="text-[10px] text-slate-400 block pt-1">1 week ago</span>
          </div>
        </div>
      )}

      {/* TAB 4: Account Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <h3 className="font-bold text-base text-slate-900">Personal Account Settings</h3>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings saved successfully in Hostinger platform storage.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Display Name (Public on reviews)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Your Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flagEmoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  CheckCircle, 
  Share2, 
  Flag, 
  PenSquare, 
  FileText, 
  Bell,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Info
} from 'lucide-react';
import { createDefaultCompany } from '@/lib/storage/client';
import { DEMO_REVIEWS, DEMO_UPDATES } from '@/lib/demoData';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';
import ReviewCard from '@/components/ReviewCard';
import { normalizeDomain } from '@/lib/utils/domain';
import { Company, Review, CompanyUpdate } from '@/types';

export default function CompanyProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Auto-creates or retrieves profile dynamically for ANY domain or slug (Trustpilot style!)
  const company = useMemo(() => {
    return createDefaultCompany(slug || 'winkbench.com');
  }, [slug]);

  const initialReviews = useMemo(() => {
    return DEMO_REVIEWS.filter(
      (r) => r.companySlug === slug || r.companyId === company.id
    );
  }, [slug, company.id]);

  const initialAnnouncements = useMemo(() => {
    return DEMO_UPDATES.filter((u) => u.companyId === company.id);
  }, [company.id]);

  const [activeTab, setActiveTab] = useState<'reviews' | 'announcements' | 'blog' | 'details'>('reviews');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live state loaded from database API
  const [liveCompany, setLiveCompany] = useState<Company>(company);
  const [liveReviews, setLiveReviews] = useState<Review[]>(initialReviews);
  const [liveAnnouncements, setLiveAnnouncements] = useState<CompanyUpdate[]>(initialAnnouncements);
  const [liveArticles, setLiveArticles] = useState<any[]>([]);

  // Report review modal state
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Spam or promotional content');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  React.useEffect(() => {
    setLiveCompany(company);
    setLiveReviews(initialReviews);
    setLiveAnnouncements(initialAnnouncements);
  }, [company, initialReviews, initialAnnouncements]);

  React.useEffect(() => {
    async function loadLiveData() {
      try {
        const res = await fetch(`/api/companies/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.company) setLiveCompany(data.company);
          if (data.reviews) setLiveReviews(data.reviews);
          if (data.announcements) setLiveAnnouncements(data.announcements);
          if (data.articles) setLiveArticles(data.articles);
        }
      } catch (err) {
        console.error('Error fetching live company data:', err);
      }
    }
    if (slug) {
      loadLiveData();
    }
  }, [slug]);

  // Filtered reviews
  const displayedReviews = useMemo(() => {
    if (filterRating === null) return liveReviews;
    return liveReviews.filter((r) => r.rating === filterRating);
  }, [liveReviews, filterRating]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReportReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReviewId) return;

    try {
      await fetch('/api/reviews/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: reportingReviewId,
          reason: reportReason,
          notes: reportNotes,
        }),
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportSubmitted(false);
        setReportingReviewId(null);
        setReportNotes('');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit report:', err);
    }
  };

  const totalRatingsCount =
    Object.values(liveCompany.ratingDistribution || {}).reduce((a, b) => a + b, 0) || liveCompany.reviewCount;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/directory" className="hover:text-blue-600">Directory</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/directory?category=${company.categorySlug}`} className="hover:text-blue-600">
            {company.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{company.name}</span>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white border-b border-slate-200 py-8 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Left Column: Logo & Company Core Info */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-black text-3xl flex items-center justify-center shadow-sm shrink-0">
                {company.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  {company.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Profile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      Unclaimed Business Profile
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-600 max-w-2xl">
                  {company.tagline}
                </p>

                {/* Metadata items */}
                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.city}, {company.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      {company.website.replace('https://', '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                  {company.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {company.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Actions (Write Review, Claim, Share) */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <Link
                href={`/write-review?company=${encodeURIComponent(company.name)}&slug=${company.slug}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PenSquare className="w-4 h-4" />
                Write a Review
              </Link>

              {!company.isClaimed && (
                <Link
                  href={`/for-businesses?claim=${company.slug}`}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Claim This Profile
                </Link>
              )}

              <button
                onClick={handleShare}
                className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? 'Link Copied!' : 'Share Profile'}
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Customer Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                {company.reviewCount > 0 ? (
                  <StarRating rating={company.customerRating} size="md" showNumber />
                ) : (
                  <span className="text-xs font-semibold text-slate-500">No reviews yet</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                From {company.reviewCount} customer reviews
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                WinkBench Trust Score
              </span>
              <div className="mt-1">
                <TrustBadge score={company.trustScore} ratingTier={company.trustScoreRating} showExplanation />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Independent platform indicator
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Profile Status
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {company.isClaimed ? 'Claimed by Business' : 'Unclaimed / Open Profile'}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Trustpilot-style permanent indexing
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Category
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {company.category}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Location: {company.country}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Tabs Required by user */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            1. Reviews ({liveReviews.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            2. Company Announcement ({liveAnnouncements.length})
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'blog'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            3. Company Blog ({liveArticles.length})
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            4. Company Details
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* TAB 1: Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Reviews Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
                  <p className="text-xs text-slate-500">Verified buyer experiences for {company.name}</p>
                </div>
                <Link
                  href={`/write-review?company=${encodeURIComponent(company.name)}&slug=${company.slug}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  Write a Review
                </Link>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {displayedReviews.length > 0 ? (
                  displayedReviews.map((review: Review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4 shadow-2xs">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-base text-slate-900">No reviews yet for {company.name}</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Be the first person in the world to post a review for this company! Your review will be indexed by Google and help millions of buyers make informed decisions.
                    </p>
                    <Link
                      href={`/write-review?company=${encodeURIComponent(company.name)}&slug=${company.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <PenSquare className="w-4 h-4" />
                      Post the First Review
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Rating Distribution */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Rating Breakdown</h3>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = company.ratingDistribution[stars as keyof typeof company.ratingDistribution] || 0;
                  const percentage = totalRatingsCount > 0 ? Math.round((count / totalRatingsCount) * 100) : 0;
                  return (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                      className={`w-full flex items-center gap-3 text-xs p-1 rounded-md transition-colors ${
                        filterRating === stars ? 'bg-blue-100 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-12 text-left font-medium text-slate-700">{stars} Stars</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-12 text-right text-slate-500">{percentage}%</span>
                    </button>
                  );
                })}
              </div>

              {!company.isClaimed && (
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-white">Own or represent {company.name}?</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Claim this business profile to reply publicly to customer reviews, broadcast official company announcements, and publish articles.
                  </p>
                  <Link
                    href={`/for-businesses?claim=${company.slug}`}
                    className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Claim This Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Company Announcements */}
        {activeTab === 'announcements' && (
          <div className="max-w-4xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Official Company Announcements</h2>
            <p className="text-xs text-slate-500">Updates and notices published directly by the verified company management.</p>

            {liveAnnouncements.length > 0 ? (
              <div className="space-y-4 pt-2">
                {liveAnnouncements.map((ann: any) => (
                  <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ann.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ann.priority === 'important' ? 'Important Notice' : 'Announcement'}
                      </span>
                      <span className="text-slate-400">{new Date(ann.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{ann.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{ann.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">
                No company announcements posted yet by {company.name}.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Company Blog / Articles */}
        {activeTab === 'blog' && (
          <div className="max-w-4xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Company Blog & Insights</h2>
            <p className="text-xs text-slate-500">Educational articles and updates published by {company.name}.</p>

            {liveArticles.length > 0 ? (
              <div className="space-y-4 pt-2">
                {liveArticles.map((art: any) => (
                  <article key={art.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {art.category || 'Article'}
                      </span>
                      <span className="text-slate-400">{new Date(art.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{art.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{art.content || art.summary}</p>
                    <div className="pt-2 text-xs text-slate-400">
                      Author: {art.authorName}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">
                No blog articles published yet by {company.name}.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Company Details */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-3xl space-y-6 text-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">About {company.name}</h2>
              <p className="text-slate-600 leading-relaxed mt-2 whitespace-pre-line">
                {company.description}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Company Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[11px]">Official Website</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                    {company.website}
                  </a>
                </div>
                {company.phone && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Telephone</span>
                    <span className="font-semibold text-slate-800">{company.phone}</span>
                  </div>
                )}
                {company.address && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Address</span>
                    <span className="font-semibold text-slate-800">{company.address}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <span className="font-semibold text-slate-800">{company.city}, {company.country}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

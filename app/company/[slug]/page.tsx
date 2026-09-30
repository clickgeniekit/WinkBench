'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  CheckCircle, 
  ShieldAlert, 
  Share2, 
  Flag, 
  PenSquare, 
  Clock, 
  FileText, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { DEMO_COMPANIES, DEMO_REVIEWS, DEMO_UPDATES } from '@/lib/demoData';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';
import ReviewCard from '@/components/ReviewCard';

export default function CompanyProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const company = DEMO_COMPANIES.find((c) => c.slug === slug);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedCompany, setReportedCompany] = useState(false);

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto" />
        <h1 className="text-2xl font-bold text-navy-950">Company Profile Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested company profile does not exist or may have been relocated.
        </p>
        <Link
          href="/directory"
          className="inline-block px-5 py-2.5 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  // Reviews for this company
  const companyReviews = DEMO_REVIEWS.filter((r) => r.companySlug === slug);
  const companyUpdates = DEMO_UPDATES.filter((u) => u.companyId === company.id);

  // Filtered reviews
  const displayedReviews = useMemo(() => {
    if (filterRating === null) return companyReviews;
    return companyReviews.filter((r) => r.rating === filterRating);
  }, [companyReviews, filterRating]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const totalRatingsCount = Object.values(company.ratingDistribution).reduce((a, b) => a + b, 0) || company.reviewCount;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/directory" className="hover:text-teal-700">Directory</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/directory?category=${company.categorySlug}`} className="hover:text-teal-700">
            {company.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{company.name}</span>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white border-b border-slate-200 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Left Column: Logo & Company Core Info */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 flex items-center justify-center text-navy-900 font-extrabold text-3xl shadow-sm shrink-0">
                {company.name.charAt(0)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                    {company.name}
                  </h1>
                  {company.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                      Verified Profile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      Unclaimed Profile
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
                      className="text-teal-700 hover:underline flex items-center gap-0.5"
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
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PenSquare className="w-4 h-4" />
                Write a Review
              </Link>

              {!company.isClaimed && (
                <Link
                  href={`/for-businesses?claim=${company.slug}`}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Claim This Profile
                </Link>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedLink ? 'Link Copied!' : 'Share Profile'}
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-rose-600 transition-colors"
                  title="Report company profile for inaccurate info"
                  aria-label="Report company profile"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Customer Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={company.customerRating} size="md" showNumber />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                From {company.reviewCount.toLocaleString()} verified reviews
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
                Independent platform assessment
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Response Rate
              </span>
              <p className="text-base font-bold text-navy-950 mt-1">
                {company.responseRate || 95}%
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Average reply in {company.responseTime || '< 24 hours'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Entity Verification
              </span>
              <p className="text-base font-bold text-navy-950 mt-1 flex items-center gap-1">
                {company.isVerified ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span className="text-slate-600">Pending Review</span>
                )}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Jurisdiction: {company.country}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: About, Star Breakdown & Reviews List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Company Box */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-navy-950">About {company.name}</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
            {company.address && (
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Registered Address: {company.address}</span>
              </div>
            )}
          </section>

          {/* Customer Reviews Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-navy-950">Customer Reviews</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing feedback submitted by verified consumers
                </p>
              </div>

              <Link
                href={`/write-review?company=${encodeURIComponent(company.name)}&slug=${company.slug}`}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg text-xs self-start sm:self-auto flex items-center gap-1.5"
              >
                <PenSquare className="w-3.5 h-3.5" />
                Write Review
              </Link>
            </div>

            {/* Rating Breakdown Bar Chart */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Rating Distribution
              </span>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = company.ratingDistribution[stars as keyof typeof company.ratingDistribution] || 0;
                const percentage = Math.round((count / totalRatingsCount) * 100) || 0;
                const isSelected = filterRating === stars;

                return (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setFilterRating(isSelected ? null : stars)}
                    className={`w-full flex items-center gap-3 text-xs p-1 rounded-md transition-colors ${
                      isSelected ? 'bg-teal-100 font-semibold' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-12 text-left font-medium text-slate-700">{stars} Stars</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-slate-500">{percentage}% ({count})</span>
                  </button>
                );
              })}

              {filterRating !== null && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-xs text-teal-700 hover:underline font-medium"
                  >
                    Clear Star Filter (Showing {filterRating}-star reviews only)
                  </button>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {displayedReviews.length > 0 ? (
                displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    No reviews found for this specific filter.
                  </p>
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-xs text-teal-700 font-semibold underline"
                  >
                    Show all reviews
                  </button>
                </div>
              )}
            </div>

          </section>

        </div>

        {/* Right Col: Trust Details, Official Company Updates & Transparency */}
        <div className="space-y-6">
          
          {/* Trust Score Breakdown Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-navy-950">Trust Score Analysis</h3>
              <TrustBadge score={company.trustScore} ratingTier={company.trustScoreRating} size="sm" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              WinkBench computes this score through automated registry verification, customer reply velocity, domain reputation checks, and resolution ratios.
            </p>

            <div className="space-y-2.5 pt-2 text-xs border-t border-slate-100">
              <div className="flex justify-between items-center text-slate-600">
                <span>Corporate Registration Check</span>
                <span className="text-emerald-700 font-semibold">Passed (100%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Domain & SSL Integrity</span>
                <span className="text-emerald-700 font-semibold">Active & Valid</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Dispute Resolution Ratio</span>
                <span className="font-semibold text-navy-900">{company.responseRate || 95}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Review Authenticity Audit</span>
                <span className="text-emerald-700 font-semibold">High Confidence</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/trust-score-explained"
                className="text-xs text-teal-700 hover:underline font-semibold block text-center"
              >
                Read WinkBench Trust Score Methodology →
              </Link>
            </div>
          </div>

          {/* Official Company Updates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-navy-950">Official Company Updates</h3>
            </div>

            {companyUpdates.length > 0 ? (
              <div className="space-y-3">
                {companyUpdates.map((update) => (
                  <div key={update.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    {update.tag && (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                        {update.tag}
                      </span>
                    )}
                    <h4 className="font-bold text-xs text-navy-950">{update.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {update.content}
                    </p>
                    <time className="text-[10px] text-slate-400 block pt-1">
                      Published {new Date(update.publishedAt).toLocaleDateString()}
                    </time>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                {company.name} has not published company updates yet.
              </p>
            )}
          </div>

          {/* Claim Box if unclaimed */}
          {!company.isClaimed && (
            <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-white">Do you represent {company.name}?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Claim this profile to respond to customer reviews, update business hours, upload corporate credentials, and view customer sentiment analytics.
              </p>
              <Link
                href={`/for-businesses?claim=${company.slug}`}
                className="w-full bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center transition-colors shadow-sm"
              >
                Claim This Profile Today
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* Report Company Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-600" />
                Report Company Information
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If this business profile displays inaccurate contact information, fake corporate addresses, or has ceased trading, submit a report for our compliance team to investigate.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">Reason for Report</label>
              <select className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <option>Incorrect company details or website</option>
                <option>Company has ceased operations / closed down</option>
                <option>Fraudulent entity / Impersonation</option>
                <option>Duplicate listing</option>
                <option>Other issue</option>
              </select>

              <label className="text-xs font-semibold text-slate-700 block pt-2">Supporting Details</label>
              <textarea
                placeholder="Provide links, public registry evidence, or notes..."
                rows={3}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportedCompany(true);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {reportedCompany && (
        <div className="fixed bottom-4 right-4 z-50 bg-navy-900 text-white px-4 py-3 rounded-xl shadow-xl border border-navy-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Report submitted to the WinkBench Compliance Queue. Thank you!</span>
          <button onClick={() => setReportedCompany(false)} className="ml-2 text-slate-400 hover:text-white">✕</button>
        </div>
      )}

    </div>
  );
}

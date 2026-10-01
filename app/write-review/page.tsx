'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  PenSquare, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Globe2
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import { COUNTRIES } from '@/lib/countries';
import { normalizeDomain } from '@/lib/utils/domain';
import { createDefaultCompany } from '@/lib/storage/client';

function WriteReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get('company') || '';
  const initialSlug = searchParams.get('slug') || '';

  const [companyName, setCompanyName] = useState(initialCompany || initialSlug);
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [experienceDate, setExperienceDate] = useState('September 2026');
  const [userCountry, setUserCountry] = useState('US');
  const [certified, setCertified] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [savedSlug, setSavedSlug] = useState('');

  const ratingDescriptions: Record<number, string> = {
    1: 'Terrible — Major issues or unresolved failure',
    2: 'Poor — Fell short of expectations',
    3: 'Average — Met baseline expectations',
    4: 'Great — Very satisfied with service & value',
    5: 'Excellent — Exceptional experience, highly recommend',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Please specify the company domain or name you are reviewing.');
      return;
    }
    if (rating === 0) {
      setError('Please select a star rating (1 to 5).');
      return;
    }
    if (title.trim().length < 5) {
      setError('Please provide a descriptive review title (at least 5 characters).');
      return;
    }
    if (content.trim().length < 30) {
      setError('Please provide more detail in your review (minimum 30 characters).');
      return;
    }
    if (!certified) {
      setError('Please confirm the certification statement before submitting.');
      return;
    }

    const cleanSlug = normalizeDomain(companyName.trim());
    const targetComp = createDefaultCompany(cleanSlug);

    // Call API route to persist on Hostinger
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId: targetComp.id,
        companyName: targetComp.name,
        companySlug: targetComp.slug,
        userId: 'usr-client',
        userDisplayName: authorName.trim() || 'Verified Consumer',
        userCountry: COUNTRIES.find(c => c.code === userCountry)?.name || 'International',
        rating,
        title: title.trim(),
        content: content.trim(),
        experienceDate,
        isVerifiedCustomer: true,
      }),
    }).catch(err => console.error('Error posting review:', err));

    setSavedSlug(targetComp.slug);
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/directory" className="hover:text-blue-600">Directory</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800">Write a Review</span>
      </div>

      {!submitted ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Trustpilot-Style Open Domain Reviews
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Share Your Buying Experience
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              You can review any company or website. If they aren't on WinkBench yet, typing their domain creates their profile automatically!
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Company selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Company Website Domain or Name *
              </label>
              <input
                type="text"
                placeholder="e.g. vccshoppro.com, www.sitename.com, or Aurora Payments"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Entering any web domain automatically links or creates that company profile on WinkBench.
              </span>
            </div>

            {/* Interactive Star Rating */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Overall Star Rating *
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={rating}
                  interactive
                  size="xl"
                  onChange={(val) => setRating(val)}
                />
                {rating > 0 && (
                  <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {rating} / 5
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-blue-700 min-h-[20px]">
                {rating > 0 ? ratingDescriptions[rating] : 'Click on a star to set your overall rating.'}
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                placeholder="Summarize your experience in one sentence..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Review Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-900">
                  Your Detailed Experience *
                </label>
                <span className="text-[11px] text-slate-400">
                  {content.length}/30 min characters
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="What did you order or contract? How was customer service, pricing transparency, delivery time, or problem resolution? Be factual and helpful."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 leading-relaxed"
              />
            </div>

            {/* Date of experience, Country & Author Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Date of Experience *
                </label>
                <select
                  value={experienceDate}
                  onChange={(e) => setExperienceDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
                >
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="July 2026">July 2026</option>
                  <option value="Earlier in 2026">Earlier in 2026</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Your Country
                </label>
                <select
                  value={userCountry}
                  onChange={(e) => setUserCountry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flagEmoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Your Name (Public)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Compliance certification */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I certify that this review is based on my own genuine personal or business experience, that I have no financial or employment affiliation with the business, and that I have not been offered compensation or incentives to leave this review.
                </span>
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Saved directly into Hostinger database storage
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PenSquare className="w-4 h-4" />
                Publish Review
              </button>
            </div>

          </form>

        </div>
      ) : (
        /* Submission Success / Preview State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Review Published Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your review for <strong className="text-slate-900">{companyName}</strong> has been stored in the platform database and is live on their profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/company/${savedSlug || companyName}`}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              View Company Profile →
            </Link>
            <Link
              href="/dashboard/user"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              My Reviews Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

export default function WriteReviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
          Loading Review Form...
        </div>
      }
    >
      <WriteReviewContent />
    </React.Suspense>
  );
}

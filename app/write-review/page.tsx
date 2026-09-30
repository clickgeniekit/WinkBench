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
  Sparkles
} from 'lucide-react';
import { DEMO_COMPANIES } from '@/lib/demoData';
import StarRating from '@/components/StarRating';

function WriteReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get('company') || '';
  const initialSlug = searchParams.get('slug') || '';

  const [companyName, setCompanyName] = useState(initialCompany);
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [experienceDate, setExperienceDate] = useState('September 2026');
  const [certified, setCertified] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
      setError('Please specify the company you are reviewing.');
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

    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-teal-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/directory" className="hover:text-teal-700">Directory</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800">Write a Review</span>
      </div>

      {!submitted ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Community Quality Guidelines Apply
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Share Your Buying Experience
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your feedback helps millions of global consumers make smart decisions and gives honest businesses the recognition they deserve.
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
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Company Name or Website *
              </label>
              <input
                type="text"
                placeholder="e.g. Aurora Payments Global, or acme.example.com"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-500 font-medium"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Type the company name or select from our catalog.
              </span>
            </div>

            {/* Interactive Star Rating */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-navy-950">
                Overall Rating *
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={rating}
                  interactive
                  size="xl"
                  onChange={(val) => setRating(val)}
                />
                {rating > 0 && (
                  <span className="text-sm font-bold text-navy-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {rating} / 5
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-teal-800 min-h-[20px]">
                {rating > 0 ? ratingDescriptions[rating] : 'Click on a star to set your overall rating.'}
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                placeholder="Summarize your experience in one compelling sentence..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-500"
              />
            </div>

            {/* Review Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-navy-950">
                  Your Detailed Experience *
                </label>
                <span className="text-[11px] text-slate-400">
                  {content.length}/30 min characters
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="What did you purchase? How was the customer service, delivery time, product quality, or resolution of any problems? Be specific and factual."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-500 leading-relaxed"
              />
            </div>

            {/* Date of experience & Author Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Date of Experience *
                </label>
                <select
                  value={experienceDate}
                  onChange={(e) => setExperienceDate(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="July 2026">July 2026</option>
                  <option value="June 2026">June 2026</option>
                  <option value="Earlier in 2026">Earlier in 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Your Display Name (Public)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I certify that this review is based on my own genuine personal or business experience, that I have no financial or employment affiliation with the business, and that I have not been offered compensation or incentives to leave this review.
                </span>
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Protected by WinkBench Anti-Spam & Sentiment Verification
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PenSquare className="w-4 h-4" />
                Submit Review
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
            <h2 className="text-2xl font-extrabold text-navy-950">
              Review Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Thank you for contributing to the WinkBench community. Your review for <strong className="text-navy-950">{companyName}</strong> has been logged.
            </p>
          </div>

          {/* Formatted Preview */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left max-w-lg mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <StarRating rating={rating} size="sm" showNumber />
              <span className="text-slate-400">{experienceDate}</span>
            </div>
            <h4 className="font-bold text-sm text-navy-950">{title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{content}</p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400">
              Submitted by: {authorName || 'Anonymous Verified Reviewer'} · Status: Published (Phase 1 Local State)
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/directory"
              className="w-full sm:w-auto px-6 py-2.5 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
            >
              Browse More Companies
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setRating(0);
                setTitle('');
                setContent('');
                setCertified(false);
              }}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Write Another Review
            </button>
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


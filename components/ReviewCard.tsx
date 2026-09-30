'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import StarRating from './StarRating';
import { ThumbsUp, ShieldAlert, CheckCircle2, MessageCircle, Flag, Building } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleHelpfulClick = () => {
    if (!hasVoted) {
      setHelpfulCount(helpfulCount + 1);
      setHasVoted(true);
    } else {
      setHelpfulCount(helpfulCount - 1);
      setHasVoted(false);
    }
  };

  const handleReport = () => {
    setIsReported(true);
    setShowReportDialog(false);
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      {/* Top author row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-800 font-bold flex items-center justify-center text-sm border border-navy-200 shrink-0">
            {review.userDisplayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-navy-950">
                {review.userDisplayName}
              </span>
              {review.isVerifiedCustomer && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Buyer
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {review.userCountry && <span>{review.userCountry}</span>}
              <span>·</span>
              <time dateTime={review.createdAt}>
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Report review button */}
        <div className="relative">
          <button
            onClick={() => setShowReportDialog(!showReportDialog)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
            title="Report this review"
            aria-label="Report review"
          >
            <Flag className="w-4 h-4" />
          </button>

          {showReportDialog && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 shadow-xl rounded-lg p-3 z-20 text-xs">
              <p className="font-semibold text-slate-900 mb-1">Report Review</p>
              <p className="text-slate-500 mb-3">
                Flag this review for moderator review if it violates platform guidelines, contains harassment, or appears fraudulent.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  className="px-2.5 py-1 bg-rose-600 text-white font-medium rounded hover:bg-rose-700"
                >
                  Submit Flag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reported status indicator */}
      {isReported && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Report submitted to the WinkBench Trust & Safety moderation team for review.</span>
        </div>
      )}

      {/* Star Rating and Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <StarRating rating={review.rating} size="md" />
          {review.experienceDate && (
            <span className="text-xs text-slate-500 font-normal">
              · Date of experience: <strong className="text-slate-700 font-medium">{review.experienceDate}</strong>
            </span>
          )}
        </div>
        <h3 className="font-bold text-base text-navy-950 leading-snug">
          {review.title}
        </h3>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {review.content}
      </p>

      {/* Helpful button */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
        <button
          onClick={handleHelpfulClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            hasVoted
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-teal-700 text-teal-700' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>

        <span className="text-[11px] text-slate-400">
          WinkBench Verified Audit Trail
        </span>
      </div>

      {/* Distinct Business Reply */}
      {review.reply && (
        <div className="mt-4 bg-slate-50 rounded-xl p-4 border-l-4 border-l-teal-600 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-100 text-teal-800 font-bold">
                <Building className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-slate-900">
                Response from {review.companyName}
              </span>
              <span className="text-slate-500 font-normal">
                ({review.reply.responderName} — {review.reply.responderRole})
              </span>
            </div>
            <time className="text-slate-400 text-[11px]">
              {new Date(review.reply.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {review.reply.content}
          </p>
        </div>
      )}
    </article>
  );
}

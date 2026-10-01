'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  User, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ThumbsUp, 
  MessageSquare, 
  Building2, 
  ArrowLeft 
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import { DEMO_REVIEWS } from '@/lib/demoData';

export default function UserPublicProfilePage() {
  const params = useParams();
  const userId = params?.id as string;

  // Reviewer details
  const reviewerName = userId === 'alex-morgan' ? 'Alex Morgan' : 'Verified Consumer';
  const reviewerCountry = 'United States';
  const joinDate = 'January 2026';

  const userReviews = DEMO_REVIEWS.slice(0, 3);
  const totalHelpful = userReviews.reduce((sum, r) => sum + r.helpfulCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      {/* Reviewer Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center shrink-0 shadow-sm">
          {reviewerName.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900">{reviewerName}</h1>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Reviewer
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {reviewerCountry}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Member since {joinDate}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="pt-4 flex items-center justify-center sm:justify-start gap-6 border-t border-slate-100 text-xs">
            <div>
              <span className="font-bold text-slate-900 text-base">{userReviews.length}</span>
              <span className="text-slate-500 ml-1">Reviews Posted</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base">{totalHelpful}</span>
              <span className="text-slate-500 ml-1">Helpful Votes Received</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews by User */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Reviews by {reviewerName} ({userReviews.length})
        </h2>

        {userReviews.map((rev) => (
          <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/company/${rev.companySlug}`}
                  className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {rev.companyName}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={rev.rating} size="sm" showNumber />
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">Date of experience: {rev.experienceDate}</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-sm text-slate-900">{rev.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{rev.content}</p>

            {rev.reply && (
              <div className="bg-slate-50 border-l-4 border-l-blue-600 p-3 rounded-lg text-xs space-y-1">
                <span className="font-bold text-slate-800">Response from {rev.companyName}:</span>
                <p className="text-slate-600">{rev.reply.content}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                {rev.helpfulCount} helpful votes
              </span>
              <Link href={`/company/${rev.companySlug}`} className="text-blue-600 font-semibold hover:underline">
                View Company Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

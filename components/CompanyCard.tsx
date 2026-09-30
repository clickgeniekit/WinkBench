'use client';

import React from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import StarRating from './StarRating';
import TrustBadge from './TrustBadge';
import { Building2, MapPin, CheckCircle, ExternalLink, MessageSquare } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Header row: Logo placeholder, Name, Category */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-navy-800 font-bold text-lg shrink-0 overflow-hidden">
            {company.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link 
                href={`/company/${company.slug}`}
                className="font-bold text-base text-navy-950 hover:text-teal-700 transition-colors line-clamp-1 group-hover:text-teal-700"
              >
                {company.name}
              </Link>
              {company.isVerified && (
                <span className="inline-flex items-center text-teal-700 text-xs gap-0.5 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-medium">
                  <CheckCircle className="w-3 h-3 text-teal-600" />
                  Verified Profile
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {company.category}
              </span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {company.city}, {company.country}
              </span>
            </div>
          </div>
        </div>

        {/* Tagline / short description */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {company.tagline || company.description}
        </p>
      </div>

      {/* Ratings & Metrics Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <StarRating rating={company.customerRating} size="sm" showNumber />
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-slate-400" />
            {company.reviewCount.toLocaleString()} {company.reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <TrustBadge score={company.trustScore} ratingTier={company.trustScoreRating} size="sm" />
      </div>

      <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400">
          Response time: {company.responseTime || 'Under 24h'}
        </span>
        <Link
          href={`/company/${company.slug}`}
          className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
        >
          View Profile & Reviews →
        </Link>
      </div>
    </div>
  );
}

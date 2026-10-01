'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  RotateCcw,
  PlusCircle,
  Building2,
  Globe2,
  ArrowRight
} from 'lucide-react';
import { DEMO_COMPANIES } from '@/lib/demoData';
import { GLOBAL_CATEGORIES } from '@/lib/categories';
import { COUNTRIES } from '@/lib/countries';
import { Company } from '@/types';
import CompanyCard from '@/components/CompanyCard';
import { normalizeDomain, isDomainQuery } from '@/lib/utils/domain';
import { createDefaultCompany } from '@/lib/storage/client';

function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialCountry = searchParams.get('country') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'trust' | 'reviews' | 'newest'>('trust');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Check if search query is a domain directly
  const isDirectDomain = useMemo(() => {
    return isDomainQuery(searchQuery) || searchQuery.includes('http://') || searchQuery.includes('https://') || searchQuery.includes('www.');
  }, [searchQuery]);

  // Filter & Sort Logic
  const filteredCompanies = useMemo(() => {
    let result = [...DEMO_COMPANIES];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const normDomain = normalizeDomain(q);

      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(normDomain) ||
          (c.website && c.website.toLowerCase().includes(normDomain))
      );

      // If query is a domain and not in default results, ensure dynamic profile is visible!
      if (result.length === 0 && isDomainQuery(q)) {
        const dynamicComp = createDefaultCompany(q);
        result = [dynamicComp];
      }
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (c) => c.categorySlug === selectedCategory || c.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Country filter
    if (selectedCountry) {
      result = result.filter(
        (c) => c.countryCode.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      result = result.filter((c) => c.isVerified);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.customerRating - a.customerRating;
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedCountry, verifiedOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(start, start + itemsPerPage);
  }, [filteredCompanies, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCountry('');
    setVerifiedOnly(false);
    setSortBy('trust');
    setCurrentPage(1);
  };

  const handleDirectDomainNav = () => {
    if (searchQuery.trim()) {
      const clean = normalizeDomain(searchQuery.trim());
      router.push(`/company/${clean}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Directory Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Global Business Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Search any company by website domain, industry category, or worldwide country. Unlisted domains automatically receive a profile.
            </p>
          </div>

          <Link
            href="/for-businesses"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs shadow-xs hover:shadow transition-all self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            Claim / List a Business
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        
        {/* Top search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search domain (e.g. vccshoppro.com), company name, or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />

          {isDirectDomain && (
            <button
              onClick={handleDirectDomainNav}
              className="absolute right-2 top-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>Go to Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Industry Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="">All Categories</option>
              {GLOBAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Country (Worldwide)
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="">All Countries (Worldwide)</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="trust">Highest Trust Score</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="reviews">Most Reviews</option>
              <option value="newest">Newest Profiles</option>
            </select>
          </div>

          {/* Verified toggle & Reset */}
          <div className="flex items-end justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer py-2">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700">Verified Profiles Only</span>
            </label>

            {(searchQuery || selectedCategory || selectedCountry || verifiedOnly) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-rose-600 flex items-center gap-1 py-2 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <p>
          Showing <span className="font-bold text-slate-900">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'business' : 'businesses'}
          {selectedCategory && <span> in <strong className="text-slate-900">{selectedCategory}</strong></span>}
          {selectedCountry && <span> ({selectedCountry})</span>}
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Directory Company Grid or Empty State */}
      {paginatedCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No businesses found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn’t find any companies matching your active filters. If you are searching for a specific website domain, enter it directly into the search bar to automatically create a profile.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Clear All Filters
            </button>
            <Link
              href="/for-businesses"
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Suggest a Business
            </Link>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}

export default function DirectoryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
          Loading Directory...
        </div>
      }
    >
      <DirectoryContent />
    </React.Suspense>
  );
}

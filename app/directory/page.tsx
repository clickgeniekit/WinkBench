'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  ArrowUpDown, 
  Building2, 
  SlidersHorizontal,
  RotateCcw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { DEMO_COMPANIES, DEMO_CATEGORIES } from '@/lib/demoData';
import { Company } from '@/types';
import CompanyCard from '@/components/CompanyCard';

function DirectoryContent() {
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

  // Filter & Sort Logic
  const filteredCompanies = useMemo(() => {
    let result = [...DEMO_COMPANIES];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Directory Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Global Business Directory
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Search and filter thousands of companies across international markets. View unvarnished customer reviews and independent Trust Scores.
            </p>
          </div>

          <Link
            href="/for-businesses"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold px-4 py-2 rounded-lg text-xs shadow-sm hover:shadow transition-all self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            Claim / List a Business
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
        
        {/* Top search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company name, keywords, industry, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-navy-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="">All Categories</option>
              {DEMO_CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-brand-500"
            >
              <option value="">All Countries</option>
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="CA">Canada (CA)</option>
              <option value="AU">Australia (AU)</option>
              <option value="SE">Sweden (SE)</option>
              <option value="CH">Switzerland (CH)</option>
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
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-brand-500"
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
                className="rounded border-slate-300 text-teal-600 focus:ring-brand-500"
              />
              <span className="font-semibold text-slate-700">Verified Only</span>
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
          Showing <span className="font-bold text-navy-950">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'business' : 'businesses'}
          {selectedCategory && <span> in <strong className="text-navy-900">{selectedCategory}</strong></span>}
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
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-navy-950">No businesses found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn’t find any companies matching your active filters. Try broadening your keywords, resetting category choices, or adding a new company.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors"
            >
              Clear All Filters
            </button>
            <Link
              href="/for-businesses"
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
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
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === pageNum
                    ? 'bg-navy-900 text-white shadow-sm'
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
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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


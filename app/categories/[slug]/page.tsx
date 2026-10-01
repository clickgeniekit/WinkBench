import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  AUTHORITATIVE_CATEGORIES,
  getCategoryBySlug,
} from '@/lib/taxonomy/authoritativeTaxonomy';
import { getAllCompanies } from '@/lib/storage/db';
import CompanyCard from '@/components/CompanyCard';
import { ChevronRight, ArrowLeft, Building2, Layers, Search } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return AUTHORITATIVE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Category Not Found — WinkBench' };
  }
  return {
    title: `${category.name} Reviews & Verified Companies — WinkBench`,
    description: `Browse verified business reviews, customer ratings, and trusted companies in ${category.name} on WinkBench.`,
  };
}

export default function CategoryDetailPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const allCompanies = getAllCompanies();
  // Match companies by category name or categorySlug
  const matchingCompanies = allCompanies.filter(
    (c) =>
      c.categorySlug?.toLowerCase() === category.slug.toLowerCase() ||
      c.category?.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/categories" className="hover:text-blue-600 transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">{category.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Category #{category.sortOrder}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Best in {category.name}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Discover verified business reviews, ratings, and independent trust metrics for companies operating in{' '}
          <strong>{category.name}</strong>. Compare response times, customer satisfaction, and authentic buying experiences.
        </p>
      </div>

      {/* Subcategories Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-navy-950 flex items-center justify-between">
          <span>Subcategories ({category.subcategories.length})</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {category.subcategories.map((sub: { id: string; name: string }) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all text-xs font-medium text-slate-800 flex items-center justify-between"
            >
              <span>{sub.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-950">
            Classified Companies ({matchingCompanies.length})
          </h2>
          <Link
            href="/directory"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {matchingCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-bold text-base text-navy-950">No Classified Businesses Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Companies are classified strictly through verified business claims or moderator review. If you used a website or business in this industry, write the first review to index them.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/write-review"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                Write a Review
              </Link>
              <Link
                href="/for-businesses"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Claim a Business
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  CreditCard, 
  Cpu, 
  ShoppingBag, 
  Activity, 
  Plane, 
  Home, 
  Briefcase, 
  Car,
  ChevronRight,
  Building2,
  Scale,
  Zap,
  GraduationCap,
  Coffee,
  Dog,
  Utensils
} from 'lucide-react';
import { GLOBAL_CATEGORIES, CategoryDetail } from '@/lib/categories';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'Activity': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'Plane': return <Plane className="w-5 h-5 text-blue-600" />;
      case 'Home': return <Home className="w-5 h-5 text-blue-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Car': return <Car className="w-5 h-5 text-blue-600" />;
      case 'Scale': return <Scale className="w-5 h-5 text-blue-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-blue-600" />;
      case 'Dog': return <Dog className="w-5 h-5 text-blue-600" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-blue-600" />;
      default: return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredCategories = GLOBAL_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
          Global Directory Taxonomy
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Explore All Categories & Subcategories
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          WinkBench classifies millions of companies across 14 main industries and dozens of specialized subcategories, giving buyers granular trust insights.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Search categories (e.g. VCC, Banks, Hosting, Solar)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
        </div>
      </div>

      {/* Grid of Main Categories and Subcategories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{cat.name}</h2>
                  <span className="text-[11px] text-slate-400">{cat.companyCount.toLocaleString()} companies</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {cat.description}
              </p>

              {/* Subcategories list */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Popular Subcategories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, i) => (
                    <Link
                      key={i}
                      href={`/directory?category=${cat.slug}&q=${encodeURIComponent(sub)}`}
                      className="text-[11px] font-medium bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/directory?category=${cat.slug}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Browse All in {cat.name} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

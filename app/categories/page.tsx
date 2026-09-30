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
  Building2
} from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/demoData';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-teal-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-teal-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-teal-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-teal-600" />;
      case 'Plane': return <Plane className="w-6 h-6 text-teal-600" />;
      case 'Home': return <Home className="w-6 h-6 text-teal-600" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-teal-600" />;
      case 'Car': return <Car className="w-6 h-6 text-teal-600" />;
      default: return <Building2 className="w-6 h-6 text-teal-600" />;
    }
  };

  const filteredCategories = DEMO_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Explore Business Categories
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Find top-rated and verified companies organized by industry. Each category lists businesses with customer feedback and independent Trust Scores.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Filter categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl shadow-xs focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-teal-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                {getCategoryIcon(cat.iconName)}
              </div>

              <h2 className="text-lg font-bold text-navy-950 mb-2">
                {cat.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {cat.companyCount.toLocaleString()} businesses
              </span>
              <Link
                href={`/directory?category=${cat.slug}`}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                Browse Directory <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

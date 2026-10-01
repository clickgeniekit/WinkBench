import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';
import WinkBenchLogo from '@/components/WinkBenchLogo';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
      <div className="flex justify-center">
        <WinkBenchLogo size="lg" />
      </div>

      <div className="space-y-2">
        <span className="text-5xl font-black text-navy-950 block">404</span>
        <h1 className="text-xl font-bold text-slate-800">Page or Company Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          The requested page or company domain does not exist on this route, or has been moved to a new canonical address.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/directory"
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse Directory</span>
        </Link>
      </div>
    </div>
  );
}

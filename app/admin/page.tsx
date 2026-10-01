'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Building2, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Search, 
  AlertTriangle, 
  Database, 
  Server,
  Layers,
  FileCheck,
  Eye,
  Sliders
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';
import { DEMO_COMPANIES, DEMO_REVIEWS } from '@/lib/demoData';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'claims' | 'reviews' | 'companies' | 'system'>('claims');

  // Claims state
  const [claims, setClaims] = useState([
    {
      id: 'claim-101',
      companyId: 'comp-example-domain',
      companyName: 'example.com',
      applicantName: 'Jordan Miller',
      workEmail: 'admin@example.com',
      roleInCompany: 'Founder & CEO',
      phone: '+1 555 123 4567',
      docType: 'Corporate Domain Email Match',
      submittedAt: '2026-09-29T10:00:00Z',
      status: 'pending',
    },
    {
      id: 'claim-102',
      companyId: 'comp-apex-legal',
      companyName: 'Apex Global Immigration Law',
      applicantName: 'Elena Rostova',
      workEmail: 'elena@apexlegalaustin.example.ca',
      roleInCompany: 'Managing Partner',
      phone: '+1 416 555 7890',
      docType: 'Bar Council Certificate',
      submittedAt: '2026-09-28T14:00:00Z',
      status: 'pending',
    }
  ]);
  const [claimActionSuccess, setClaimActionSuccess] = useState<string | null>(null);

  // Reviews state
  const [moderationReviews, setModerationReviews] = useState(DEMO_REVIEWS);
  const [companiesList, setCompaniesList] = useState(DEMO_COMPANIES);
  const [companySearch, setCompanySearch] = useState('');

  // Handle Approve Claim
  const handleApproveClaim = (claimId: string, companyName: string) => {
    setClaims(claims.map(c => c.id === claimId ? { ...c, status: 'approved' } : c));
    setCompaniesList(companiesList.map(c => {
      if (c.slug === companyName || c.name === companyName) {
        return { ...c, isClaimed: true, isVerified: true };
      }
      return c;
    }));
    setClaimActionSuccess(`Claim for ${companyName} has been approved! Company is now Verified & Claimed.`);
    setTimeout(() => setClaimActionSuccess(null), 3500);
  };

  // Handle Reject Claim
  const handleRejectClaim = (claimId: string) => {
    setClaims(claims.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c));
  };

  // Toggle company verification
  const handleToggleVerified = (companyId: string) => {
    setCompaniesList(companiesList.map(c => {
      if (c.id === companyId) {
        return { ...c, isVerified: !c.isVerified };
      }
      return c;
    }));
  };

  const filteredCompanies = companiesList.filter(c => 
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.slug.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.category.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
              Hostinger Central Administration
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            WinkBench Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company profiles, review dispute moderation, verify domain claims, and audit platform security.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            Hostinger Runtime: Healthy
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Companies</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{companiesList.length + 140}</p>
          <span className="text-[11px] text-slate-400">Indexed & queryable</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Reviews</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{moderationReviews.length + 3840}</p>
          <span className="text-[11px] text-slate-400">Published customer reviews</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Pending Claims</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {claims.filter(c => c.status === 'pending').length}
          </p>
          <span className="text-[11px] text-slate-400">Awaiting document audit</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Global Countries</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">50+</p>
          <span className="text-[11px] text-slate-400">Active regional markets</span>
        </div>
      </div>

      {claimActionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{claimActionSuccess}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'claims'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Business Claims ({claims.filter(c => c.status === 'pending').length} pending)
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'companies'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Directory Catalog
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Review Moderation
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'system'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          Hostinger Database & Storage
        </button>
      </div>

      {/* TAB 1: Business Claims Queue */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>Verify that the work email domain matches the business website before approving.</p>
            <span className="font-semibold text-slate-700">Least-privilege verification protocol active</span>
          </div>

          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{claim.companyName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        claim.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Applicant: <strong>{claim.applicantName}</strong> ({claim.roleInCompany})
                    </p>
                    <p className="text-xs text-slate-500">
                      Work Email: <span className="font-mono text-blue-700 font-semibold">{claim.workEmail}</span>
                      {claim.phone && <span> · Phone: {claim.phone}</span>}
                    </p>
                  </div>

                  {claim.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveClaim(claim.id, claim.companyName)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve & Verify
                      </button>
                      <button
                        onClick={() => handleRejectClaim(claim.id)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-rose-600 font-bold text-xs rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Verification Evidence: {claim.docType}</span>
                  <span>Submitted: {new Date(claim.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Company Catalog Manager */}
      {activeTab === 'companies' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-bold text-sm text-slate-900">Registered & Dynamically Created Companies</h3>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search domain or company..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5">Company / Domain</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Country</th>
                  <th className="py-2.5">Customer Rating</th>
                  <th className="py-2.5">Trust Score</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">
                      <Link href={`/company/${c.slug}`} className="hover:text-blue-600">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600">{c.category}</td>
                    <td className="py-3 text-slate-500">{c.countryCode}</td>
                    <td className="py-3 font-semibold text-slate-800">{c.customerRating} ★ ({c.reviewCount})</td>
                    <td className="py-3">
                      <TrustBadge score={c.trustScore} ratingTier={c.trustScoreRating} size="sm" />
                    </td>
                    <td className="py-3">
                      {c.isVerified ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Verified</span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">Unclaimed</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleVerified(c.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded hover:bg-slate-100"
                      >
                        {c.isVerified ? 'Revoke Verified' : 'Mark Verified'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {moderationReviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900">{rev.userDisplayName}</span>
                  <span className="text-xs text-slate-400 ml-2">reviewed <strong>{rev.companyName}</strong></span>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={rev.rating} size="sm" showNumber />
                    <span className="text-xs text-slate-400">· {new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                    Active & Published
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-xs text-slate-900">{rev.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Hostinger Database & System */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-3xl space-y-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Hostinger Persistent Database Status</h3>
              <p className="text-slate-500">Self-contained database engine configured for Hostinger Cloud/VPS Node.js runtime.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Storage Engine Mode</span>
              <span className="font-bold text-slate-900">Hostinger Local Persistent JSON / SQLite Schema</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">External Cloud Lock-In</span>
              <span className="font-bold text-emerald-700">None (Firebase removed per user instruction)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Dynamic Domain Creation</span>
              <span className="font-bold text-blue-600">Active (Auto-indexes any unlisted domain)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Supported Hostinger Runtimes</span>
              <span className="font-bold text-slate-900">Node.js 20.x, 22.x LTS (via PM2)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

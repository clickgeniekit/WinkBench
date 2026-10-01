'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Layers,
  FileCheck,
  Trash2,
  Lock,
  RefreshCw,
  LogOut,
  UserCheck,
  UserX,
  History,
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';
import { AUTHORITATIVE_CATEGORIES } from '@/lib/taxonomy/authoritativeTaxonomy';
import { Company, Review, ClaimRequest, ReviewReport, AuditLogEntry, UserAccount } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'claims' | 'reviews' | 'companies' | 'users' | 'audit' | 'system'>('claims');

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  // Data states
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const [usersList, setUsersList] = useState<Array<Partial<UserAccount>>>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Search & feedback state
  const [companySearch, setCompanySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Check admin authorization on mount
  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (!data.authenticated || !data.user || data.user.role !== 'admin') {
          setUnauthorized(true);
        } else {
          setCurrentUser(data.user);
          loadAdminData();
        }
      } catch (err) {
        console.error('Failed to verify admin status:', err);
        setUnauthorized(true);
      } finally {
        setAuthChecked(true);
      }
    }

    checkAdminAuth();
  }, []);

  async function loadAdminData() {
    try {
      const [claimsRes, reviewsRes, compRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/admin/claims'),
        fetch('/api/admin/reviews'),
        fetch('/api/admin/companies'),
        fetch('/api/admin/users'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (claimsRes.ok) {
        const d = await claimsRes.json();
        setClaims(d.claims || []);
      }
      if (reviewsRes.ok) {
        const d = await reviewsRes.json();
        setReviews(d.reviews || []);
        setReports(d.reports || []);
      }
      if (compRes.ok) {
        const d = await compRes.json();
        setCompaniesList(d.companies || []);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsersList(d.users || []);
      }
      if (logsRes.ok) {
        const d = await logsRes.json();
        setAuditLogs(d.logs || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  }

  // Claim actions
  const handleClaimStatus = async (claimId: string, status: 'approved' | 'rejected') => {
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await fetch('/api/admin/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.error || 'Failed to update claim.');
      } else {
        setActionSuccess(`Claim ${status} successfully.`);
        loadAdminData();
      }
    } catch {
      setActionError('Network error while processing claim.');
    }
  };

  // Review actions
  const handleReviewAction = async (reviewId: string, action: 'published' | 'removed') => {
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_review_status', reviewId, status: action }),
      });
      if (res.ok) {
        setActionSuccess(`Review marked as ${action}.`);
        loadAdminData();
      }
    } catch {
      setActionError('Failed to update review status.');
    }
  };

  // User actions
  const handleUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.error || 'Failed to update user status.');
      } else {
        setActionSuccess(`User status updated to ${status}.`);
        loadAdminData();
      }
    } catch {
      setActionError('Failed to update user status.');
    }
  };

  // Company classification
  const handleClassifyCompany = async (companySlug: string, category: string, categorySlug: string) => {
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'classify', companySlug, category, categorySlug }),
      });
      if (res.ok) {
        setActionSuccess(`Company reclassified to ${category}.`);
        loadAdminData();
      }
    } catch {
      setActionError('Failed to classify company.');
    }
  };

  if (!authChecked) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Authenticating administrative security context...
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
          <Lock className="w-12 h-12 text-rose-600 mx-auto" />
          <h1 className="text-xl font-extrabold text-navy-950">Administrative Access Denied</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            This management console requires verified administrator privileges. If you are a platform administrator, please log in with your administrative credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 bg-navy-900 text-white font-bold text-xs rounded-xl hover:bg-navy-800"
            >
              Log In as Administrator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredCompanies = companiesList.filter(
    (c) =>
      c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredUsers = usersList.filter(
    (u) =>
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
              Admin Console · Hostinger Runtime Engine
            </span>
          </div>
          <h1 className="text-2xl font-black">Platform Administration & Compliance</h1>
          <p className="text-xs text-slate-400">
            Authenticated as <strong>{currentUser?.displayName}</strong> ({currentUser?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAdminData()}
            className="px-3.5 py-2 bg-navy-900 hover:bg-navy-800 border border-navy-800 text-xs font-semibold rounded-xl text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/login');
            }}
            className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Global alert feedback */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-600 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'claims' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Claims & Ownership ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'reviews' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Review Moderation ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'companies' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Companies & Taxonomy ({companiesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Access ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'system' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Hostinger Database Status</span>
        </button>
      </div>

      {/* TAB 1: Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-navy-950 mb-1">Company Ownership Claims</h2>
            <p className="text-xs text-slate-500 mb-6">
              Review corporate domain email matches, business registration filings, and legal claims.
            </p>

            {claims.length > 0 ? (
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-5 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="font-extrabold text-sm text-navy-950">{claim.companyName}</span>
                        <span className="text-[11px] text-slate-400 block">
                          Submitted {new Date(claim.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                        claim.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : claim.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {claim.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Applicant:</span>
                        <span className="font-semibold text-slate-800">{claim.applicantName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Work Email:</span>
                        <span className="font-mono text-slate-800">{claim.workEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Role / Title:</span>
                        <span className="font-semibold text-slate-800">{claim.roleInCompany}</span>
                      </div>
                    </div>

                    {claim.status === 'pending_review' && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleClaimStatus(claim.id, 'approved')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Verify Ownership</span>
                        </button>
                        <button
                          onClick={() => handleClaimStatus(claim.id, 'rejected')}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Claim</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No ownership claims pending.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-navy-950">Review Moderation Queue</h2>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-bold text-sm text-navy-950">{rev.companyName}</span>
                      <span className="text-[11px] text-slate-400 block">
                        By {rev.userDisplayName} · {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating rating={rev.rating} size="sm" />
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800'
                          : rev.status === 'removed'
                          ? 'bg-rose-50 text-rose-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-xs text-slate-900">{rev.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {rev.status !== 'published' && (
                      <button
                        onClick={() => handleReviewAction(rev.id, 'published')}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        Approve / Publish
                      </button>
                    )}
                    {rev.status !== 'removed' && (
                      <button
                        onClick={() => handleReviewAction(rev.id, 'removed')}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors"
                      >
                        Remove Violating Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Companies & Taxonomy */}
      {activeTab === 'companies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">Company Directory & Taxonomy Assignment</h2>
              <p className="text-xs text-slate-500">
                Classify companies into the approved 22 authoritative categories and toggle verified badges.
              </p>
            </div>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search company or domain..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Company / Domain</th>
                  <th className="p-3">Current Category</th>
                  <th className="p-3">Assign Authoritative Category</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Verified Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">
                      <Link href={`/company/${c.slug}`} className="hover:text-blue-600 underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={c.categorySlug || ''}
                        onChange={(e) => {
                          const cat = AUTHORITATIVE_CATEGORIES.find((cat) => cat.slug === e.target.value);
                          if (cat) {
                            handleClassifyCompany(c.slug, cat.name, cat.slug);
                          }
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="">-- Choose Category --</option>
                        {AUTHORITATIVE_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 font-semibold">
                      {c.customerRating} ★ ({c.reviewCount})
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.isVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {c.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">User Account Management</h2>
              <p className="text-xs text-slate-500">View registered accounts, verify credentials, and manage suspensions.</p>
            </div>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search email or name..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">{u.displayName}</td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.id !== currentUser?.id && (
                        <div className="flex items-center gap-2">
                          {u.status === 'active' ? (
                            <button
                              onClick={() => handleUserStatus(u.id!, 'suspended')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserStatus(u.id!, 'active')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-navy-950">Security Audit Logs</h2>
          <p className="text-xs text-slate-500">
            Immutable tracking records for administrative and privileged user actions.
          </p>

          <div className="space-y-2">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy-950 uppercase text-[10px] mr-2 px-2 py-0.5 bg-white border border-slate-200 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-600">
                      Target: <strong>{log.targetType}:{log.targetId}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">No audit logs recorded yet.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: System */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Hostinger Database & Storage Engine</h3>
              <p className="text-xs text-slate-500">Configured for Hostinger MySQL and local persistent storage fallback.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Relational Database Engine</span>
              <span className="font-bold text-slate-900">Hostinger MySQL with Drizzle ORM (schema ready)</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Authoritative Categories Count</span>
              <span className="font-bold text-emerald-700">22 Categories · 189 Subcategories</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Dynamic Domain Auto-Indexing</span>
              <span className="font-bold text-blue-600">Active (Auto-creates unclassified profiles for any domain)</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">External Cloud Lock-In</span>
              <span className="font-bold text-emerald-700">0% (Zero Firebase/Firestore dependency)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

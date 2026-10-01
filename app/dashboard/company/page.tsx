'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Star, 
  MessageSquare, 
  Bell, 
  FileText, 
  Settings, 
  CheckCircle2, 
  PlusCircle, 
  Send, 
  ShieldCheck, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import TrustBadge from '@/components/TrustBadge';
import { DEMO_COMPANIES, DEMO_REVIEWS } from '@/lib/demoData';

export default function CompanyDashboardPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'announcements' | 'blog' | 'details'>('reviews');
  
  // Selected company (defaults to claimed company)
  const [currentCompany, setCurrentCompany] = useState(DEMO_COMPANIES[0]); // Aurora Payments Global
  
  // Review replies state
  const [reviews, setReviews] = useState(DEMO_REVIEWS.filter(r => r.companySlug === currentCompany.slug));
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  // Announcements state
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'EUR and CAD local domestic clearing rails activated',
      content: 'We are pleased to announce direct domestic bank clearing for all merchant accounts operating across the UK, Canada, and European Union.',
      publishedAt: '2026-09-20T10:00:00Z',
      priority: 'important'
    },
    {
      id: 'ann-2',
      title: 'Scheduled maintenance for batch settlements',
      content: 'Batch settlement reporting will undergo scheduled database maintenance this Sunday from 02:00 to 04:00 UTC.',
      publishedAt: '2026-09-12T08:00:00Z',
      priority: 'normal'
    }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'important'>('normal');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Blog / Articles state
  const [articles, setArticles] = useState([
    {
      id: 'art-1',
      title: 'How Mid-Market Retailers Can Reduce Friendly Fraud and Chargebacks in 2026',
      summary: 'An operational blueprint for multi-currency fraud defense and 3D-Secure 2.2 optimization.',
      category: 'Fintech & Risk Management',
      publishedAt: '2026-09-10T12:00:00Z',
    }
  ]);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtSummary, setNewArtSummary] = useState('');
  const [newArtContent, setNewArtContent] = useState('');
  const [newArtCategory, setNewArtCategory] = useState('Fintech & Merchant Insights');
  const [artSuccess, setArtSuccess] = useState(false);

  // Company Details Form state
  const [companyDetails, setCompanyDetails] = useState({
    name: currentCompany.name,
    website: currentCompany.website,
    phone: currentCompany.phone || '+44 20 7946 0912',
    email: currentCompany.email || 'support@aurorapay.example.com',
    address: currentCompany.address || '45 Finsbury Square, London EC2A 1PX',
    description: currentCompany.description,
  });
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  // Handle business reply
  const handleSendReply = async (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          reviewId,
          responderName: companyDetails.name || 'Verified Representative',
          responderRole: 'Merchant Operations',
          content: text.trim(),
        }),
      });

      if (res.ok) {
        setReviews(reviews.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              reply: {
                id: `rep-${Date.now()}`,
                reviewId,
                companyId: currentCompany.id,
                responderName: companyDetails.name || 'Verified Representative',
                responderRole: 'Merchant Operations',
                content: text.trim(),
                createdAt: new Date().toISOString(),
              }
            };
          }
          return r;
        }));

        setReplyInputs({ ...replyInputs, [reviewId]: '' });
        setReplySuccess(reviewId);
        setTimeout(() => setReplySuccess(null), 3000);
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  // Handle publish announcement
  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companySlug: currentCompany.slug,
          title: newAnnTitle.trim(),
          content: newAnnContent.trim(),
          authorName: companyDetails.name || 'Management',
          priority: newAnnPriority,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setAnnouncements([created, ...announcements]);
        setNewAnnTitle('');
        setNewAnnContent('');
        setAnnSuccess(true);
        setTimeout(() => setAnnSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to create announcement:', err);
    }
  };

  // Handle publish article
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) return;

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companySlug: currentCompany.slug,
          title: newArtTitle.trim(),
          summary: newArtSummary || newArtTitle,
          content: newArtContent.trim(),
          authorName: companyDetails.name || 'Editorial Staff',
          category: newArtCategory || 'Updates',
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setArticles([created, ...articles]);
        setNewArtTitle('');
        setNewArtSummary('');
        setNewArtContent('');
        setArtSuccess(true);
        setTimeout(() => setArtSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to publish article:', err);
    }
  };

  // Handle update details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/companies/${currentCompany.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyDetails),
      });

      if (res.ok) {
        setDetailsSuccess(true);
        setTimeout(() => setDetailsSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save company details:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-sm">
            {currentCompany.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900">{currentCompany.name}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Claimed Business Profile
              </span>
            </div>
            <p className="text-xs text-slate-500">Official Merchant Management Portal · Hostinger Persistence Engine</p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-600">
              <a href={currentCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {currentCompany.website}
              </a>
              <span>·</span>
              <span>{currentCompany.category}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/company/${currentCompany.slug}`}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Public Profile
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Customer Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={currentCompany.customerRating} size="sm" showNumber />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">From {currentCompany.reviewCount} customer reviews</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">WinkBench Trust Score</span>
          <div className="mt-1">
            <TrustBadge score={currentCompany.trustScore} ratingTier={currentCompany.trustScoreRating} size="sm" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Independent platform standing</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Customer Response Rate</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">98%</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Avg reply time: &lt; 4 hours</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Published Updates</span>
          <p className="text-xl font-extrabold text-blue-600 mt-0.5">{announcements.length + articles.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Announcements & articles live</span>
        </div>
      </div>

      {/* Four Required Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          1. Reviews & Customer Replies ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          2. Company Announcements ({announcements.length})
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'blog'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          3. Company Blog & Articles ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-4 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'details'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          4. Company Details
        </button>
      </div>

      {/* TAB 1: Reviews & Replies */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>Engage transparently with your customers. Public replies demonstrate accountability.</p>
            <span className="font-semibold text-emerald-700">✓ Fast reply badge active</span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{rev.userDisplayName}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={rev.rating} size="sm" showNumber />
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-slate-400 text-xs">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{rev.content}</p>

                {/* Existing Reply */}
                {rev.reply ? (
                  <div className="bg-blue-50/60 border-l-4 border-l-blue-600 p-4 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-blue-950">
                      <span>Official Response from {currentCompany.name}:</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(rev.reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700">{rev.reply.content}</p>
                  </div>
                ) : (
                  /* Reply Input Box */
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                    <label className="font-bold text-slate-800 block">
                      Write an Official Business Reply
                    </label>
                    <textarea
                      rows={2}
                      placeholder={`Reply publicly to ${rev.userDisplayName}...`}
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post Public Reply
                      </button>
                    </div>
                  </div>
                )}

                {replySuccess === rev.id && (
                  <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reply published to profile and synced with Hostinger storage!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Company Announcement */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs h-fit">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Publish New Announcement
            </h3>
            <p className="text-slate-500">
              Announcements appear prominently on your company public profile to notify customers of new features, policy changes, or holiday hours.
            </p>

            {annSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Announcement published live!</span>
              </div>
            )}

            <form onSubmit={handlePublishAnnouncement} className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. New direct settlement rails launched"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Priority Tag</label>
                <select
                  value={newAnnPriority}
                  onChange={(e) => setNewAnnPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="normal">Normal Announcement</option>
                  <option value="important">Important / Critical Update</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  placeholder="Detail the operational update or announcement..."
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Publish to Profile
              </button>
            </form>
          </div>

          {/* List of active announcements */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Active Company Announcements ({announcements.length})</h3>

            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ann.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ann.priority === 'important' ? 'Important Update' : 'Standard Announcement'}
                  </span>
                  <span className="text-slate-400">{new Date(ann.publishedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Company Blog / Articles */}
      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Article Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs h-fit">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Write Company Article
            </h3>
            <p className="text-slate-500">
              Publish educational articles, case studies, and insights to build authority and trust with buyers.
            </p>

            {artSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Article published to company blog tab!</span>
              </div>
            )}

            <form onSubmit={handlePublishArticle} className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Article Title</label>
                <input
                  type="text"
                  placeholder="e.g. Best Practices for International Payouts"
                  value={newArtTitle}
                  onChange={(e) => setNewArtTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Category / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Fintech & Merchant Insights"
                  value={newArtCategory}
                  onChange={(e) => setNewArtCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Summary (1-2 sentences)</label>
                <textarea
                  rows={2}
                  placeholder="Short excerpt for search results and previews..."
                  value={newArtSummary}
                  onChange={(e) => setNewArtSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Full Content</label>
                <textarea
                  rows={6}
                  placeholder="Write the full article body..."
                  value={newArtContent}
                  onChange={(e) => setNewArtContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Publish Article
              </button>
            </form>
          </div>

          {/* List of published articles */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Published Blog Articles ({articles.length})</h3>

            {articles.map((art) => (
              <div key={art.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {art.category}
                  </span>
                  <span className="text-slate-400">{new Date(art.publishedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{art.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{art.summary}</p>
                <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                  <span>Author: Marcus Vance, Head of Risk</span>
                  <span className="text-blue-600 font-semibold cursor-pointer">Preview in Profile →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Company Details & Verification */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900">Company Information & Public Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update contact info, customer service phone, and official company address.
            </p>
          </div>

          {detailsSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Company profile details updated in Hostinger database!</span>
            </div>
          )}

          <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Company Legal / Trading Name</label>
              <input
                type="text"
                value={companyDetails.name}
                onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Website URL</label>
                <input
                  type="url"
                  value={companyDetails.website}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Customer Support Phone</label>
                <input
                  type="text"
                  value={companyDetails.phone}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Customer Inquiries Email</label>
                <input
                  type="email"
                  value={companyDetails.email}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Registered Address</label>
                <input
                  type="text"
                  value={companyDetails.address}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">About Company Description</label>
              <textarea
                rows={4}
                value={companyDetails.description}
                onChange={(e) => setCompanyDetails({ ...companyDetails, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

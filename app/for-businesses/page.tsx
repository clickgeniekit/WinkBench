'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  MessageSquare, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  FileText,
  HelpCircle
} from 'lucide-react';
import { DEMO_COMPANIES } from '@/lib/demoData';

function ForBusinessesContent() {
  const searchParams = useSearchParams();
  const claimSlug = searchParams.get('claim') || '';
  const matchingCompany = DEMO_COMPANIES.find((c) => c.slug === claimSlug);

  const [companyName, setCompanyName] = useState(matchingCompany ? matchingCompany.name : '');
  const [website, setWebsite] = useState(matchingCompany ? matchingCompany.website : '');
  const [applicantName, setApplicantName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [role, setRole] = useState('Founder / Executive');
  const [docType, setDocType] = useState('Corporate Domain Email Match');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Please provide the company name.');
      return;
    }
    if (!workEmail.includes('@') || workEmail.endsWith('@gmail.com') || workEmail.endsWith('@yahoo.com')) {
      setError('Please provide a corporate work email address matching the company domain.');
      return;
    }
    if (!applicantName.trim()) {
      setError('Please state your full legal name.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-navy-950 to-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-950/80 border border-teal-600/40 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            Official Business Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Build Authentic Credibility on WinkBench
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Claim your profile, engage transparently with verified buyers, publish official company updates, and inspect genuine sentiment metrics.
          </p>
        </div>
      </section>

      {/* Rules of Engagement Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>The WinkBench Integrity Charter for Businesses</span>
          </div>
          <p className="leading-relaxed text-amber-800">
            WinkBench operates strictly on least-privilege, unbiased trust. Claiming a profile allows you to <strong>respond publicly</strong> to reviews, showcase company disclosures, and submit dispute reviews with factual evidence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] font-medium text-amber-900 border-t border-amber-200/80">
            <div>✓ Allowed: Public replies, updates, dispute submissions</div>
            <div>✗ Prohibited: Deleting reviews, paying to boost Trust Scores</div>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-950">Public Review Responses</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Show prospective buyers that your customer service is responsive by addressing inquiries and solving issues transparently.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-950">Official Company Updates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Broadcast compliance recertifications, product releases, seasonal harvests, or branch expansions directly on your profile.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-950">Verified Business Badge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrate verified legal entity status, verified domain authority, and active response commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Claim Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {!submitted ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-950">
                Submit a Profile Claim Application
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                All claims are manually audited by our compliance administrators before access is granted. No automatic self-verification is permitted.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-navy-950 mb-1">Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Global Immigration Law"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">Official Website *</label>
                  <input
                    type="url"
                    placeholder="https://company.example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-navy-950 mb-1">Your Legal Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">Corporate Work Email *</label>
                  <input
                    type="email"
                    placeholder="name@companydomain.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Must match the company website domain.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-navy-950 mb-1">Your Role in Organization *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option>Founder / Executive Officer</option>
                    <option>Director of Customer Operations</option>
                    <option>Legal Counsel / Compliance Manager</option>
                    <option>Marketing / Communications Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">Verification Method *</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option>Corporate Domain Email Match</option>
                    <option>Certificate of Incorporation / Registry Filing</option>
                    <option>DNS TXT Record Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy-950 mb-1">Additional Verification Details</label>
                <textarea
                  rows={3}
                  placeholder="Provide registration number, headquarters phone number, or notes to help administrators verify your credentials swiftly..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Reviewed by WinkBench Compliance within 1–2 business days.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Submit Claim for Review
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-navy-950">Claim Application Queued</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your claim for <strong>{companyName}</strong> by <strong>{applicantName}</strong> ({workEmail}) has been logged in the moderation queue. Our compliance administrators verify DNS records and company registrations prior to approving owner portal privileges.
            </p>
            <div className="pt-2">
              <Link
                href="/directory"
                className="inline-block px-5 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800"
              >
                Back to Directory
              </Link>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

export default function ForBusinessesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
          Loading Business Portal...
        </div>
      }
    >
      <ForBusinessesContent />
    </React.Suspense>
  );
}


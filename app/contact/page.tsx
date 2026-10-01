'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import WinkBenchLogo from '@/components/WinkBenchLogo';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to deliver message.');
      } else {
        setSuccessMsg(data.message);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Trust & Safety Help Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
          Contact WinkBench Support
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Have an inquiry regarding a company listing, review dispute, business claim, or technical support? Our compliance team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
            <span className="font-bold text-xs text-navy-950 uppercase tracking-wider block">Trust & Moderation</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              For review disputes, verification audits, or legal inquiries:
            </p>
            <p className="text-xs font-semibold text-blue-600">compliance@winkbench.com</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
            <span className="font-bold text-xs text-navy-950 uppercase tracking-wider block">Business Claims</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Need assistance claiming your official company profile?
            </p>
            <Link href="/for-businesses" className="text-xs font-semibold text-blue-600 hover:underline">
              Business Claim Portal →
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
            <span className="font-bold text-xs text-navy-950 uppercase tracking-wider block">Review Guidelines</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Read our transparent criteria for verified customer reviews:
            </p>
            <Link href="/review-guidelines" className="text-xs font-semibold text-blue-600 hover:underline">
              Review Guidelines →
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-navy-950">Send a Secure Inquiry</h2>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-navy-950 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-navy-950 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy-950 mb-1">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Review Dispute Inquiry, Domain Claim Question"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-navy-950 mb-1">Message *</label>
              <textarea
                rows={5}
                placeholder="Describe your inquiry or question with relevant details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 resize-y"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{loading ? 'Submitting...' : 'Send Inquiry'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

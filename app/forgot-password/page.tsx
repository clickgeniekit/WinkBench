'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import WinkBenchLogo from '@/components/WinkBenchLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setDevToken(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to process password reset.');
      } else {
        setMessage(data.message);
        if (data.developmentToken) {
          setDevToken(data.developmentToken);
        }
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <WinkBenchLogo size="md" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950">Reset Password</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter the email address associated with your WinkBench account to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Instructions Dispatched</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-700">{message}</p>
            {devToken && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-300 text-[11px] space-y-1">
                <span className="font-bold text-slate-800 block">Development Environment Link:</span>
                <Link
                  href={`/reset-password?token=${devToken}`}
                  className="text-blue-600 font-mono underline break-all block"
                >
                  Click here to set new password (Token: {devToken.substring(0, 10)}...)
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-navy-950 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>{loading ? 'Sending Request...' : 'Send Reset Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && agree) {
      setRegistered(true);
      setTimeout(() => {
        router.push('/directory');
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xl mx-auto">
            <span className="text-teal-400">W</span>B
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950">
            Create Free Account
          </h1>
          <p className="text-xs text-slate-500">
            Join the independent platform for honest consumer reviews
          </p>
        </div>

        {registered && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Registration preview successful. Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-navy-950 mb-1">Your Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Jordan Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-navy-950 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-navy-950 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-brand-500"
                required
              />
              <span className="text-[11px] text-slate-600 leading-tight">
                I agree to the WinkBench <Link href="/terms-of-service" className="text-teal-700 underline">Terms of Service</Link>, <Link href="/privacy-policy" className="text-teal-700 underline">Privacy Policy</Link>, and <Link href="/review-guidelines" className="text-teal-700 underline">Review Guidelines</Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-700 font-bold hover:underline">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}

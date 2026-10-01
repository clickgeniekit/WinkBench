import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — WinkBench',
  description: 'Learn how WinkBench protects user privacy, authenticates reviews, and manages data securely.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Privacy Policy</span>
      </nav>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Effective: October 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
          WinkBench Privacy Policy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          At WinkBench, we believe transparency and consumer trust require absolute integrity in how personal information is handled.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">1. Information We Collect</h2>
          <p>
            When you register an account, publish a review, or claim a company profile on WinkBench, we collect information necessary to ensure platform integrity:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Account Details:</strong> Email address, display name, country of residence, and optional avatar image.</li>
            <li><strong>Review Submissions:</strong> Star ratings, review titles, descriptions, transaction dates, and customer proofs provided during verification.</li>
            <li><strong>Business Verification Records:</strong> Corporate email addresses, business registration numbers, and official documentation submitted for profile claims.</li>
            <li><strong>Technical Telemetry:</strong> Anonymized browser identifiers, IP address records for security audit logs, and session authentication tokens stored in secure HTTP-only cookies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">2. How We Use Your Information</h2>
          <p>We process your data strictly to operate an authentic, uncompromised review platform:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Displaying public consumer reviews associated with your chosen public display name.</li>
            <li>Preventing review manipulation, spam rings, bot submissions, and fraudulent business claims.</li>
            <li>Enabling businesses to publicly respond to customer feedback.</li>
            <li>Delivering important platform alerts, notification updates, and security notices.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">3. Public vs. Private Information</h2>
          <p>
            Your email address, session tokens, and identity verification documents are <strong>strictly private</strong> and are never published publicly, sold, or shared with third-party advertisers. Only your public display name, avatar, country code, and review content are visible to visitors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">4. Cookies and Session Storage</h2>
          <p>
            WinkBench uses essential, secure, HTTP-only session cookies (<code>wb_session</code>) to keep you logged in safely across requests. We do not use third-party advertising tracking cookies or invasive cross-site trackers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">5. Data Retention & Account Deletion</h2>
          <p>
            You retain full ownership of your personal reviews and account information. You may edit or remove your published reviews or update your profile at any time through your User Dashboard. To request full erasure of your account, you can submit a request through our <Link href="/contact" className="text-blue-600 underline font-semibold">Contact Help Desk</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">6. Contact Compliance</h2>
          <p>
            For questions regarding this privacy policy or our data security procedures, reach out to <strong>compliance@winkbench.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

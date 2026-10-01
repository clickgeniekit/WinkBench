import React from 'react';
import Link from 'next/link';
import { Scale, ShieldAlert, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — WinkBench',
  description: 'Terms of service and user agreements for the WinkBench business review platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Terms of Service</span>
      </nav>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-blue-600" />
          <span>Last Updated: October 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
          WinkBench Terms of Service
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          By accessing or using WinkBench, submitting reviews, or claiming a business profile, you agree to these Terms of Service.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">1. Authenticity of Reviews</h2>
          <p>
            WinkBench is founded on honest consumer feedback. You agree to submit reviews only about genuine, personal buying experiences or bona fide interactions with the business. You must not:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Post reviews for companies you own, work for, or have a direct financial interest in.</li>
            <li>Post negative reviews of commercial competitors.</li>
            <li>Accept compensation, free goods, discounts, or incentives in exchange for posting or altering a review.</li>
            <li>Use automated scripts, bots, or AI generators to fabricate testimonials.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">2. Business Profiles & Ownership Claims</h2>
          <p>
            Any legitimate business or web domain may have an open profile on WinkBench created by consumer feedback. Business representatives who claim a profile must:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Provide verifiable authorization proving employment or legal representation of the company.</li>
            <li>Adhere to fair reply standards when responding to critical customer reviews.</li>
            <li>Not harass, threaten, or attempt to intimidate customers who write negative reviews.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">3. Moderation and Review Integrity</h2>
          <p>
            WinkBench operates as an independent, neutral platform. Businesses cannot pay to remove negative reviews. All flagged reviews undergo neutral moderation based strictly on our published <Link href="/review-guidelines" className="text-blue-600 underline font-semibold">Review Guidelines</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">4. Prohibited Content</h2>
          <p>
            We strictly prohibit content that contains hate speech, profanity, defamation, personal private contact information (doxxing), or threats of violence. Violating content is removed immediately and repeating accounts are permanently banned.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">5. Limitation of Liability</h2>
          <p>
            WinkBench displays opinions and evaluations provided by independent consumers. While we maintain active anti-fraud detection, WinkBench does not endorse any specific business or guarantee the accuracy of individual consumer assertions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy-950">6. Governing Law & Inquiries</h2>
          <p>
            For questions regarding these terms, contact <strong>legal@winkbench.com</strong> or submit an inquiry through our <Link href="/contact" className="text-blue-600 underline font-semibold">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

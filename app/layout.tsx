import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoBanner from '@/components/DemoBanner';

export const metadata: Metadata = {
  title: 'WinkBench — Global Business Reviews, Reputation & Trust Platform',
  description: 'Discover trustworthy businesses worldwide, read authentic customer reviews, check independent Trust Scores, and share verified buying experiences.',
  keywords: ['business reviews', 'company reputation', 'trust score', 'customer ratings', 'verified reviews', 'WinkBench'],
  authors: [{ name: 'WinkBench Global Team' }],
  metadataBase: new URL('https://winkbench.com'),
  openGraph: {
    title: 'WinkBench — Global Business Reviews, Reputation & Trust Platform',
    description: 'Discover trustworthy businesses worldwide, read authentic customer reviews, check independent Trust Scores, and share verified buying experiences.',
    url: 'https://winkbench.com',
    siteName: 'WinkBench',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WinkBench — Global Business Reviews, Reputation & Trust Platform',
    description: 'Discover trustworthy businesses worldwide, read authentic customer reviews, check independent Trust Scores, and share verified buying experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'WinkBench',
    'url': 'https://winkbench.com',
    'description': 'Global business reviews, reputation, and community platform.',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-50 text-navy-950 flex flex-col min-h-screen antialiased">
        <DemoBanner />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

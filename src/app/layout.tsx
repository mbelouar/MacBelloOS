import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mohammed Bel Ouarraq — DevOps & Cloud',
  description:
    'Interactive desktop-style portfolio of Mohammed Bel Ouarraq, Computer Engineering student focused on DevOps, Kubernetes and cloud infrastructure.',
  keywords: ['portfolio', 'devops', 'cloud', 'kubernetes', 'docker', 'terraform', 'computer engineering'],
  authors: [{ name: 'Mohammed Bel Ouarraq' }],
  openGraph: {
    title: 'Mohammed Bel Ouarraq — DevOps & Cloud',
    description: 'Interactive desktop-style portfolio — projects, skills, certifications and more.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

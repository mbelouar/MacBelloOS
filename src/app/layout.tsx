import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mohammed Belouarraq — DevOps & Cloud',
  description:
    'Interactive desktop-style portfolio of Mohammed Belouarraq, Software Engineer focused on DevOps, Kubernetes, cloud infrastructure and AI evaluation.',
  keywords: ['portfolio', 'devops', 'cloud', 'kubernetes', 'docker', 'terraform', 'computer engineering'],
  authors: [{ name: 'Mohammed Belouarraq' }],
  openGraph: {
    title: 'Mohammed Belouarraq — DevOps & Cloud',
    description: 'Interactive desktop-style portfolio — projects, skills, certifications and more.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07080f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

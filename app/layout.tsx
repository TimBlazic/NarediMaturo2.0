import { PropsWithChildren } from 'react';
import 'styles/main.css';
import SupabaseProvider from './supabase-provider';
import Navbar from '@/components/ui/Navbar/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const meta = {
  title: 'NarediMaturo',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  type: meta.type,
  openGraph: {
    title: meta.title,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="loading">
        <SupabaseProvider>
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(68dvh-4rem)] md:min-h[calc(68dvh-5rem)]"
          >
            {children}
            <SpeedInsights />
          </main>
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}

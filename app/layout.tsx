import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import SupabaseProvider from './supabase-provider';
import { Analytics } from '@vercel/analytics/react';

const meta = {
  title: 'NarediMaturo',
  description: '',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  type: meta.type,
  openGraph: {
    title: meta.title,
    description: meta.description,
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
          </main>
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import BusinessSidebar from '@/components/BusinessSidebar';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Moy Sklad Dashboard',
  description: 'Savdo va ombor tahlili',
  robots: { index: false, follow: false },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      <BusinessSidebar />
      <main className="lg:ml-16 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

'use client';
import { usePathname } from 'next/navigation';

export default function ConditionalMain({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isOrder = path.startsWith('/order');
  return (
    <main className={isOrder ? '' : 'lg:ml-16 pt-14 lg:pt-0 min-h-screen'}>
      {children}
    </main>
  );
}

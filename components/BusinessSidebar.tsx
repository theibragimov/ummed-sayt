'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, Package, Users, BarChart2, Settings,
  Menu, X, HelpCircle, LogOut, CreditCard,
} from 'lucide-react';

const nav = [
  { href: '/business', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/business/earnings', icon: TrendingUp, label: 'Daromad' },
  { href: '/business/expenses', icon: CreditCard, label: 'Xarajatlar' },
  { href: '/business/products', icon: Package, label: 'Mahsulotlar' },
];

function NavIcon({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} title={label}
      className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
        active ? 'text-white' : 'text-gray-600 hover:text-white hover:bg-white/10'
      }`}
      style={active ? { background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 8px 20px rgba(255,107,53,0.4)' } : {}}>
      <Icon size={17} />
      <span className="absolute left-14 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-xl"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {label}
      </span>
    </Link>
  );
}

export default function BusinessSidebar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Desktop icon sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-16 flex-col items-center py-5 z-50 gap-1"
        style={{ background: '#111118', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-7 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 8px 20px rgba(255,107,53,0.35)' }}>
          <span className="text-white font-bold text-sm">MS</span>
        </div>
        <nav className="flex flex-col items-center gap-1.5 flex-1">
          {nav.map(({ href, icon, label }) => (
            <NavIcon key={href} href={href} icon={icon} label={label} active={path === href} />
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1.5 mt-auto">
          <Link href="/" title="Asosiy sayt" className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-300 transition-all"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <HelpCircle size={17} />
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{ background: '#111118', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => setOpen(true)} className="p-2 rounded-xl text-gray-500 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }} aria-label="Menyuni ochish">
          <Menu size={19} />
        </button>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 4px 12px rgba(255,107,53,0.35)' }}>
          <span className="text-white font-bold text-[11px]">MS</span>
        </div>
        <span className="font-bold text-white text-sm tracking-tight">Moy Sklad</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-gray-500">Jonli</span>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      )}

      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#111118', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 6px 16px rgba(255,107,53,0.35)' }}>
            <span className="text-white font-bold text-[11px]">MS</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Moy Sklad</p>
            <p className="text-[11px] text-gray-600">Dashboard</p>
          </div>
          <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={15} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = path === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={active
                  ? { background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,69,0,0.15))', color: '#FF6B35', borderLeft: '2px solid #FF6B35' }
                  : { color: '#6B7280', borderLeft: '2px solid transparent' }
                }
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-5 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '8px' }}>
          <Link href="/" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 hover:text-gray-300 transition-all"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <LogOut size={16} /> Asosiy sayt
          </Link>
        </div>
      </aside>
    </>
  );
}

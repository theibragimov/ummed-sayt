// Umumiy admin panel stil o'zgaruvchilari
export const A = {
  // Sahifa wrapper
  page: { fontFamily: "'Satoshi', -apple-system, sans-serif" },

  // Karta
  card: {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },

  cardPad: {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    padding: '24px',
  },

  // Sarlavhalar
  h1: { fontSize: '22px', fontWeight: 700, color: '#0a0a0a', margin: 0, letterSpacing: '-0.03em' },
  h2: { fontSize: '16px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 2px', letterSpacing: '-0.02em' },
  sub: { fontSize: '13px', color: '#9ca3af', margin: 0 },

  // Primary tugma
  btnPrimary: {
    background: '#E8491D', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '9px 18px',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Satoshi', sans-serif", letterSpacing: '0.01em',
    transition: 'background 0.15s',
  },

  // Ghost tugma
  btnGhost: {
    background: 'transparent', color: '#6b7280',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '10px', padding: '9px 18px',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
    fontFamily: "'Satoshi', sans-serif",
  },

  // Input
  input: {
    width: '100%', padding: '10px 14px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '10px', fontSize: '14px',
    fontFamily: "'Satoshi', sans-serif",
    outline: 'none', boxSizing: 'border-box',
    background: '#fff', color: '#0a0a0a',
    transition: 'border-color 0.15s',
  },

  // Textarea
  textarea: {
    width: '100%', padding: '10px 14px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '10px', fontSize: '14px',
    fontFamily: "'Satoshi', sans-serif",
    outline: 'none', boxSizing: 'border-box',
    resize: 'vertical', background: '#fff', color: '#0a0a0a',
  },

  // Select
  select: {
    width: '100%', padding: '10px 14px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '10px', fontSize: '14px',
    fontFamily: "'Satoshi', sans-serif",
    outline: 'none', background: '#fff', color: '#0a0a0a',
    cursor: 'pointer',
  },

  // Label
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', letterSpacing: '0.01em' },

  // Jadval header
  thRow: { display: 'flex', background: '#f9faf8', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '10px 16px' },
  th: { fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' },

  // Jadval row
  tdRow: { display: 'flex', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', alignItems: 'center', transition: 'background 0.1s' },
  td: { fontSize: '14px', color: '#374151' },

  // Badge
  badge: (bg, color) => ({
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 600,
    background: bg, color: color,
  }),

  // Divider
  divider: { height: '1px', background: 'rgba(0,0,0,0.06)', margin: '20px 0' },

  // Modal overlay
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, backdropFilter: 'blur(4px)',
  },

  modal: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    width: '100%', maxWidth: '480px', maxHeight: '90vh',
    overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
  },

  // Holat ranglari
  holat: {
    new: { bg: 'rgba(232,73,29,0.08)', color: '#E8491D', label: '🆕 Yangi' },
    inProgress: { bg: 'rgba(234,179,8,0.1)', color: '#b45309', label: '⏳ Jarayonda' },
    done: { bg: 'rgba(61,184,81,0.1)', color: '#16a34a', label: '✅ Bajarildi' },
    rejected: { bg: 'rgba(239,68,68,0.08)', color: '#dc2626', label: '❌ Rad etildi' },
  },
}

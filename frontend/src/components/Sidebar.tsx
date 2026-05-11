'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',           label: '🏠 Dashboard' },
  { href: '/usuarios',   label: '👤 Usuarios' },
  { href: '/categorias', label: '🏷️ Categorías' },
  { href: '/habitos',    label: '📌 Hábitos' },
  { href: '/metas',      label: '🎯 Metas' },
  { href: '/registros',  label: '📋 Registros' },
  { href: '/historial',  label: '📊 Historial' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: '#161B22',
        borderRight: '1px solid #30363D',
        padding: '24px 0',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🌱</div>
        <div style={{ color: '#2DD4BF', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>
          Hábitos
        </div>
        <div style={{ color: '#8B949E', fontSize: 11, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          CORHUILA 2026A
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navLinks.map((link) => {
          const active =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '10px 20px',
                color: active ? '#E6EDF3' : '#8B949E',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                borderLeft: active ? '3px solid #2DD4BF' : '3px solid transparent',
                background: active ? '#21262D' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#E6EDF3';
                  (e.currentTarget as HTMLAnchorElement).style.background = '#21262D33';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#8B949E';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '20px 20px 0', borderTop: '1px solid #30363D' }}>
        <a
          href="/auth/login"
          onClick={() => {
            if (typeof window !== 'undefined') localStorage.removeItem('token');
          }}
          style={{ display: 'block', color: '#F85149', fontSize: 13, textDecoration: 'none' }}
        >
          🚪 Cerrar sesión
        </a>
        <div style={{ color: '#484F58', fontSize: 10, marginTop: 12, lineHeight: 1.5 }}>
          Prog. Web 2026A<br />Sprint 5 — Completo
        </div>
      </div>
    </aside>
  );
}

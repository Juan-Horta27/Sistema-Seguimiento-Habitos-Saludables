'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',             label: 'Inicio',      icon: '🏠' },
  { href: '/usuarios',     label: 'Usuarios',    icon: '👥' },
  { href: '/categorias',   label: 'Categorías',  icon: '🏷️' },
  { href: '/habitos',      label: 'Hábitos',     icon: '🌱' },
  { href: '/metas',        label: 'Metas',       icon: '🎯' },
  { href: '/auth/login',   label: 'Login',       icon: '🔐' },
  { href: '/auth/register',label: 'Registro',    icon: '📝' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', display: 'flex' }}>

        {/* Sidebar */}
        <aside style={{
          width: '240px', minHeight: '100vh', backgroundColor: '#161b22',
          borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column',
          padding: '24px 16px', position: 'fixed', top: 0, left: 0, bottom: 0,
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              🌿 Hábitos
            </div>
            <div style={{ fontSize: '11px', color: '#7d8590', marginTop: '2px', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Saludables
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: active ? '600' : '400',
                  color: active ? '#e6edf3' : '#7d8590',
                  backgroundColor: active ? '#21262d' : 'transparent',
                  transition: 'all 0.15s ease',
                  borderLeft: active ? '3px solid #2dd4bf' : '3px solid transparent',
                }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sprint badge */}
          <div style={{ paddingTop: '16px', borderTop: '1px solid #30363d' }}>
            <div style={{ fontSize: '11px', color: '#7d8590', paddingLeft: '8px', lineHeight: 1.6 }}>
              Programación Web<br />
              <span style={{ color: '#3fb950' }}>Sprint 2 — 2026A</span>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', padding: '40px 48px', backgroundColor: '#0d1117' }}>
          {children}
        </main>
      </body>
    </html>
  );
}

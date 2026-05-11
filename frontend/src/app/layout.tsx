import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Hábitos Saludables',
  description: 'Sistema de Seguimiento de Hábitos — CORHUILA 2026A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#0D1117',
          color: '#E6EDF3',
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <Sidebar />
        <main style={{ flex: 1, padding: '32px 36px', overflowX: 'hidden' }}>
          {children}
        </main>
      </body>
    </html>
  );
}

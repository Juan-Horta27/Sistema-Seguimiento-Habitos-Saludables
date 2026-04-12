'use client';

import Link from 'next/link';

const cards = [
  {
    href: '/auth/register',
    icon: '📝',
    title: 'Registrarse',
    desc: 'Crea una cuenta nueva para empezar a registrar tus hábitos.',
    color: '#2dd4bf',
  },
  {
    href: '/auth/login',
    icon: '🔐',
    title: 'Iniciar Sesión',
    desc: 'Accede a tu cuenta con tu correo y contraseña.',
    color: '#58a6ff',
  },
  {
    href: '/usuarios',
    icon: '👥',
    title: 'Usuarios',
    desc: 'Consulta y gestiona los usuarios registrados en el sistema.',
    color: '#3fb950',
  },
  {
    href: '/categorias',
    icon: '🏷️',
    title: 'Categorías',
    desc: 'Administra las categorías de hábitos: hidratación, ejercicio, sueño…',
    color: '#f78166',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '12px',
          color: '#3fb950',
          fontWeight: '500',
          marginBottom: '20px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3fb950', display: 'inline-block' }} />
          Sprint 1 activo
        </div>

        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          color: '#e6edf3',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          marginBottom: '12px',
        }}>
          Sistema de Seguimiento<br />
          <span style={{ color: '#2dd4bf' }}>de Hábitos Saludables</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#7d8590', maxWidth: '520px', lineHeight: 1.6 }}>
          Registra, mide y mejora tus hábitos diarios. Hidratación, ejercicio, alimentación, sueño y meditación.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '48px',
      }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '12px',
              padding: '24px',
              transition: 'border-color 0.2s ease, transform 0.2s ease',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = card.color;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#30363d';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{card.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#e6edf3', marginBottom: '6px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '13px', color: '#7d8590', lineHeight: 1.5 }}>
                {card.desc}
              </div>
              <div style={{ marginTop: '16px', fontSize: '12px', color: card.color, fontWeight: '600' }}>
                Ir a {card.title} →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stack info */}
      <div style={{
        backgroundColor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        {['NestJS · Backend', 'Next.js · Frontend', 'PostgreSQL · BD', 'Prisma · ORM', 'Docker · Infra'].map((item) => (
          <div key={item} style={{ fontSize: '12px', color: '#7d8590', fontWeight: '500' }}>
            <span style={{ color: '#2dd4bf' }}>▸</span> {item}
          </div>
        ))}
      </div>
    </div>
  );
}

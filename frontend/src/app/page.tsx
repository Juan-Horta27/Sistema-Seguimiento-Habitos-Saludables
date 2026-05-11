'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/services/api';

interface DashboardData {
  resumen: {
    totalHabitos: number;
    habitosRegistradosHoy: number;
    porcentajeCompletadoHoy: number;
    totalRegistrosSemana: number;
    metasCumplidasSemana: number;
    porcentajeSemana: number;
    mejorRachaActual: number;
  };
  actividadSemanal: Array<{
    fecha: string;
    total: number;
    cumplidas: number;
    porcentaje: number;
  }>;
  habitos: Array<{
    id: number;
    nombre: string;
    unidadMedida: string;
    metaActiva: { valorObjetivo: number; descripcion?: string } | null;
    racha: { rachaActual: number; rachaMaxima: number };
  }>;
  registrosHoy: Array<{
    id: number;
    habitoId: number;
    valorRegistrado: number;
    metaCumplida: boolean;
    habito: { nombre: string };
  }>;
}

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const USUARIO_ID = 1; // TODO: obtener del token JWT

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetch(`${API_URL}/dashboard/usuario/${USUARIO_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
          return null;
        }
        return r.json();
      })
      .then((res) => {
        if (!res) return;
        const payload = res.data ?? res;
        if (payload?.resumen) {
          setData(payload);
        } else {
          setError('No se pudo cargar el dashboard. Verifica que el backend está corriendo.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo conectar con el backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ color: '#8B949E', textAlign: 'center', paddingTop: 60 }}>
        Cargando dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ color: '#F85149', textAlign: 'center', paddingTop: 60 }}>
        {error || 'Error al cargar el dashboard.'}
      </div>
    );
  }

  const { resumen, actividadSemanal, habitos, registrosHoy } = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#E6EDF3', margin: 0 }}>
            🏠 Dashboard
          </h1>
          <p style={{ color: '#8B949E', margin: '4px 0 0', fontSize: 14 }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => router.push('/registro/new')}
          style={{
            background: '#2DD4BF',
            color: '#0D1117',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Registrar hoy
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Hábitos activos', valor: resumen.totalHabitos, icon: '📌', color: '#2DD4BF' },
          {
            label: 'Completados hoy',
            valor: `${resumen.habitosRegistradosHoy}/${resumen.totalHabitos}`,
            icon: '✅',
            color: '#3FB950',
            sub: `${resumen.porcentajeCompletadoHoy}%`,
          },
          {
            label: 'Metas esta semana',
            valor: resumen.metasCumplidasSemana,
            icon: '🎯',
            color: '#F0883E',
            sub: `${resumen.porcentajeSemana}% de los registros`,
          },
          {
            label: 'Mejor racha actual',
            valor: `${resumen.mejorRachaActual} días`,
            icon: '🔥',
            color: '#F85149',
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: '#161B22',
              border: '1px solid #30363D',
              borderRadius: 12,
              padding: '18px 20px',
              borderTop: `3px solid ${card.color}`,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ color: card.color, fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
              {card.valor}
            </div>
            {card.sub && (
              <div style={{ color: '#8B949E', fontSize: 12, marginTop: 2 }}>{card.sub}</div>
            )}
            <div style={{ color: '#8B949E', fontSize: 13, marginTop: 6 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Actividad semanal */}
      <div
        style={{
          background: '#161B22',
          border: '1px solid #30363D',
          borderRadius: 12,
          padding: 22,
          marginBottom: 28,
        }}
      >
        <h2 style={{ color: '#E6EDF3', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
          📅 Actividad de la semana
        </h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 100 }}>
          {actividadSemanal.map((dia, i) => {
            const altura = dia.total > 0 ? Math.max(20, (dia.porcentaje / 100) * 80) : 8;
            const color = dia.porcentaje >= 80 ? '#3FB950' : dia.porcentaje >= 50 ? '#F0883E' : dia.total > 0 ? '#F85149' : '#21262D';
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ color: '#8B949E', fontSize: 11 }}>
                  {dia.total > 0 ? `${dia.porcentaje}%` : ''}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: altura,
                    background: color,
                    borderRadius: 4,
                    transition: 'all 0.3s',
                  }}
                  title={`${DIAS[i]}: ${dia.cumplidas}/${dia.total} metas`}
                />
                <div style={{ color: '#8B949E', fontSize: 12 }}>{DIAS[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hábitos y registros de hoy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Rachas */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 20 }}>
          <h2 style={{ color: '#E6EDF3', fontSize: 16, fontWeight: 600, margin: '0 0 14px' }}>
            🔥 Rachas actuales
          </h2>
          {habitos.length === 0 ? (
            <p style={{ color: '#8B949E', fontSize: 14 }}>
              No tienes hábitos activos.{' '}
              <span
                onClick={() => router.push('/habitos')}
                style={{ color: '#2DD4BF', cursor: 'pointer' }}
              >
                Crear hábito →
              </span>
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {habitos.map((h) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#E6EDF3', fontSize: 14, fontWeight: 500 }}>{h.nombre}</div>
                    {h.metaActiva && (
                      <div style={{ color: '#8B949E', fontSize: 12 }}>
                        Meta: {h.metaActiva.valorObjetivo} {h.unidadMedida}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#F0883E', fontWeight: 700, fontSize: 18 }}>
                      {h.racha.rachaActual}🔥
                    </div>
                    <div style={{ color: '#8B949E', fontSize: 11 }}>
                      máx: {h.racha.rachaMaxima}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registros de hoy */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 20 }}>
          <h2 style={{ color: '#E6EDF3', fontSize: 16, fontWeight: 600, margin: '0 0 14px' }}>
            📝 Registrado hoy
          </h2>
          {registrosHoy.length === 0 ? (
            <div style={{ color: '#8B949E', fontSize: 14 }}>
              <p style={{ marginBottom: 12 }}>Aún no has registrado nada hoy.</p>
              <button
                onClick={() => router.push('/registro/new')}
                style={{
                  background: '#21262D',
                  border: '1px solid #2DD4BF',
                  color: '#2DD4BF',
                  borderRadius: 6,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                + Registrar ahora
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {registrosHoy.map((r) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#E6EDF3', fontSize: 14 }}>
                    {r.metaCumplida ? '✅' : '⭕'} {r.habito.nombre}
                  </span>
                  <span style={{ color: '#2DD4BF', fontWeight: 600, fontSize: 14 }}>
                    {r.valorRegistrado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

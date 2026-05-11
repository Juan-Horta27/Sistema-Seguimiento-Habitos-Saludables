'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/services/api';

interface Registro {
  id: number;
  habitoId: number;
  fecha: string;
  valorRegistrado: number;
  metaCumplida: boolean;
  notas?: string;
  habito: { id: number; nombre: string; unidadMedida: string };
}

export default function RegistrosPage() {
  const router = useRouter();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [habitoFiltro, setHabitoFiltro] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const cargar = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    const url = habitoFiltro
      ? `${API_URL}/registros?habitoId=${habitoFiltro}`
      : `${API_URL}/registros`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    setRegistros(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [habitoFiltro]);

  const eliminar = async (id: number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    await fetch(`${API_URL}/registros/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    setConfirmDelete(null);
    cargar();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#E6EDF3', margin: 0 }}>
          📋 Registros Diarios
        </h1>
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
          + Nuevo Registro
        </button>
      </div>

      {/* Filtro */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Filtrar por ID de hábito..."
          value={habitoFiltro}
          onChange={(e) => setHabitoFiltro(e.target.value)}
          style={{
            background: '#161B22',
            border: '1px solid #30363D',
            borderRadius: 8,
            padding: '8px 14px',
            color: '#E6EDF3',
            fontSize: 14,
            width: 260,
          }}
        />
      </div>

      {loading ? (
        <p style={{ color: '#8B949E' }}>Cargando registros...</p>
      ) : registros.length === 0 ? (
        <div
          style={{
            background: '#161B22',
            border: '1px solid #30363D',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: '#8B949E',
          }}
        >
          <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
          <p>No hay registros todavía. ¡Empieza registrando tu primer hábito hoy!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {registros.map((r) => (
            <div
              key={r.id}
              style={{
                background: '#161B22',
                border: `1px solid ${r.metaCumplida ? '#3FB950' : '#30363D'}`,
                borderRadius: 10,
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: r.metaCumplida ? '#3FB950' : '#8B949E', fontSize: 18 }}>
                    {r.metaCumplida ? '✅' : '⭕'}
                  </span>
                  <span style={{ color: '#E6EDF3', fontWeight: 600, fontSize: 15 }}>
                    {r.habito.nombre}
                  </span>
                  <span
                    style={{
                      background: '#21262D',
                      color: '#8B949E',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 12,
                    }}
                  >
                    {new Date(r.fecha).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <div style={{ color: '#2DD4BF', fontSize: 14, paddingLeft: 28 }}>
                  {r.valorRegistrado} {r.habito.unidadMedida}
                  {r.notas && (
                    <span style={{ color: '#8B949E', marginLeft: 12 }}>· {r.notas}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {confirmDelete === r.id ? (
                  <>
                    <button
                      onClick={() => eliminar(r.id)}
                      style={{
                        background: '#F85149',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{
                        background: '#21262D',
                        color: '#8B949E',
                        border: '1px solid #30363D',
                        borderRadius: 6,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(r.id)}
                    style={{
                      background: 'transparent',
                      color: '#F85149',
                      border: '1px solid #F85149',
                      borderRadius: 6,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

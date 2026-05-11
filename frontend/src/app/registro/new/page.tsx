'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/services/api';

interface Habito {
  id: number;
  nombre: string;
  unidadMedida: string;
}

export default function NuevoRegistroPage() {
  const router = useRouter();
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [form, setForm] = useState({
    habitoId: '',
    fecha: new Date().toISOString().split('T')[0],
    valorRegistrado: '',
    notas: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`${API_URL}/habitos`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((res) => setHabitos(res.data ?? []))
      .catch(() => setError('No se pudieron cargar los hábitos'));
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!form.habitoId || !form.fecha || !form.valorRegistrado) {
      setError('Todos los campos marcados con * son obligatorios');
      return;
    }

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_URL}/registros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          habitoId: +form.habitoId,
          fecha: form.fecha,
          valorRegistrado: +form.valorRegistrado,
          notas: form.notas || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const raw = data.message ?? data.error ?? 'Error al registrar';
        const msg = Array.isArray(raw) ? raw[0] : raw;
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        return;
      }

      const registro = data.data;
      const cumplioMeta = registro.metaCumplida;
      setSuccess(
        cumplioMeta
          ? '✅ Registro guardado. ¡Meta cumplida hoy!'
          : '📝 Registro guardado. Sigue esforzándote para cumplir la meta.',
      );
      setTimeout(() => router.push('/registros'), 1500);
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const habitoSeleccionado = habitos.find((h) => h.id === +form.habitoId);

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: '#21262D',
            border: '1px solid #30363D',
            color: '#8B949E',
            borderRadius: 6,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          ← Volver
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#E6EDF3', margin: 0 }}>
          📋 Nuevo Registro
        </h1>
      </div>

      <div
        style={{
          background: '#161B22',
          border: '1px solid #30363D',
          borderRadius: 12,
          padding: 28,
        }}
      >
        {error && (
          <div
            style={{
              background: '#3D1A1A',
              border: '1px solid #F85149',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#F85149',
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: '#162017',
              border: '1px solid #3FB950',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#3FB950',
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            {success}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Hábito */}
          <div>
            <label style={{ display: 'block', color: '#8B949E', fontSize: 13, marginBottom: 6 }}>
              Hábito *
            </label>
            <select
              value={form.habitoId}
              onChange={(e) => setForm({ ...form, habitoId: e.target.value })}
              style={{
                width: '100%',
                background: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#E6EDF3',
                fontSize: 14,
              }}
            >
              <option value="">-- Selecciona un hábito --</option>
              {habitos.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nombre} ({h.unidadMedida})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label style={{ display: 'block', color: '#8B949E', fontSize: 13, marginBottom: 6 }}>
              Fecha *
            </label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              style={{
                width: '100%',
                background: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#E6EDF3',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Valor */}
          <div>
            <label style={{ display: 'block', color: '#8B949E', fontSize: 13, marginBottom: 6 }}>
              Valor registrado{habitoSeleccionado ? ` (${habitoSeleccionado.unidadMedida})` : ''} *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.valorRegistrado}
              onChange={(e) => setForm({ ...form, valorRegistrado: e.target.value })}
              placeholder="Ej: 8, 30, 2.5..."
              style={{
                width: '100%',
                background: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#E6EDF3',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Notas */}
          <div>
            <label style={{ display: 'block', color: '#8B949E', fontSize: 13, marginBottom: 6 }}>
              Notas (opcional)
            </label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Cómo te sentiste, observaciones..."
              rows={3}
              style={{
                width: '100%',
                background: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#E6EDF3',
                fontSize: 14,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? '#21262D' : '#2DD4BF',
              color: loading ? '#8B949E' : '#0D1117',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: 4,
            }}
          >
            {loading ? 'Guardando...' : '💾 Guardar Registro'}
          </button>
        </div>
      </div>
    </div>
  );
}

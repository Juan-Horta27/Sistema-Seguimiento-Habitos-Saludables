'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Meta {
  id: number; descripcion: string; valorMeta: number; activa: boolean; createdAt: string;
  habito: { id: number; nombre: string };
}
interface Habito { id: number; nombre: string; }

export default function MetasPage() {
  const searchParams = useSearchParams();
  const habitoIdParam = searchParams.get('habitoId');

  const [metas, setMetas] = useState<Meta[]>([]);
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ habitoId: habitoIdParam ?? '', descripcion: '', valorMeta: '' });

  const load = () => {
    setLoading(true);
    const url = habitoIdParam
      ? `http://localhost:3001/metas?habitoId=${habitoIdParam}`
      : 'http://localhost:3001/metas';

    Promise.all([
      fetch(url).then(r => r.json()),
      fetch('http://localhost:3001/habitos').then(r => r.json()),
    ])
      .then(([m, h]) => { setMetas(m.data ?? []); setHabitos(h.data ?? []); setLoading(false); })
      .catch(() => { setError('No se pudo conectar al backend'); setLoading(false); });
  };

  useEffect(() => { load(); }, [habitoIdParam]);

  const handleSubmit = async () => {
    if (!form.habitoId || !form.descripcion || !form.valorMeta) {
      setError('Todos los campos son obligatorios'); return;
    }
    setSaving(true); setError('');
    try {
      const res = await fetch('http://localhost:3001/metas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitoId: +form.habitoId, descripcion: form.descripcion, valorMeta: +form.valorMeta }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message?.[0] ?? 'Error al crear meta'); }
      else {
        setSuccess('✅ Meta creada correctamente');
        setForm({ habitoId: habitoIdParam ?? '', descripcion: '', valorMeta: '' });
        setShowForm(false); load();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch { setError('Error de conexión'); }
    setSaving(false);
  };

  const toggleActiva = async (meta: Meta) => {
    try {
      const res = await fetch(`http://localhost:3001/metas/${meta.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: !meta.activa }),
      });
      if (res.ok) load();
    } catch { setError('Error al actualizar meta'); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', backgroundColor: '#0d1117',
    border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none',
  };
  const labelStyle = { fontSize: '12px', color: '#7d8590', fontWeight: '600' as const, display: 'block' as const, marginBottom: '6px' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            🎯 Metas Personales
          </h1>
          <p style={{ fontSize: '14px', color: '#7d8590' }}>
            {habitoIdParam ? `Filtrando por hábito #${habitoIdParam} · ` : ''}
            Define objetivos medibles para cada hábito
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {habitoIdParam && (
            <Link href="/metas" style={{ backgroundColor: 'transparent', color: '#7d8590', border: '1px solid #30363d', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', textDecoration: 'none' }}>
              Ver todas
            </Link>
          )}
          <button onClick={() => { setShowForm(!showForm); setError(''); }} style={{
            backgroundColor: '#238636', color: '#fff', border: '1px solid #3fb950',
            borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>
            {showForm ? '✕ Cancelar' : '+ Nueva Meta'}
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {success && <div style={{ backgroundColor: '#0f2a1a', border: '1px solid #3fb950', borderRadius: '8px', padding: '12px 16px', color: '#3fb950', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}
      {error && <div style={{ backgroundColor: '#1f1117', border: '1px solid #f85149', borderRadius: '8px', padding: '12px 16px', color: '#f85149', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}

      {/* Formulario */}
      {showForm && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #2dd4bf', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e6edf3', marginBottom: '18px' }}>Nueva Meta</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>HÁBITO *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.habitoId}
                onChange={e => setForm({ ...form, habitoId: e.target.value })}>
                <option value="">Selecciona un hábito</option>
                {habitos.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>DESCRIPCIÓN DEL OBJETIVO *</label>
              <input style={inputStyle} placeholder="ej: Beber 8 vasos de agua al día"
                value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>VALOR META * (número)</label>
              <input type="number" style={{ ...inputStyle, width: '200px' }} placeholder="ej: 8"
                value={form.valorMeta} onChange={e => setForm({ ...form, valorMeta: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={handleSubmit} disabled={saving} style={{
                backgroundColor: '#238636', color: '#fff', border: '1px solid #3fb950',
                borderRadius: '8px', padding: '9px 20px', fontSize: '13px', fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Guardando...' : 'Guardar Meta'}
              </button>
              <button onClick={() => setShowForm(false)} style={{
                backgroundColor: 'transparent', color: '#7d8590', border: '1px solid #30363d',
                borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer',
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#7d8590', fontSize: '14px' }}>⏳ Cargando metas...</div>}

      {!loading && !error && metas.length === 0 && (
        <div style={{ backgroundColor: '#161b22', border: '1px dashed #30363d', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
          <div style={{ color: '#7d8590', fontSize: '14px' }}>No hay metas registradas aún.</div>
        </div>
      )}

      {/* Grid de metas */}
      {!loading && metas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {metas.map(meta => (
            <div key={meta.id} style={{
              backgroundColor: '#161b22',
              border: `1px solid ${meta.activa ? '#238636' : '#30363d'}`,
              borderRadius: '12px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              opacity: meta.activa ? 1 : 0.6,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '12px',
                    backgroundColor: meta.activa ? '#0f2a1a' : '#21262d',
                    color: meta.activa ? '#3fb950' : '#7d8590',
                    border: `1px solid ${meta.activa ? '#238636' : '#30363d'}`,
                  }}>
                    {meta.activa ? '● Activa' : '○ Inactiva'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#58a6ff' }}>🌱 {meta.habito.nombre}</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#e6edf3', marginBottom: '4px' }}>{meta.descripcion}</div>
                <div style={{ fontSize: '13px', color: '#7d8590' }}>
                  Objetivo: <span style={{ color: '#2dd4bf', fontWeight: '700' }}>{meta.valorMeta}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                <button onClick={() => toggleActiva(meta)} style={{
                  backgroundColor: 'transparent', fontSize: '12px',
                  color: meta.activa ? '#f85149' : '#3fb950',
                  border: '1px solid #30363d', borderRadius: '6px',
                  padding: '6px 12px', cursor: 'pointer',
                }}>
                  {meta.activa ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Categoria { id: number; nombre: string; }
interface Habito {
  id: number;
  nombre: string;
  descripcion?: string;
  categoriaHabito: { id: number; nombre: string };
  usuario: { id: number; nombres: string; apellidos: string };
  _count: { registrosDiarios: number; metas: number };
}

const CATEGORIA_ICONS: Record<string, string> = {
  hidratación: '💧', hidratacion: '💧',
  ejercicio: '🏃', actividad: '🏃',
  alimentación: '🥗', alimentacion: '🥗',
  sueño: '😴', sueno: '😴',
  meditación: '🧘', meditacion: '🧘',
};
function catIcon(nombre: string) {
  const k = nombre.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORIA_ICONS)) {
    if (k.includes(key)) return val;
  }
  return '🏷️';
}

export default function HabitosPage() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoriaHabitoId: '', usuarioId: '1' });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3001/habitos').then(r => r.json()),
      fetch('http://localhost:3001/categorias-habito').then(r => r.json()),
    ])
      .then(([h, c]) => {
        setHabitos(h.data ?? []);
        setCategorias(c.data ?? []);
        setLoading(false);
      })
      .catch(() => { setError('No se pudo conectar al backend'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.categoriaHabitoId) {
      setError('Nombre y categoría son obligatorios'); return;
    }
    setSaving(true); setError('');
    try {
      const res = await fetch('http://localhost:3001/habitos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion || undefined,
          categoriaHabitoId: +form.categoriaHabitoId,
          usuarioId: +form.usuarioId,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message?.[0] ?? 'Error al crear hábito'); }
      else {
        setSuccess('✅ Hábito creado correctamente');
        setForm({ nombre: '', descripcion: '', categoriaHabitoId: '', usuarioId: '1' });
        setShowForm(false); load();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch { setError('Error de conexión'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este hábito?')) return;
    try {
      const res = await fetch(`http://localhost:3001/habitos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message?.[0] ?? 'No se pudo eliminar');
      } else { setSuccess('✅ Hábito eliminado'); load(); setTimeout(() => setSuccess(''), 3000); }
    } catch { setError('Error de conexión'); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    backgroundColor: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none',
  };
  const labelStyle = { fontSize: '12px', color: '#7d8590', fontWeight: '600' as const, display: 'block' as const, marginBottom: '6px' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            🌱 Hábitos
          </h1>
          <p style={{ fontSize: '14px', color: '#7d8590' }}>Gestiona los hábitos personalizados por usuario</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }} style={{
          backgroundColor: '#238636', color: '#fff', border: '1px solid #3fb950',
          borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
        }}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Hábito'}
        </button>
      </div>

      {/* Mensajes */}
      {success && <div style={{ backgroundColor: '#0f2a1a', border: '1px solid #3fb950', borderRadius: '8px', padding: '12px 16px', color: '#3fb950', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}
      {error && <div style={{ backgroundColor: '#1f1117', border: '1px solid #f85149', borderRadius: '8px', padding: '12px 16px', color: '#f85149', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}

      {/* Formulario */}
      {showForm && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #2dd4bf', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e6edf3', marginBottom: '18px' }}>Nuevo Hábito</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>NOMBRE *</label>
                <input style={inputStyle} placeholder="ej: Beber agua" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>CATEGORÍA *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.categoriaHabitoId}
                  onChange={e => setForm({ ...form, categoriaHabitoId: e.target.value })}>
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{catIcon(c.nombre)} {c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>DESCRIPCIÓN</label>
              <input style={inputStyle} placeholder="ej: Tomar 8 vasos de agua al día"
                value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>ID DE USUARIO *</label>
              <input type="number" style={{ ...inputStyle, width: '140px' }} value={form.usuarioId}
                onChange={e => setForm({ ...form, usuarioId: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={handleSubmit} disabled={saving} style={{
                backgroundColor: '#238636', color: '#fff', border: '1px solid #3fb950',
                borderRadius: '8px', padding: '9px 20px', fontSize: '13px', fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Guardando...' : 'Guardar Hábito'}
              </button>
              <button onClick={() => setShowForm(false)} style={{
                backgroundColor: 'transparent', color: '#7d8590', border: '1px solid #30363d',
                borderRadius: '8px', padding: '9px 20px', fontSize: '13px', cursor: 'pointer',
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#7d8590', fontSize: '14px' }}>⏳ Cargando hábitos...</div>}

      {/* Empty */}
      {!loading && !error && habitos.length === 0 && (
        <div style={{ backgroundColor: '#161b22', border: '1px dashed #30363d', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
          <div style={{ color: '#7d8590', fontSize: '14px' }}>No hay hábitos registrados aún.</div>
        </div>
      )}

      {/* Tabla */}
      {!loading && habitos.length > 0 && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#21262d', borderBottom: '1px solid #30363d' }}>
                {['ID', 'Hábito', 'Categoría', 'Usuario', 'Registros', 'Metas', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#7d8590', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habitos.map((h, i) => (
                <tr key={h.id}
                  style={{ borderBottom: i < habitos.length - 1 ? '1px solid #21262d' : 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#21262d'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7d8590', fontFamily: 'monospace' }}>#{h.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e6edf3' }}>{h.nombre}</div>
                    {h.descripcion && <div style={{ fontSize: '12px', color: '#7d8590', marginTop: '2px' }}>{h.descripcion}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>
                    {catIcon(h.categoriaHabito.nombre)} {h.categoriaHabito.nombre}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>
                    {h.usuario.nombres} {h.usuario.apellidos}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#21262d', color: '#2dd4bf', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>
                      {h._count.registrosDiarios}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#21262d', color: '#3fb950', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>
                      {h._count.metas}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/habitos/${h.id}`} style={{
                        fontSize: '12px', color: '#58a6ff', textDecoration: 'none',
                        border: '1px solid #30363d', borderRadius: '6px', padding: '4px 10px',
                      }}>Ver</Link>
                      <button onClick={() => handleDelete(h.id)} style={{
                        fontSize: '12px', color: '#f85149', background: 'none',
                        border: '1px solid #30363d', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                      }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '10px 16px', borderTop: '1px solid #30363d', fontSize: '12px', color: '#7d8590' }}>
            {habitos.length} hábito{habitos.length !== 1 ? 's' : ''} en total
          </div>
        </div>
      )}
    </div>
  );
}

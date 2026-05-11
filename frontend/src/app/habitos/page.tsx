'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Categoria { id: number; nombre: string; icono?: string; }
interface Habito {
  id: number;
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  frecuencia: string;
  activo: boolean;
  categoriaHabito: { id: number; nombre: string; icono?: string };
  usuario: { id: number; nombres: string; apellidos: string };
  _count: { registros: number; metas: number };
}

const CAT_ICONS: Record<string, string> = {
  hidrat: '💧', ejercicio: '🏃', actividad: '🏃',
  aliment: '🥗', sueño: '😴', sueno: '😴', medita: '🧘',
};
function catIcon(n: string) {
  const k = n.toLowerCase();
  for (const [key, v] of Object.entries(CAT_ICONS)) if (k.includes(key)) return v;
  return '🏷️';
}

import { API_URL } from '@/services/api';

const API = API_URL;

export default function HabitosPage() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', categoriaHabitoId: '',
    usuarioId: '1', unidadMedida: '', frecuencia: 'diaria',
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/habitos`).then(r => r.json()),
      fetch(`${API}/categorias`).then(r => r.json()),
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
    if (!form.nombre.trim() || !form.categoriaHabitoId || !form.unidadMedida.trim()) {
      setError('Nombre, categoría y unidad de medida son obligatorios'); return;
    }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API}/habitos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion || undefined,
          categoriaHabitoId: +form.categoriaHabitoId,
          usuarioId: +form.usuarioId,
          unidadMedida: form.unidadMedida,
          frecuencia: form.frecuencia,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message;
        setError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al crear hábito');
      } else {
        setSuccess('✅ Hábito creado correctamente');
        setForm({ nombre: '', descripcion: '', categoriaHabitoId: '', usuarioId: '1', unidadMedida: '', frecuencia: 'diaria' });
        setShowForm(false); load();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch { setError('Error de conexión'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este hábito?')) return;
    try {
      const res = await fetch(`${API}/habitos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        const msg = data.message;
        setError(Array.isArray(msg) ? msg[0] : msg ?? 'No se pudo eliminar');
      } else { setSuccess('✅ Hábito eliminado'); load(); setTimeout(() => setSuccess(''), 3000); }
    } catch { setError('Error de conexión'); }
  };

  const inp = {
    width: '100%', padding: '10px 14px',
    backgroundColor: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none',
  };
  const lbl = { fontSize: '12px', color: '#7d8590', fontWeight: '600' as const, display: 'block' as const, marginBottom: '6px' };

  return (
    <div>
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

      {success && <div style={{ backgroundColor: '#0f2a1a', border: '1px solid #3fb950', borderRadius: '8px', padding: '12px 16px', color: '#3fb950', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}
      {error && <div style={{ backgroundColor: '#1f1117', border: '1px solid #f85149', borderRadius: '8px', padding: '12px 16px', color: '#f85149', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}

      {showForm && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #2dd4bf', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e6edf3', marginBottom: '18px' }}>Nuevo Hábito</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>NOMBRE *</label>
                <input style={inp} placeholder="ej: Beber agua" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>CATEGORÍA *</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.categoriaHabitoId}
                  onChange={e => setForm({ ...form, categoriaHabitoId: e.target.value })}>
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{catIcon(c.nombre)} {c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>UNIDAD DE MEDIDA *</label>
                <input style={inp} placeholder="ej: vasos, minutos, km, horas"
                  value={form.unidadMedida} onChange={e => setForm({ ...form, unidadMedida: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>FRECUENCIA</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.frecuencia}
                  onChange={e => setForm({ ...form, frecuencia: e.target.value })}>
                  <option value="diaria">Diaria</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>DESCRIPCIÓN</label>
              <input style={inp} placeholder="ej: Tomar 8 vasos de agua al día"
                value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>ID DE USUARIO *</label>
              <input type="number" style={{ ...inp, width: '140px' }} value={form.usuarioId}
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

      {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#7d8590', fontSize: '14px' }}>⏳ Cargando hábitos...</div>}

      {!loading && !error && habitos.length === 0 && (
        <div style={{ backgroundColor: '#161b22', border: '1px dashed #30363d', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
          <div style={{ color: '#7d8590', fontSize: '14px' }}>No hay hábitos registrados aún.</div>
        </div>
      )}

      {!loading && habitos.length > 0 && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#21262d', borderBottom: '1px solid #30363d' }}>
                {['ID', 'Hábito', 'Unidad', 'Categoría', 'Usuario', 'Registros', 'Metas', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#7d8590', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habitos.map((h, i) => (
                <tr key={h.id} style={{ borderBottom: i < habitos.length - 1 ? '1px solid #21262d' : 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#21262d'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7d8590', fontFamily: 'monospace' }}>#{h.id}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e6edf3' }}>{h.nombre}</div>
                    {h.descripcion && <div style={{ fontSize: '12px', color: '#7d8590', marginTop: '2px' }}>{h.descripcion}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#2dd4bf' }}>{h.unidadMedida}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>
                    {catIcon(h.categoriaHabito.nombre)} {h.categoriaHabito.nombre}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>
                    {h.usuario.nombres} {h.usuario.apellidos}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#21262d', color: '#2dd4bf', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>
                      {h._count.registros}
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

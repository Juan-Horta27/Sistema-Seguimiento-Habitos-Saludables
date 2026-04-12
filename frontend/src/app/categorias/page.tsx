'use client';

import { useEffect, useState } from 'react';

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  createdAt: string;
}

const ICONS: Record<string, string> = {
  hidratación: '💧', hidratacion: '💧',
  ejercicio: '🏃', actividad: '🏃',
  alimentación: '🥗', alimentacion: '🥗', nutrición: '🥗',
  sueño: '😴', sueno: '😴',
  meditación: '🧘', meditacion: '🧘',
};

function getIcon(nombre: string) {
  const key = nombre.toLowerCase();
  for (const [k, v] of Object.entries(ICONS)) {
    if (key.includes(k)) return v;
  }
  return '🏷️';
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = () => {
    setLoading(true);
    fetch('http://localhost:3001/categorias-habito')
      .then((r) => r.json())
      .then((res) => { setCategorias(res.data ?? []); setLoading(false); })
      .catch(() => { setError('No se pudo conectar al backend'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3001/categorias-habito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message?.[0] ?? 'Error al crear categoría');
      } else {
        setSuccessMsg('✅ Categoría creada correctamente');
        setForm({ nombre: '', descripcion: '' });
        setShowForm(false);
        load();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setError('Error de conexión');
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    backgroundColor: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3', fontSize: '14px',
    outline: 'none',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            🏷️ Categorías de Hábitos
          </h1>
          <p style={{ fontSize: '14px', color: '#7d8590' }}>Organiza tus hábitos por tipo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          backgroundColor: '#238636', color: '#fff',
          border: '1px solid #3fb950', borderRadius: '8px',
          padding: '9px 16px', fontSize: '13px', fontWeight: '600',
          cursor: 'pointer',
        }}>
          {showForm ? '✕ Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {/* Mensajes */}
      {successMsg && (
        <div style={{ backgroundColor: '#0f2a1a', border: '1px solid #3fb950', borderRadius: '8px', padding: '12px 16px', color: '#3fb950', fontSize: '13px', marginBottom: '16px' }}>
          {successMsg}
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: '#1f1117', border: '1px solid #f85149', borderRadius: '8px', padding: '12px 16px', color: '#f85149', fontSize: '13px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #2dd4bf', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e6edf3', marginBottom: '16px' }}>Nueva Categoría</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#7d8590', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                NOMBRE *
              </label>
              <input
                style={inputStyle}
                placeholder="ej: Hidratación"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#7d8590', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                DESCRIPCIÓN
              </label>
              <input
                style={inputStyle}
                placeholder="ej: Control del consumo de agua diario"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  backgroundColor: '#238636', color: '#fff', border: '1px solid #3fb950',
                  borderRadius: '8px', padding: '9px 20px', fontSize: '13px',
                  fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => setShowForm(false)} style={{
                backgroundColor: 'transparent', color: '#7d8590',
                border: '1px solid #30363d', borderRadius: '8px',
                padding: '9px 20px', fontSize: '13px', cursor: 'pointer',
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7d8590', fontSize: '14px' }}>
          ⏳ Cargando categorías...
        </div>
      )}

      {/* Empty */}
      {!loading && !error && categorias.length === 0 && (
        <div style={{
          backgroundColor: '#161b22', border: '1px dashed #30363d',
          borderRadius: '12px', padding: '60px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏷️</div>
          <div style={{ color: '#7d8590', fontSize: '14px' }}>No hay categorías creadas aún.</div>
        </div>
      )}

      {/* Grid de categorías */}
      {!loading && categorias.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {categorias.map((cat) => (
            <div key={cat.id} style={{
              backgroundColor: '#161b22', border: '1px solid #30363d',
              borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{getIcon(cat.nombre)}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#e6edf3', marginBottom: '4px' }}>{cat.nombre}</div>
              {cat.descripcion && (
                <div style={{ fontSize: '12px', color: '#7d8590', lineHeight: 1.5 }}>{cat.descripcion}</div>
              )}
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#30363d' }}>
                ID #{cat.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

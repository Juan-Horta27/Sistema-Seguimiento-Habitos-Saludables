'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/services/api';

interface Habito {
  id: number; nombre: string; descripcion?: string;
  createdAt: string;
  categoriaHabito: { id: number; nombre: string };
  usuario: { id: number; nombres: string; apellidos: string };
  _count: { registros: number; metas: number };
}

export default function HabitoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [habito, setHabito] = useState<Habito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/habitos/${id}`)
      .then(r => r.json())
      .then(res => {
        setHabito(res.data);
        setForm({ nombre: res.data.nombre, descripcion: res.data.descripcion ?? '' });
        setLoading(false);
      })
      .catch(() => { setError('No se pudo cargar el hábito'); setLoading(false); });
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API_URL}/habitos/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, descripcion: form.descripcion || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message?.[0] ?? 'Error al actualizar'); }
      else { setHabito(data.data); setEditing(false); }
    } catch { setError('Error de conexión'); }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', backgroundColor: '#0d1117',
    border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#7d8590' }}>⏳ Cargando...</div>;
  if (!habito) return <div style={{ color: '#f85149' }}>Hábito no encontrado</div>;

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: '#7d8590', marginBottom: '20px' }}>
        <Link href="/habitos" style={{ color: '#58a6ff', textDecoration: 'none' }}>← Hábitos</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{habito.nombre}</span>
      </div>

      {error && <div style={{ backgroundColor: '#1f1117', border: '1px solid #f85149', borderRadius: '8px', padding: '12px 16px', color: '#f85149', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}

      {/* Card detalle */}
      <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            {editing ? (
              <input style={{ ...inputStyle, fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}
                value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            ) : (
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#e6edf3', marginBottom: '4px' }}>🌱 {habito.nombre}</h1>
            )}
            {editing ? (
              <input style={inputStyle} placeholder="Descripción opcional"
                value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            ) : (
              <p style={{ fontSize: '14px', color: '#7d8590' }}>{habito.descripcion ?? 'Sin descripción'}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {editing ? (
              <>
                <button onClick={handleUpdate} disabled={saving} style={{ backgroundColor: '#238636', color: '#fff', border: '1px solid #3fb950', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setEditing(false)} style={{ backgroundColor: 'transparent', color: '#7d8590', border: '1px solid #30363d', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>Cancelar</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} style={{ backgroundColor: 'transparent', color: '#58a6ff', border: '1px solid #30363d', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>✏️ Editar</button>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { label: 'Categoría', value: habito.categoriaHabito.nombre },
            { label: 'Usuario', value: `${habito.usuario.nombres} ${habito.usuario.apellidos}` },
            { label: 'Registros diarios', value: habito._count.registros },
            { label: 'Metas', value: habito._count.metas },
          ].map(item => (
            <div key={item.label} style={{ backgroundColor: '#21262d', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#7d8590', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#e6edf3' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href={`/metas?habitoId=${habito.id}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: '#161b22', color: '#3fb950', textDecoration: 'none',
          border: '1px solid #30363d', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '500',
        }}>🎯 Ver Metas</Link>
        <Link href="/habitos" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: '#161b22', color: '#7d8590', textDecoration: 'none',
          border: '1px solid #30363d', borderRadius: '8px', padding: '9px 16px', fontSize: '13px',
        }}>← Volver</Link>
      </div>
    </div>
  );
}

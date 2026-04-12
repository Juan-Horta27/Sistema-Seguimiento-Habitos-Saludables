'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  edad?: number;
  peso?: number;
  estatura?: number;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/usuarios')
      .then((r) => r.json())
      .then((res) => { setUsuarios(res.data ?? []); setLoading(false); })
      .catch(() => { setError('No se pudo conectar al backend'); setLoading(false); });
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            👥 Usuarios
          </h1>
          <p style={{ fontSize: '14px', color: '#7d8590' }}>Listado de usuarios registrados en el sistema</p>
        </div>
        <Link href="/auth/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: '#238636', color: '#fff', textDecoration: 'none',
          padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
          border: '1px solid #3fb950',
        }}>
          + Nuevo Usuario
        </Link>
      </div>

      {/* Estado */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7d8590', fontSize: '14px' }}>
          ⏳ Cargando usuarios...
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#1f1117', border: '1px solid #f85149',
          borderRadius: '8px', padding: '16px 20px',
          color: '#f85149', fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && usuarios.length === 0 && (
        <div style={{
          backgroundColor: '#161b22', border: '1px dashed #30363d',
          borderRadius: '12px', padding: '60px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
          <div style={{ color: '#7d8590', fontSize: '14px' }}>No hay usuarios registrados aún.</div>
          <Link href="/auth/register" style={{ color: '#2dd4bf', fontSize: '13px', marginTop: '8px', display: 'inline-block' }}>
            Registrar el primero →
          </Link>
        </div>
      )}

      {!loading && !error && usuarios.length > 0 && (
        <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#21262d', borderBottom: '1px solid #30363d' }}>
                {['ID', 'Nombre', 'Correo', 'Edad', 'Peso', 'Estatura'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '11px', fontWeight: '600', color: '#7d8590',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: i < usuarios.length - 1 ? '1px solid #21262d' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#21262d'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7d8590', fontFamily: 'monospace' }}>#{u.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#e6edf3' }}>
                    {u.nombres} {u.apellidos}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>{u.correo}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>{u.edad ?? '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>{u.peso ? `${u.peso} kg` : '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7d8590' }}>{u.estatura ? `${u.estatura} m` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '10px 16px', borderTop: '1px solid #30363d', fontSize: '12px', color: '#7d8590' }}>
            {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} en total
          </div>
        </div>
      )}
    </div>
  );
}

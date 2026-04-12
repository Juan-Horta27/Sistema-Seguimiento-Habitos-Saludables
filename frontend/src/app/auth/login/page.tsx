'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    backgroundColor: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3', fontSize: '14px',
    outline: 'none', transition: 'border-color 0.2s',
  };

  const handleSubmit = async () => {
    if (!form.correo || !form.contrasena) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message?.[0] ?? 'Credenciales incorrectas');
      } else {
        localStorage.setItem('token', data.data.token);
        router.push('/');
      }
    } catch {
      setError('Error de conexión con el servidor');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', paddingTop: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          🔐 Iniciar Sesión
        </h1>
        <p style={{ fontSize: '14px', color: '#7d8590' }}>
          Accede con tu correo y contraseña
        </p>
      </div>

      <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '28px' }}>
        {error && (
          <div style={{
            backgroundColor: '#1f1117', border: '1px solid #f85149', borderRadius: '8px',
            padding: '11px 14px', color: '#f85149', fontSize: '13px', marginBottom: '20px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#7d8590', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              CORREO
            </label>
            <input
              type="email"
              style={inputStyle}
              placeholder="tu@correo.com"
              value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#7d8590', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              style={inputStyle}
              placeholder="••••••••"
              value={form.contrasena}
              onChange={e => setForm({ ...form, contrasena: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: '#238636', color: '#fff',
              border: '1px solid #3fb950', borderRadius: '8px',
              padding: '11px', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1, marginTop: '4px',
              width: '100%',
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #30363d', textAlign: 'center', fontSize: '13px', color: '#7d8590' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" style={{ color: '#2dd4bf', fontWeight: '600', textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

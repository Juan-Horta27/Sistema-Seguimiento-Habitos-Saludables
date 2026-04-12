'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombres: '', apellidos: '', correo: '',
    contrasena: '', edad: '', peso: '', estatura: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    backgroundColor: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none',
  };

  const labelStyle = {
    fontSize: '12px', color: '#7d8590', fontWeight: '600' as const,
    display: 'block' as const, marginBottom: '6px',
  };

  const handleSubmit = async () => {
    if (!form.nombres || !form.apellidos || !form.correo || !form.contrasena) {
      setError('Nombres, apellidos, correo y contraseña son obligatorios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body: any = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        contrasena: form.contrasena,
      };
      if (form.edad) body.edad = parseInt(form.edad);
      if (form.peso) body.peso = parseFloat(form.peso);
      if (form.estatura) body.estatura = parseFloat(form.estatura);

      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message?.[0] ?? 'Error al registrar');
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
    <div style={{ maxWidth: '480px', margin: '0 auto', paddingTop: '20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#e6edf3', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          📝 Crear Cuenta
        </h1>
        <p style={{ fontSize: '14px', color: '#7d8590' }}>
          Completa tu información para registrarte
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Nombres y apellidos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>NOMBRES *</label>
              <input style={inputStyle} placeholder="Juan" value={form.nombres}
                onChange={e => setForm({ ...form, nombres: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>APELLIDOS *</label>
              <input style={inputStyle} placeholder="Pérez" value={form.apellidos}
                onChange={e => setForm({ ...form, apellidos: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>CORREO *</label>
            <input type="email" style={inputStyle} placeholder="tu@correo.com" value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>CONTRASEÑA * (mínimo 6 caracteres)</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={form.contrasena}
              onChange={e => setForm({ ...form, contrasena: e.target.value })} />
          </div>

          {/* Datos opcionales */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid #21262d' }}>
            <div style={{ fontSize: '11px', color: '#7d8590', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Datos opcionales
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>EDAD</label>
                <input type="number" style={inputStyle} placeholder="25" value={form.edad}
                  onChange={e => setForm({ ...form, edad: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>PESO (kg)</label>
                <input type="number" style={inputStyle} placeholder="70" value={form.peso}
                  onChange={e => setForm({ ...form, peso: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>ESTATURA (m)</label>
                <input type="number" step="0.01" style={inputStyle} placeholder="1.75" value={form.estatura}
                  onChange={e => setForm({ ...form, estatura: e.target.value })} />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: '#238636', color: '#fff',
              border: '1px solid #3fb950', borderRadius: '8px',
              padding: '11px', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1, marginTop: '4px', width: '100%',
            }}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #30363d', textAlign: 'center', fontSize: '13px', color: '#7d8590' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" style={{ color: '#2dd4bf', fontWeight: '600', textDecoration: 'none' }}>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombres: '', apellidos: '', correo: '', contrasena: '',
    edad: '', peso: '', estatura: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (!form.nombres || !form.correo || !form.contrasena) {
      setError('Nombres, correo y contraseña son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const body: any = {
        nombres: form.nombres,
        apellidos: form.apellidos || 'Sin apellido',
        correo: form.correo,
        contrasena: form.contrasena,
      };
      if (form.edad) body.edad = parseInt(form.edad);
      if (form.peso) body.peso = parseFloat(form.peso);
      if (form.estatura) body.estatura = parseFloat(form.estatura);

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const raw = data.message ?? data.error ?? 'Error al registrar';
        const msg = Array.isArray(raw) ? raw[0] : raw;
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        return;
      }
      setSuccess('¡Cuenta creada correctamente! Redirigiendo...');
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch {
      setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', background: '#0D1117', border: '1px solid #30363D',
    borderRadius: '8px', padding: '10px 14px', color: '#E6EDF3',
    fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 14, padding: '36px 32px', width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌱</div>
          <h1 style={{ color: '#E6EDF3', fontSize: 22, fontWeight: 700, margin: 0 }}>Crear cuenta</h1>
          <p style={{ color: '#8B949E', fontSize: 14, margin: '6px 0 0' }}>Sistema de Seguimiento de Hábitos</p>
        </div>

        {error && (
          <div style={{ background: '#3D1A1A', border: '1px solid #F85149', borderRadius: 8, padding: '10px 14px', color: '#F85149', marginBottom: 18, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#162017', border: '1px solid #3FB950', borderRadius: 8, padding: '10px 14px', color: '#3FB950', marginBottom: 18, fontSize: 14 }}>
            ✅ {success}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 6 }}>Nombres *</label>
              <input type="text" placeholder="Juan José" value={form.nombres}
                onChange={e => setForm({ ...form, nombres: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 6 }}>Apellidos</label>
              <input type="text" placeholder="Horta Vanegas" value={form.apellidos}
                onChange={e => setForm({ ...form, apellidos: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inp} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 6 }}>Correo electrónico *</label>
            <input type="email" placeholder="juan@correo.com" value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 6 }}>Contraseña * (mín. 6 caracteres)</label>
            <input type="password" placeholder="••••••••" value={form.contrasena}
              onChange={e => setForm({ ...form, contrasena: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inp} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { key: 'edad', label: 'Edad', placeholder: '25', type: 'number' },
              { key: 'peso', label: 'Peso (kg)', placeholder: '70', type: 'number' },
              { key: 'estatura', label: 'Estatura (m)', placeholder: '1.75', type: 'number' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label style={{ display: 'block', color: '#8B949E', fontSize: 12, marginBottom: 6 }}>{label}</label>
                <input type={type} step="any" placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} style={inp} />
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            background: loading ? '#21262D' : '#2DD4BF',
            color: loading ? '#8B949E' : '#0D1117',
            border: 'none', borderRadius: 8, padding: '12px',
            fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 4, transition: 'all 0.2s',
          }}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </div>

        <p style={{ color: '#8B949E', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" style={{ color: '#2DD4BF', textDecoration: 'none' }}>Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

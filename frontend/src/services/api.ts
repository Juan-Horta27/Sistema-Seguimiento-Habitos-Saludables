export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch(path: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok) {
    const raw = json.message ?? json.error ?? 'Error en la solicitud';
    throw new Error(Array.isArray(raw) ? raw[0] : raw);
  }
  return json.data;
}

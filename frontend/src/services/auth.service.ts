import { apiFetch } from './api';

export const authService = {
  register: (data: {
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    edad?: number;
    peso?: number;
    estatura?: number;
  }) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { correo: string; contrasena: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

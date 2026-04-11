import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Seguimiento de Hábitos Saludables',
  description: 'Registra y haz seguimiento de tus hábitos diarios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-teal-600 text-white px-6 py-4 shadow">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-xl font-bold">🌿 Hábitos Saludables</span>
            <div className="flex gap-6 text-sm font-medium">
              <a href="/" className="hover:underline">Inicio</a>
              <a href="/usuarios" className="hover:underline">Usuarios</a>
              <a href="/categorias" className="hover:underline">Categorías</a>
              <a href="/auth/login" className="hover:underline">Login</a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

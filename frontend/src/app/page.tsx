export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-teal-700 mb-4">
        🌿 Sistema de Seguimiento de Hábitos Saludables
      </h1>
      <p className="text-gray-500 mb-10 text-lg">
        Registra, mide y mejora tus hábitos diarios
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <a href="/auth/register"
          className="bg-teal-600 text-white rounded-xl p-6 hover:bg-teal-700 transition">
          <div className="text-3xl mb-2">👤</div>
          <div className="font-semibold">Registrarse</div>
        </a>
        <a href="/usuarios"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow transition">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold text-gray-700">Usuarios</div>
        </a>
        <a href="/categorias"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow transition">
          <div className="text-3xl mb-2">🗂️</div>
          <div className="font-semibold text-gray-700">Categorías</div>
        </a>
      </div>
    </div>
  );
}

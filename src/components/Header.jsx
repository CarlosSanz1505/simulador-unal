

const Header = () => {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-zinc-50 border-b border-gray-200">
      <h1 className="text-xl font-bold text-slate-900">Simulador UNAL</h1>
      <button
        className="px-4 py-2 text-slate-900 bg-zinc-50 rounded hover:bg-red-700 transition"
        onClick={() => alert("Cerrar sesión")}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Header;
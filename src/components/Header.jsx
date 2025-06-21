

const Header = () => {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
      <h2 className="text-lg text-zinc-500">Mis Simulaciones</h2>
      <button
        className="px-4 py-2 text-slate-900 border border-slate-900 rounded hover:bg-lime-100 transition"
        onClick={() => alert("Cerrar sesión")}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Header;
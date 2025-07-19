function AsignaturaDetalleModal({ open, asignatura, onClose }) {
  if (!open || !asignatura) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          title="Cerrar"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h2 className="text-lg font-semibold mb-2">{asignatura.nombre}</h2>
        <div className="mb-2 text-sm text-gray-700">
          <strong>Código:</strong> {asignatura.codigo}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <strong>Créditos:</strong> {asignatura.creditos}
        </div>
        {asignatura.descripcion && (
          <div className="mb-2 text-sm text-gray-700">
            <strong>Descripción:</strong> {asignatura.descripcion}
          </div>
        )}
        {asignatura.tipologia && (
          <div className="mb-2 text-sm text-gray-700">
            <strong>Tipología:</strong> {asignatura.tipologia.replace(/_/g, ' ')}
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignaturaDetalleModal;
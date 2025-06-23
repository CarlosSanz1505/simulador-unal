import iconoCancelar from '../../assets/iconos/cancelar.svg'

function PrerequisitosModal({ isOpen, onClose, prerequisitosFaltantes }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-red-800">
              No puedes inscribir esta asignatura
            </h3>
            <button 
              className="text-red-400 hover:text-red-600 transition-colors"
              onClick={onClose}
            >
              <img src={iconoCancelar} alt="Cerrar" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            No cumples con los siguientes prerrequisitos:
          </p>
          
          <div className="space-y-3 mb-6">
            {prerequisitosFaltantes.map((prereq, index) => (
              <div 
                key={index}
                className="bg-red-100 border border-red-200 rounded-lg p-3 flex items-center"
              >
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                  !
                </div>
                <div>
                  <p className="font-semibold text-red-800">{prereq.nombre} ({prereq.codigo})</p>
                  {prereq.porcentaje && (
                    <p className="text-sm text-red-600">
                      {prereq.porcentaje}% Avanzado
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrerequisitosModal

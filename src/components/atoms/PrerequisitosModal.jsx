import iconoCancelar from '../../assets/iconos/cancelar.svg'

function PrerequisitosModal({ isOpen, onClose, prerequisitosFaltantes }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-amber-800">
              ⚠️ Advertencia: Prerrequisitos pendientes
            </h3>
            <button 
              className="text-amber-400 hover:text-amber-600 transition-colors"
              onClick={onClose}
            >
              <img src={iconoCancelar} alt="Cerrar" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            <strong>La asignatura se ha agregado correctamente</strong>, pero recomendamos que completes primero estos prerrequisitos:
          </p>
          
          <p className="text-sm text-gray-600 mb-4">
            Esto no te impide agregarla ahora para planificar, pero es importante que conozcas los prerrequisitos requeridos.
          </p>
          
          <div className="space-y-3 mb-6">
            {prerequisitosFaltantes.map((prereq, index) => (
              <div 
                key={index}
                className="bg-amber-100 border border-amber-200 rounded-lg p-3 flex items-center"
              >
                <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                  !
                </div>
                <div>
                  <p className="font-semibold text-amber-800">{prereq.nombre} ({prereq.codigo})</p>
                  <p className="text-sm text-amber-600">
                    {prereq.creditos} créditos
                  </p>
                  {prereq.porcentaje && (
                    <p className="text-sm text-amber-600">
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
            className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrerequisitosModal

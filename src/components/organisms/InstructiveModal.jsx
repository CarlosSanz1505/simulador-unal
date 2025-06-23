import { useEffect, useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import bloquesSimulacion from '../../assets/images/bloques-simulacion.jpg'

function InstructiveModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Mostrar siempre después de iniciar sesión
    setShowModal(true)
  }, [])

  const handleClose = () => {
    setShowModal(false)
  }

  const handleContinue = () => {
    handleClose()
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Botón de cerrar en la esquina superior derecha */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none transition-colors z-10"
          onClick={handleClose}
          title="Cerrar"
        >
          <img src={iconoCancelar} alt="Cerrar" className="w-6 h-6" />
        </button>
        
        {/* Contenido */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-unal-green-600 mb-4">¡Bienvenido!</h1>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">¿Cómo usar el simulador UNAL?</h2>
          
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            El simulador te permite planificar tu carrera creando diferentes matrículas y organizando tus asignaturas:
          </p>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-gray-800">
                  <strong>Crear una nueva simulación:</strong> Haz clic en el dropdown de "Mis Simulaciones" en la parte superior y selecciona "Nueva Simulación" para empezar a planificar tu carrera.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-gray-800 mb-4">
                  <strong>Agregar matrículas:</strong> Haz clic en "Agregar Nueva Matrícula" para crear los períodos académicos que planificarás.
                </p>
                <img 
                  src={bloquesSimulacion} 
                  alt="Ejemplo de bloques de simulación" 
                  className="w-full max-w-md rounded-lg shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Buscar y agregar asignaturas:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Usa el panel lateral "Buscar Asignaturas" para explorar materias</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Busca por nombre, código o filtra por tipología</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Las asignaturas están organizadas por colores según su tipología</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Selecciona las asignaturas que deseas agregar a tu matrícula</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Validación de prerrequisitos:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>El sistema verifica automáticamente los prerrequisitos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Si faltan prerrequisitos, aparecerá un modal informativo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Podrás ver qué asignaturas necesitas cursar primero</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Organiza tu plan académico:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Arrastra asignaturas entre diferentes matrículas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Elimina asignaturas con el botón "✕" en cada tarjeta</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Observa el contador de créditos en tiempo real</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Gestión de simulaciones:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Guarda tu simulación con un nombre personalizado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Descarga tus simulaciones como archivo JSON</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Importa simulaciones previamente guardadas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              className="bg-unal-green-600 hover:bg-unal-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
              onClick={handleContinue}
            >
              Continuar a la simulación →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructiveModal

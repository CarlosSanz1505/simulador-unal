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
          <h1 className="text-4xl font-bold text-center text-unal-blue-600 mb-4">¡Bienvenido!</h1>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">¿Cómo usar el simulador UNAL?</h2>
          
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            Una simulación vacía aparecerá de forma predeterminada al iniciar sesión. Si se desea:
          </p>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-gray-800">
                  Agregar una nueva simulación se debe dar clic en la barra desplegable de simulaciones 
                  en la parte superior y darle al botón de nueva simulación
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-gray-800 mb-4">
                  Agrega las matrículas que necesites al darle clic en el rectángulo verde con el ícono "+"
                </p>
                <img 
                  src={bloquesSimulacion} 
                  alt="Ejemplo de bloques de simulación" 
                  className="w-full max-w-md rounded-lg shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Agrega una asignatura:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Selecciona la matrícula</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Busca asignaturas por nombre, código o filtra por tipología/créditos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Marca las que desees</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Verifica prerrequisitos: Si una asignatura no cumple con sus prerrequisitos, el sistema te mostrará una alerta</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Organiza tu plan:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Arrastra asignaturas entre matrículas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Elimina asignaturas si ya no las deseas en la matrícula</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Carga o descarga tu simulación:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-blue-600">•</span>
                    <span>Usa las opciones de descarga y carga ubicados al lado del nombre, y en la lista</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              className="bg-unal-blue-600 hover:bg-unal-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
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

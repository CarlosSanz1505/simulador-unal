import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import bloquesSimulacion from '../../assets/images/bloques-simulacion.jpg'

function InstructiveModal({ showOnLoad = false, isOpen = false, onClose = () => {} }) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showOnLoad) {
      // Mostrar automáticamente al cargar (para la página principal)
      setShowModal(true)
    }
  }, [showOnLoad])

  useEffect(() => {
    // Controlar desde el componente padre
    setShowModal(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setShowModal(false)
    onClose()
  }

  const handleContinue = () => {
    handleClose()
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative mx-auto my-auto">
        {/* Botón de cerrar en la esquina superior derecha */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none transition-colors z-20"
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
            Esta herramienta te ayuda a planificar tu carrera universitaria de manera visual e intuitiva. Sigue estos pasos:
          </p>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Pantalla inicial - Gestión de simulaciones:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Al iniciar verás la pantalla principal con 3 planes de estudio de ejemplo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Puedes editar el nombre de cada simulación haciendo clic en el ícono de lápiz</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Elimina simulaciones que no necesites con el botón de eliminar (X)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Crea nuevas simulaciones con el botón "Nueva Simulación"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Descarga tus simulaciones como respaldo o compártelas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Importa simulaciones previamente guardadas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Acceder al planificador de tu carrera:</p>
                <div className="space-y-1 text-gray-700 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Haz clic en "Ver simulación" en cualquier plan para abrir el <strong>Panel de Planificación Académica</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Esta será tu área de trabajo principal donde organizarás tus semestres</span>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <img 
                    src={bloquesSimulacion} 
                    alt="Ejemplo de bloques de simulación" 
                    className="w-full max-w-xl rounded-lg shadow-sm mx-auto"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Entender el panel de créditos:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>En la parte superior verás <strong>tarjetas coloridas con barras de progreso</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Cada tarjeta representa un <strong>componente de tu carrera</strong> (Fundamentación, Disciplinar, etc.)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Las barras muestran cuántos créditos has completado vs. cuántos necesitas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Se actualizan automáticamente conforme agregas materias</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Buscar y agregar materias:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>En el lado izquierdo encontrarás el <strong>"Buscador de Asignaturas"</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Busca materias por nombre, código o filtra por tipo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Las materias están <strong>organizadas por colores</strong> según su componente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span><strong>Método 1:</strong> Arrastra cualquier materia directamente a una matrícula</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span><strong>Método 2:</strong> Selecciona varias materias y agrégalas a la matrícula activa</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span><strong>¡Importante!</strong> El sistema verificará automáticamente los prerequisitos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Organizar tus matrículas (semestres):</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Cada <strong>tarjeta de matrícula</strong> representa un semestre de estudio</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Cambia el nombre de cualquier matrícula haciendo clic en el ícono de lápiz</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Elimina materias de una matrícula con el botón X en cada materia</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Arrastra materias entre diferentes matrículas para reorganizar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Agrega más matrículas con el botón "+" para planificar más semestres</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Observa cómo las barras de progreso se actualizan en tiempo real</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Validación automática de prerequisitos:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>El sistema <strong>revisa automáticamente</strong> si puedes tomar una materia</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Si faltan prerequisitos, aparecerá una <strong>ventana informativa</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Te mostrará exactamente qué materias necesitas aprobar primero</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Esto te ayuda a planificar el orden correcto de tus materias</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-unal-green-600 text-white rounded-full flex items-center justify-center font-bold">
                7
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">Guardar y gestionar tu trabajo:</p>
                <div className="space-y-1 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Guarda tu simulación con un <strong>nombre personalizado</strong> que te ayude a identificarla</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Descarga tus simulaciones como <strong>archivo de respaldo</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Importa simulaciones previamente guardadas para continuar trabajando</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-unal-green-600">•</span>
                    <span>Comparte tus planificaciones con compañeros o asesores académicos</span>
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
              ¡Comenzar a planificar mi carrera! →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

InstructiveModal.propTypes = {
  showOnLoad: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}

export default InstructiveModal

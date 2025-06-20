import { useEffect, useState } from 'react'
import Modal from '../atoms/Modal'

function InstructiveModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Verificar si es la primera visita
    const firstVisit = localStorage.getItem('simulador-first-visit')
    if (!firstVisit) {
      setShowModal(true)
    }
  }, [])

  const handleClose = () => {
    setShowModal(false)
    localStorage.setItem('simulador-first-visit', 'false')
  }

  return (
    <Modal 
      isOpen={showModal} 
      onClose={handleClose}
      title="¡Bienvenido al Simulador UNAL! 🎓"
    >
      <div className="text-sm">
        <p className="mb-4 text-gray-600">
          Te ayudamos a planificar tu trayecto académico paso a paso:
        </p>
        
        <div className="mb-6">
          <div className="mb-3">
            <span className="font-semibold text-green-600">1.</span>
            <span className="ml-2">Crea simulaciones para diferentes planes de estudio</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-green-600">2.</span>
            <span className="ml-2">Organiza asignaturas por matrículas (semestres)</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-green-600">3.</span>
            <span className="ml-2">Valida prerrequisitos automáticamente</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-green-600">4.</span>
            <span className="ml-2">Controla tus créditos por tipología</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-green-600">5.</span>
            <span className="ml-2">Exporta/importa tus simulaciones</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-center text-gray-600 text-sm">
            💡 <strong>Tip:</strong> Puedes crear múltiples simulaciones para comparar diferentes rutas académicas
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleClose}
          style={{width: '100%'}}
        >
          ¡Entendido, comenzar!
        </button>
      </div>
    </Modal>
  )
}

export default InstructiveModal

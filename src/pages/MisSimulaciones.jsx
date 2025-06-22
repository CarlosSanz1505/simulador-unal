import { useState } from 'react'
import iconoAgregar from '../assets/iconos/agregar.svg'
import iconoImportar from '../assets/iconos/importar.svg'
import Button from '../components/atoms/Button'
import ConfirmModal from '../components/atoms/ConfirmModal'
import Modal from '../components/atoms/Modal'
import SimulationCard from '../components/molecules/SimulationCard'
import { simulacionesEjemplo } from '../data/mockData'

function MisSimulaciones() {
  const [simulaciones, setSimulaciones] = useState(simulacionesEjemplo)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [simulacionToDelete, setSimulacionToDelete] = useState(null)
  const [showNewSimulationModal, setShowNewSimulationModal] = useState(false)
  const [newSimulationName, setNewSimulationName] = useState('')

  const eliminarSimulacion = (id) => {
    const simulacion = simulaciones.find(sim => sim.id === id)
    setSimulacionToDelete(simulacion)
    setShowConfirmModal(true)
  }

  const confirmarEliminacion = () => {
    if (simulacionToDelete) {
      setSimulaciones(simulaciones.filter(sim => sim.id !== simulacionToDelete.id))
      setSimulacionToDelete(null)
    }
  }

  const cancelarEliminacion = () => {
    setShowConfirmModal(false)
    setSimulacionToDelete(null)
  }

  const editarSimulacion = (id, nuevoNombre) => {
    setSimulaciones(simulaciones.map(sim => 
      sim.id === id ? { ...sim, nombre: nuevoNombre } : sim
    ))
  }

  const importarSimulacion = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const simulacion = JSON.parse(e.target.result)
            simulacion.id = Date.now().toString()
            setSimulaciones([...simulaciones, simulacion])
          } catch (error) {
            alert('Error al importar la simulación')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const crearNuevaSimulacion = () => {
    setNewSimulationName('')
    setShowNewSimulationModal(true)
  }

  const confirmarNuevaSimulacion = () => {
    if (newSimulationName && newSimulationName.trim()) {
      const nuevaSimulacion = {
        id: Date.now().toString(),
        nombre: newSimulationName.trim(),
        fechaCreacion: new Date().toISOString().split('T')[0],
        matriculas: [],
        creditos: {
          fundamentacionObligatoria: 0,
          fundamentacionOptativa: 0,
          disciplinarObligatoria: 0,
          disciplinarOptativa: 0,
          libreEleccion: 0,
          total: 0
        }
      }
      setSimulaciones([...simulaciones, nuevaSimulacion])
      setShowNewSimulationModal(false)
      setNewSimulationName('')
    }
  }

  const cancelarNuevaSimulacion = () => {
    setShowNewSimulationModal(false)
    setNewSimulationName('')
  }

  return (
    <div className="min-h-screen">
      {/* Contenido principal */}
      <main className="container py-8">
        {/* Contenedor centrado con fondo blanco como en el panel de matrículas */}
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header del panel */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Mis Simulaciones</h2>
            <div className="flex gap-3">
              <Button variant="primary" onClick={crearNuevaSimulacion}>
                <img src={iconoAgregar} alt="Nueva" className="w-5 h-5" />
                <span>Nueva</span>
              </Button>
              <Button variant="secondary" onClick={importarSimulacion}>
                <img src={iconoImportar} alt="Importar" className="w-5 h-5" />
                <span>Importar</span>
              </Button>
            </div>
          </div>

          {/* Contenido del panel */}
          <div className="p-6">
            {/* Lista de simulaciones */}
            {simulaciones.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎓</div>
                <h3 className="text-xl font-semibold mb-2">No tienes simulaciones</h3>
                <p className="mb-6">Crea tu primera simulación para comenzar a planificar tu carrera</p>
                <Button variant="primary" onClick={crearNuevaSimulacion}>
                  <img src={iconoAgregar} alt="Crear" className="w-5 h-5" />
                  <span>Crear mi primera simulación</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {simulaciones.map((simulacion) => (
                  <SimulationCard 
                    key={simulacion.id}
                    simulacion={simulacion}
                    onDelete={eliminarSimulacion}
                    onEdit={editarSimulacion}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de confirmación para eliminar simulación */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={cancelarEliminacion}
        onConfirm={confirmarEliminacion}
        title="¿Estás seguro de eliminar esta simulación?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Modal para crear nueva simulación */}
      <Modal
        isOpen={showNewSimulationModal}
        onClose={cancelarNuevaSimulacion}
        title="Nueva Simulación"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="simulationName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la simulación
            </label>
            <input
              id="simulationName"
              type="text"
              value={newSimulationName}
              onChange={(e) => setNewSimulationName(e.target.value)}
              placeholder="Ej: Plan Principal, Plan Alternativo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unal-green-500 focus:border-transparent"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  confirmarNuevaSimulacion()
                }
              }}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={cancelarNuevaSimulacion}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmarNuevaSimulacion}
              disabled={!newSimulationName.trim()}
              className="flex-1"
            >
              Crear Simulación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MisSimulaciones

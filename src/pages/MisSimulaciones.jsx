import { useState } from 'react'
import Button from '../components/atoms/Button'
import ConfirmModal from '../components/atoms/ConfirmModal'
import Modal from '../components/atoms/Modal'
import SimulationCard from '../components/molecules/SimulationCard'
import InstructiveModal from '../components/organisms/InstructiveModal'
import { simulacionesEjemplo } from '../data/mockData'
import { faPlus, faUpload, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    const nombreNormalizado = nuevoNombre.trim().toLowerCase()
    const yaExiste = simulaciones.some(sim => 
      sim.id !== id && sim.nombre.trim().toLowerCase() === nombreNormalizado
    )

    if (yaExiste) {
      alert('Ya existe una simulación con ese nombre.')
      return
    }

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
    const nombreLimpio = newSimulationName.trim()

    // Si está vacío, generar nombre automático
    let nombreFinal = nombreLimpio
    if (!nombreFinal) {
      let contador = 1
      while (simulaciones.some(sim => sim.nombre.toLowerCase() === `simulación ${contador}`)) {
        contador++
      }
      nombreFinal = `Simulación ${contador}`
    }

    const yaExiste = simulaciones.some(sim => sim.nombre.trim().toLowerCase() === nombreFinal.toLowerCase())
    if (yaExiste) {
      alert('Ya existe una simulación con ese nombre.')
      return
    }

    const nuevaSimulacion = {
      id: Date.now().toString(),
      nombre: nombreFinal,
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

  const cancelarNuevaSimulacion = () => {
    setShowNewSimulationModal(false)
    setNewSimulationName('')
  }

  return (
    <>
      <main className="container py-8 mx-auto">
        {/* Contenedor centrado con fondo blanco como en el panel de matrículas */}
        <div className="max-w-5xl w-[90%] sm:w-auto mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header del panel */}
          <div className="bg-gray-50 px-6 py-4 border-b flex flex-col gap-[10px] sm:flex-row items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Mis Simulaciones</h2>
            <div className="flex gap-3">
              <Button variant="primary" onClick={crearNuevaSimulacion}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <span>Nueva</span>
              </Button>
              <Button variant="secondary" onClick={importarSimulacion}>
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                <span>Importar</span>
              </Button>
            </div>
          </div>

          <div className="p-6">
            {simulaciones.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-unal-green-600 mb-2" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tienes simulaciones</h3>
                <p className="mb-6">Crea tu primera simulación para comenzar a planificar tu carrera</p>
                <Button variant="primary" onClick={crearNuevaSimulacion}>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
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

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={cancelarEliminacion}
        onConfirm={confirmarEliminacion}
        title="¿Estás seguro de eliminar esta simulación?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

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
                if (e.key === 'Enter') confirmarNuevaSimulacion()
              }}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={cancelarNuevaSimulacion} className="flex-1">
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmarNuevaSimulacion} className="flex-1">
              Crear Simulación
            </Button>
          </div>
        </div>
      </Modal>

      <InstructiveModal showOnLoad={true} />
    </>
  )
}

export default MisSimulaciones

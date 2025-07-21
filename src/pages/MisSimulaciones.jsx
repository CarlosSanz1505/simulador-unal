import { faGraduationCap, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Button from '../components/atoms/Button';
import ConfirmModal from '../components/atoms/ConfirmModal';
import Modal from '../components/atoms/Modal';
import SimulationCard from '../components/molecules/SimulationCard';
import InstructiveModal from '../components/organisms/InstructiveModal';
import { createSimulacion, deleteSimulacion, getSimulaciones, updateSimulacion } from '../data/services/simulaciones';

function MisSimulaciones() {
  const [simulaciones, setSimulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [simulacionToDelete, setSimulacionToDelete] = useState(null)
  const [showNewSimulationModal, setShowNewSimulationModal] = useState(false)
  const [newSimulationName, setNewSimulationName] = useState('')

  // Fetch simulaciones
  useEffect(() => {
    let userId = localStorage.getItem('usuario');
    
    // Para desarrollo, crear usuario si no existe
    if (!userId) {
      userId = 'dev-user-' + Date.now();
      localStorage.setItem('usuario', userId);
      console.log('Usuario temporal creado:', userId);
    }

    console.log('Iniciando carga de simulaciones...');
    getSimulaciones(userId).then(async (data) => {
      console.log('Simulaciones obtenidas del servidor:', data);
      setSimulaciones(data);
      setLoading(false);
    }).catch(error => {
      console.error('Error cargando simulaciones:', error);
      setLoading(false);
    });
  }, []);

  const eliminarSimulacion = (id) => {
    setSimulacionToDelete(id)
    setShowConfirmModal(true)
  }

  const confirmarEliminacion = async () => {
    if (simulacionToDelete) {
      try {
        await deleteSimulacion(simulacionToDelete)
        setSimulaciones(simulaciones.filter(sim => sim.id !== simulacionToDelete))
        setSimulacionToDelete(null)
      } catch (error) {
        alert(`Error al eliminar la simulación: ${error.message}`);
      }
    }
  }

  const cancelarEliminacion = () => {
    setShowConfirmModal(false)
    setSimulacionToDelete(null)
  }

  const editarSimulacion = async (id, nuevoNombre) => {
    const nombreNormalizado = nuevoNombre.trim().toLowerCase()
    const yaExiste = simulaciones.some(sim =>
      sim.id !== id && sim.nombre.trim().toLowerCase() === nombreNormalizado
    )

    if (yaExiste) {
      alert('Ya existe una simulación con ese nombre.')
      return
    }

    try {
      const editada = await updateSimulacion(id, { nombre: nuevoNombre });
      setSimulaciones(simulaciones.map(sim =>
        sim.id === id ? editada : sim
      ))
    } catch (error) {
      alert(`Error al crear la simulación: ${error.message}`);
    }
  }

  const importarSimulacion = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const simulacion = JSON.parse(e.target.result)
            // Eliminar ID existente para que el backend genere uno nuevo
            delete simulacion.id;
            simulacion.usuario = localStorage.getItem('usuario'); // Asignar usuario actual
            const creada = await createSimulacion(simulacion);
            setSimulaciones([...simulaciones, creada]);
          } catch (error) {
            alert('Error al importar la simulación. Asegúrate de que el archivo sea un JSON válido.')
            console.error('Error al importar simulación:', error)
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

  const confirmarNuevaSimulacion = async () => {
    let nombreFinal = newSimulationName.trim()
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
      nombre: nombreFinal,
      fechaCreacion: new Date().toISOString().split('T')[0],
      usuario: localStorage.getItem('usuario'),
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

    try {
      const creada = await createSimulacion(nuevaSimulacion)
      setSimulaciones([...simulaciones, creada])
      setShowNewSimulationModal(false)
      setNewSimulationName('')
    } catch (error) {
      alert(`Error al crear la simulación: ${error.message}`);
    }
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-unal-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </div>
            ) : simulaciones.length === 0 ? (
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
          <div className="flex gap-3 pt-4 justify-end w-1/2 ml-auto">
            <Button variant="primary" onClick={confirmarNuevaSimulacion}>
              Guardar
            </Button>
            <Button variant="secondary" onClick={cancelarNuevaSimulacion}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <InstructiveModal showOnLoad={true} />
    </>
  )
}

export default MisSimulaciones

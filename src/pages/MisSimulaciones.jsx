import { useState } from 'react'
import Button from '../components/atoms/Button'
import SimulationCard from '../components/molecules/SimulationCard'
import { simulacionesEjemplo } from '../data/mockData'

function MisSimulaciones() {
  const [simulaciones, setSimulaciones] = useState(simulacionesEjemplo)

  const eliminarSimulacion = (id) => {
    if (confirm('¿Estás seguro de eliminar esta simulación?')) {
      setSimulaciones(simulaciones.filter(sim => sim.id !== id))
    }
  }

  const crearNuevaSimulacion = () => {
    const nombre = prompt('Nombre de la nueva simulación:')
    if (nombre && nombre.trim()) {
      const nuevaSimulacion = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
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
    }
  }

  return (
    <div>
      {/* Contenido principal */}
      <main className="container py-8">
        <div className="flex-between mb-6">
          <h2 className="text-2xl font-bold">Mis Simulaciones</h2>
          <div className="flex" style={{gap: '12px'}}>
            <Button variant="primary" onClick={crearNuevaSimulacion}>
              <span>➕</span>
              <span>Nueva</span>
            </Button>
            <Button variant="secondary">
              <span>📥</span>
              <span>Importar</span>
            </Button>
          </div>
        </div>

        {/* Lista de simulaciones */}
        {simulaciones.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <h3 className="text-xl font-semibold mb-2">No tienes simulaciones</h3>
            <p className="mb-6">Crea tu primera simulación para comenzar a planificar tu carrera</p>
            <Button variant="primary" onClick={crearNuevaSimulacion}>
              <span>➕</span>
              <span>Crear mi primera simulación</span>
            </Button>
          </div>
        ) : (
          <div className="grid md-grid-cols-2 lg-grid-cols-3">
            {simulaciones.map((simulacion) => (
              <SimulationCard 
                key={simulacion.id}
                simulacion={simulacion}
                onDelete={eliminarSimulacion}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MisSimulaciones

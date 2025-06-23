import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/atoms/Button'
import CreditCounter from '../components/molecules/CreditCounter'
import MatriculaColumn from '../components/molecules/MatriculaColumn'
import { simulacionesEjemplo } from '../data/mockData'

function SimulacionDetalle() {
  const { id } = useParams()
  const [simulacion, setSimulacion] = useState(
    simulacionesEjemplo.find(sim => sim.id === id) || simulacionesEjemplo[0]
  )
  const [matriculaActiva, setMatriculaActiva] = useState(null)

  const crearMatricula = () => {
    const nuevaMatricula = {
      id: `m${Date.now()}`,
      posicion: simulacion.matriculas.length + 1,
      asignaturas: []
    }
    
    setSimulacion({
      ...simulacion,
      matriculas: [...simulacion.matriculas, nuevaMatricula]
    })
  }

  const eliminarMatricula = (matriculaId) => {
    if (confirm('¿Estás seguro de eliminar esta matrícula?')) {
      setSimulacion({
        ...simulacion,
        matriculas: simulacion.matriculas.filter(m => m.id !== matriculaId)
      })
    }
  }

  const editarNombre = () => {
    const nuevoNombre = prompt('Nuevo nombre de la simulación:', simulacion.nombre)
    if (nuevoNombre && nuevoNombre.trim()) {
      setSimulacion({
        ...simulacion,
        nombre: nuevoNombre.trim()
      })
    }
  }

  return (
    <div>
      {/* Contenido principal */}
      <main className="container py-8">
        {/* Información de la simulación */}
        <div className="flex-between mb-6">
          <div className="flex" style={{alignItems: 'center', gap: '16px'}}>
            <Link to="/" className="btn" style={{textDecoration: 'none'}}>
              ← Volver
            </Link>
            <h1 className="text-xl font-semibold">{simulacion.nombre}</h1>
          </div>
          <div className="flex" style={{gap: '12px'}}>
            <button className="btn" onClick={editarNombre}>✏️ Editar</button>
            <button className="btn btn-secondary">📥 Descargar</button>
          </div>
        </div>
        {/* Panel de créditos */}
        <div className="credit-grid">
          <CreditCounter 
            label="Fund. Obligatoria" 
            value={simulacion.creditos.fundamentacionObligatoria} 
          />
          <CreditCounter 
            label="Fund. Optativa" 
            value={simulacion.creditos.fundamentacionOptativa} 
          />
          <CreditCounter 
            label="Disciplinar Obligatoria" 
            value={simulacion.creditos.disciplinarObligatoria} 
          />
          <CreditCounter 
            label="Disciplinar Optativa" 
            value={simulacion.creditos.disciplinarOptativa} 
          />
          <CreditCounter 
            label="Libre Elección" 
            value={simulacion.creditos.libreEleccion} 
          />
          <CreditCounter 
            label="TOTAL" 
            value={simulacion.creditos.total} 
            isTotal={true}
          />
        </div>

        {/* Grid de matrículas */}
        <div className="flex-between mb-4">
          <h3 className="text-xl font-semibold">Matrículas</h3>
          <Button 
            variant="primary"
            onClick={crearMatricula}
          >
            ➕ Nueva Matrícula
          </Button>
        </div>

        <div className="grid s-grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-3">
          {simulacion.matriculas.map((matricula) => (
            <div
              key={matricula.id}
              onClick={() => setMatriculaActiva(matricula.id)}
              style={{cursor: 'pointer'}}
            >
              <MatriculaColumn
                matricula={matricula}
                onDelete={eliminarMatricula}
                isActive={matriculaActiva === matricula.id}
              />
            </div>
          ))}
        </div>

        {simulacion.matriculas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No tienes matrículas creadas</p>
            <Button 
              variant="primary"
              onClick={crearMatricula}
            >
              ➕ Crear tu primera matrícula
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default SimulacionDetalle

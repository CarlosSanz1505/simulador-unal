import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/atoms/Button'
import CreditCounter from '../components/molecules/CreditCounter'
import MatriculaColumn from '../components/molecules/MatriculaColumn'
import AsignaturasPanel from '../components/organisms/AsignaturasPanel'
import { simulacionesEjemplo } from '../data/mockData'

function SimulacionDetalle() {
  const { id } = useParams()
  const [simulacion, setSimulacion] = useState(
    simulacionesEjemplo.find(sim => sim.id === id) || simulacionesEjemplo[0]
  )
  const [matriculaActiva, setMatriculaActiva] = useState(null)
  
  // Establecer la primera matrícula como activa por defecto si existe
  useEffect(() => {
    if (simulacion.matriculas.length > 0 && !matriculaActiva) {
      setMatriculaActiva(simulacion.matriculas[0].id)
    }
  }, [simulacion.matriculas, matriculaActiva])

  const crearMatricula = () => {
    const nuevaMatricula = {
      id: `m${Date.now()}`,
      posicion: simulacion.matriculas.length + 1,
      asignaturas: []
    }
    
    const nuevaSimulacion = {
      ...simulacion,
      matriculas: [...simulacion.matriculas, nuevaMatricula]
    }
    
    setSimulacion(nuevaSimulacion)
    setMatriculaActiva(nuevaMatricula.id) // Activar la nueva matrícula automáticamente
  }

  const eliminarMatricula = (matriculaId) => {
    if (confirm('¿Estás seguro de eliminar esta matrícula?')) {
      setSimulacion({
        ...simulacion,
        matriculas: simulacion.matriculas.filter(m => m.id !== matriculaId)
      })
      if (matriculaActiva === matriculaId) {
        setMatriculaActiva(null)
      }
    }
  }

  const agregarAsignaturaAMatricula = (matriculaId, asignatura) => {
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          // Verificar si la asignatura ya está en esta matrícula
          const yaExiste = matricula.asignaturas.some(a => a.codigo === asignatura.codigo)
          if (yaExiste) {
            alert('Esta asignatura ya está en la matrícula')
            return matricula
          }
          
          return {
            ...matricula,
            asignaturas: [...matricula.asignaturas, asignatura]
          }
        }
        return matricula
      })
    }))
  }

  const removerAsignaturaDeMatricula = (matriculaId, asignaturaId) => {
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          return {
            ...matricula,
            asignaturas: matricula.asignaturas.filter(a => a.codigo !== asignaturaId)
          }
        }
        return matricula
      })
    }))
  }

  const calcularCreditos = () => {
    const creditos = {
      fundamentacionObligatoria: 0,
      fundamentacionOptativa: 0,
      disciplinarObligatoria: 0,
      disciplinarOptativa: 0,
      libreEleccion: 0,
      total: 0
    }

    simulacion.matriculas.forEach(matricula => {
      matricula.asignaturas.forEach(asignatura => {
        switch (asignatura.tipologia) {
          case 'fundamentacion_obligatoria':
            creditos.fundamentacionObligatoria += asignatura.creditos
            break
          case 'fundamentacion_optativa':
            creditos.fundamentacionOptativa += asignatura.creditos
            break
          case 'disciplinar_obligatoria':
            creditos.disciplinarObligatoria += asignatura.creditos
            break
          case 'disciplinar_optativa':
            creditos.disciplinarOptativa += asignatura.creditos
            break
          case 'libre_eleccion':
            creditos.libreEleccion += asignatura.creditos
            break
        }
        creditos.total += asignatura.creditos
      })
    })

    return creditos
  }

  const creditosActuales = calcularCreditos()

  const editarNombre = () => {
    const nuevoNombre = prompt('Nuevo nombre de la simulación:', simulacion.nombre)
    if (nuevoNombre && nuevoNombre.trim()) {
      setSimulacion({
        ...simulacion,
        nombre: nuevoNombre.trim()
      })
    }
  }

  const handleSelectAsignaturas = (asignaturasSeleccionadas) => {
    if (matriculaActiva && asignaturasSeleccionadas.length > 0) {
      asignaturasSeleccionadas.forEach(asignatura => {
        agregarAsignaturaAMatricula(matriculaActiva, asignatura)
      })
    }
  }

  return (
    <div className="simulacion-detalle-container">
      {/* Contenido principal */}
      <main className="simulacion-main">
        <div className="simulacion-content">
          {/* Información de la simulación */}
          <div className="flex-between mb-6">
            <div className="flex" style={{alignItems: 'center', gap: '16px'}}>
              <Link to="/" className="btn" style={{textDecoration: 'none'}}>
                ← Mis Simulaciones
              </Link>
              <h1 className="text-xl font-semibold">{simulacion.nombre}</h1>
              <button className="btn-icon" onClick={editarNombre} title="Editar nombre">
                ✏️
              </button>
              <button className="btn-icon" title="Descargar simulación">
                📥
              </button>
            </div>
          </div>

          {/* Panel de créditos */}
          <div className="credit-grid">
            <CreditCounter 
              label="Fund. Obligatoria" 
              value={creditosActuales.fundamentacionObligatoria}
              total={32}
            />
            <CreditCounter 
              label="Fund. Optativa" 
              value={creditosActuales.fundamentacionOptativa}
              total={32}
            />
            <CreditCounter 
              label="Disciplinar Obligatoria" 
              value={creditosActuales.disciplinarObligatoria}
              total={32}
            />
            <CreditCounter 
              label="Disciplinar Optativa" 
              value={creditosActuales.disciplinarOptativa}
              total={32}
            />
            <CreditCounter 
              label="Libre Elección" 
              value={creditosActuales.libreEleccion}
              total={32}
            />
            <CreditCounter 
              label="TOTAL" 
              value={creditosActuales.total}
              total={160}
              isTotal={true}
            />
          </div>

          {/* Grid de matrículas */}
          <div className="matriculas-grid">
            {simulacion.matriculas.map((matricula) => (
              <div 
                key={matricula.id}
                onClick={() => setMatriculaActiva(matricula.id)}
                style={{cursor: 'pointer'}}
              >
                <MatriculaColumn
                  matricula={matricula}
                  onDelete={eliminarMatricula}
                  onAddAsignatura={agregarAsignaturaAMatricula}
                  onRemoveAsignatura={removerAsignaturaDeMatricula}
                  isActive={matriculaActiva === matricula.id}
                />
              </div>
            ))}
            
            {/* Botón Nueva Matrícula */}
            <div className="nueva-matricula-card" onClick={crearMatricula}>
              <div className="nueva-matricula-content">
                <div className="nueva-matricula-icon">+</div>
                <div className="nueva-matricula-text">Nueva Matrícula</div>
              </div>
            </div>
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

          {matriculaActiva && simulacion.matriculas.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                ✨ Matrícula {simulacion.matriculas.find(m => m.id === matriculaActiva)?.posicion} seleccionada. 
                Puedes arrastrar asignaturas desde el panel lateral o seleccionarlas y hacer clic en "Guardar".
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Panel de asignaturas (siempre visible) */}
      <AsignaturasPanel
        onSelectAsignaturas={handleSelectAsignaturas}
        onClose={() => {}} // No se puede cerrar en esta vista
        selectedAsignaturas={[]}
        matriculaActiva={matriculaActiva}
      />
    </div>
  )
}

export default SimulacionDetalle

import { faDownload, faEdit, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/atoms/Button'
import ConfirmModal from '../components/atoms/ConfirmModal'
import PrerequisitosModal from '../components/atoms/PrerequisitosModal'
import MatriculaColumn from '../components/molecules/MatriculaColumn'
import AsignaturasPanel from '../components/organisms/AsignaturasPanel'
import CreditosPanel from '../components/organisms/CreditosPanel'
import AsignaturasService from '../data/asignaturasService'
import { simulacionesEjemplo } from '../data/mockData'

function SimulacionDetalle() {
  const { id } = useParams()
  const [simulacion, setSimulacion] = useState(
    simulacionesEjemplo.find(sim => sim.id === id) || simulacionesEjemplo[0]
  )
  const [matriculaActiva, setMatriculaActiva] = useState(null)
  const [showPanel, setShowPanel] = useState(false) // Panel cerrado por defecto para móvil
  const [confirmModal, setConfirmModal] = useState({ show: false, matriculaId: null })
  const [showPrerequisitosModal, setShowPrerequisitosModal] = useState(false)
  const [prerequisitosFaltantes, setPrerrequisitosFaltantes] = useState([])
  
  // Detectar si es desktop o móvil
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Establecer la primera matrícula como activa por defecto si existe
  useEffect(() => {
    if (simulacion.matriculas.length > 0 && !matriculaActiva) {
      setMatriculaActiva(simulacion.matriculas[0].id)
    }
  }, [simulacion.matriculas, matriculaActiva])

  // Abrir panel automáticamente en desktop cuando hay matrícula activa
  useEffect(() => {
    if (matriculaActiva) {
      if (isDesktop) {
        setShowPanel(true) // Abrir automáticamente en desktop
      }
      // En móvil no abrir automáticamente
    }
  }, [matriculaActiva, isDesktop])

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
    setConfirmModal({ show: true, matriculaId })
  }

  const confirmarEliminarMatricula = () => {
    const { matriculaId } = confirmModal
    setSimulacion({
      ...simulacion,
      matriculas: simulacion.matriculas.filter(m => m.id !== matriculaId)
    })
    if (matriculaActiva === matriculaId) {
      setMatriculaActiva(null)
      setShowPanel(false)
    }
    setConfirmModal({ show: false, matriculaId: null })
  }

  const editarNombreMatricula = (matriculaId, nuevoNombre) => {
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(m => 
        m.id === matriculaId 
          ? { ...m, nombre: nuevoNombre }
          : m
      )
    }))
  }

  const agregarAsignaturaAMatricula = (matriculaId, asignatura) => {
    console.log('Intentando agregar asignatura:', asignatura.nombre, 'a matrícula:', matriculaId)
    
    // VALIDACIÓN DE PRERREQUISITOS PARA DRAG & DROP
    if (asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0) {
      console.log('Verificando prerrequisitos:', asignatura.prerrequisitos)
      
      // Encontrar la matrícula de destino
      const matriculaDestino = simulacion.matriculas.find(m => m.id === matriculaId);
      
      if (matriculaDestino) {
        // Obtener asignaturas aprobadas hasta la matrícula anterior
        const asignaturasAprobadas = simulacion.matriculas
          .filter(m => m.posicion <= matriculaDestino.posicion)
          .flatMap(m => m.asignaturas.map(a => a.codigo));
        
        console.log('Asignaturas aprobadas hasta ahora:', asignaturasAprobadas)
        
        // Verificar prerrequisitos faltantes
        const prerequisitosFaltantes = asignatura.prerrequisitos.filter(prereqCodigo => 
          !asignaturasAprobadas.includes(prereqCodigo)
        );
        
        console.log('Prerrequisitos faltantes:', prerequisitosFaltantes)
        
        if (prerequisitosFaltantes.length > 0) {          
          // Obtener información de los prerrequisitos faltantes usando el servicio
          const prerequisitosInfo = prerequisitosFaltantes.map(codigo => {
            const asignaturaInfo = AsignaturasService.getAsignaturaPorCodigo(codigo);
            
            return asignaturaInfo ? {
              codigo: asignaturaInfo.codigo,
              nombre: asignaturaInfo.nombre,
              creditos: asignaturaInfo.creditos
            } : { codigo, nombre: 'Asignatura no encontrada', creditos: 0 }
          });
          
          console.log('Bloqueando asignatura por prerrequisitos faltantes')
          setPrerrequisitosFaltantes(prerequisitosInfo);
          setShowPrerequisitosModal(true);
          
          return; // No agregar la asignatura
        }
      }
    }
    
    console.log('Agregando asignatura sin problemas de prerrequisitos')
    
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          // Verificar si la asignatura ya existe
          const yaExiste = matricula.asignaturas.some(a => a.codigo === asignatura.codigo);
          console.log('Asignatura ya existe:', yaExiste)
          if (!yaExiste) {
            console.log('Asignatura agregada exitosamente')
            return {
              ...matricula,
              asignaturas: [...matricula.asignaturas, asignatura]
            };
          } else {
            console.log('Asignatura ya existe, no se agrega')
          }
        }
        return matricula;
      })
    }));
  }

  const removerAsignaturaDeMatricula = (matriculaId, asignaturaCodigo) => {
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          return {
            ...matricula,
            asignaturas: matricula.asignaturas.filter(a => a.codigo !== asignaturaCodigo)
          }
        }
        return matricula
      })
    }))
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

  const handleSelectAsignaturas = (asignaturasSeleccionadas) => {
    if (matriculaActiva && asignaturasSeleccionadas.length > 0) {
      // Agregar cada asignatura seleccionada a la matrícula activa
      asignaturasSeleccionadas.forEach(asignatura => {
        agregarAsignaturaAMatricula(matriculaActiva, asignatura)
      })
    }
  }

  // Nueva función para mover asignaturas entre matrículas
  const moverAsignatura = (sourceMatriculaId, targetMatriculaId, asignatura) => {
    if (sourceMatriculaId === targetMatriculaId) return // No mover si es la misma matrícula
    
    // VALIDACIÓN DE PRERREQUISITOS PARA MOVER ENTRE MATRÍCULAS
    if (asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0) {
      
      // Encontrar la matrícula de destino
      const matriculaDestino = simulacion.matriculas.find(m => m.id === targetMatriculaId);
      
      if (matriculaDestino) {
        // Obtener asignaturas aprobadas hasta la matrícula anterior (incluyendo la actual menos la que se está moviendo)
        const asignaturasAprobadas = simulacion.matriculas
          .filter(m => m.posicion <= matriculaDestino.posicion)
          .flatMap(m => m.asignaturas
            .filter(a => !(a.codigo === asignatura.codigo && m.id === sourceMatriculaId)) // Excluir la asignatura que se está moviendo
            .map(a => a.codigo)
          );
        
        // Verificar prerrequisitos faltantes
        const prerequisitosFaltantes = asignatura.prerrequisitos.filter(prereqCodigo => 
          !asignaturasAprobadas.includes(prereqCodigo)
        );
        
        if (prerequisitosFaltantes.length > 0) {          
          // Obtener información de los prerrequisitos faltantes usando el servicio
          const prerequisitosInfo = prerequisitosFaltantes.map(codigo => {
            const asignaturaInfo = AsignaturasService.getAsignaturaPorCodigo(codigo);
            
            return asignaturaInfo ? {
              codigo: asignaturaInfo.codigo,
              nombre: asignaturaInfo.nombre,
              creditos: asignaturaInfo.creditos
            } : { codigo, nombre: 'Asignatura no encontrada', creditos: 0 }
          });
          
          setPrerrequisitosFaltantes(prerequisitosInfo);
          setShowPrerequisitosModal(true);
          
          return; // No mover la asignatura
        }
      }
    }
    
    // Si no hay problemas con prerrequisitos, proceder con el movimiento
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === sourceMatriculaId) {
          // Remover de la matrícula origen
          return {
            ...matricula,
            asignaturas: matricula.asignaturas.filter(a => a.codigo !== asignatura.codigo)
          }
        } else if (matricula.id === targetMatriculaId) {
          // Agregar a la matrícula destino (verificar si ya existe)
          const yaExiste = matricula.asignaturas.some(a => a.codigo === asignatura.codigo)
          if (!yaExiste) {
            return {
              ...matricula,
              asignaturas: [...matricula.asignaturas, asignatura]
            }
          }
        }
        return matricula
      })
    }))
  }

  // Nueva función para reordenar asignaturas dentro de una matrícula
  const reordenarAsignaturas = (matriculaId, fromIndex, toIndex) => {
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          const nuevasAsignaturas = [...matricula.asignaturas]
          const [asignaturaMovida] = nuevasAsignaturas.splice(fromIndex, 1)
          nuevasAsignaturas.splice(toIndex, 0, asignaturaMovida)
          
          return {
            ...matricula,
            asignaturas: nuevasAsignaturas
          }
        }
        return matricula
      })
    }))
  }

  // Nueva función para cambiar el color de una asignatura
  const cambiarColorAsignatura = (matriculaId, asignaturaCodigo, nuevoColor) => {
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          return {
            ...matricula,
            asignaturas: matricula.asignaturas.map(asignatura => {
              if (asignatura.codigo === asignaturaCodigo) {
                return {
                  ...asignatura,
                  customColor: nuevoColor
                }
              }
              return asignatura
            })
          }
        }
        return matricula
      })
    }))
  }

  return (
    <div className="min-h-screen m-auto">
      {/* Contenido principal */}
      <main className={`container py-8 transition-all duration-300`}>
        {/* Contenedor  */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header de la simulación */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <Link 
              to="/simulaciones/" 
              className="btn btn-secondary text-sm"
            >
              ← Volver
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800">{simulacion.nombre}</h1>
              <button 
                className="p-2 text-gray-400 hover:text-unal-green-600 hover:bg-unal-green-50 rounded-lg transition-colors" 
                onClick={editarNombre} 
                title="Editar nombre"
              >
                <FontAwesomeIcon icon={faEdit}/>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {matriculaActiva && isDesktop && (
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className="p-2 text-unal-green-600 hover:bg-unal-green-100 rounded-lg transition-colors" 
                  title="Buscar asignaturas"
                >
                  <FontAwesomeIcon icon={faSearch}/>
                </button>
              )}
              <button 
                className="p-2 text-unal-green-600 hover:bg-unal-green-100 rounded-lg transition-colors" 
                title="Descargar simulación"
              >
                <FontAwesomeIcon icon={faDownload}/>
              </button>
              
            </div>
          </div>

          {/* Panel de créditos */}
          <CreditosPanel simulacion={simulacion} />

          {/* Grid de matrículas */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Matrículas</h3>
            </div>

            <div className="border-[2px] border-solid border-gray
            flex gap-[20px] p-[20px] max-h-[500px] overflow-x-auto">
              {simulacion.matriculas.map((matricula) => (
                <div 
                  key={matricula.id}
                  onClick={() => setMatriculaActiva(matricula.id)}
                  className="cursor-pointer"
                >
                  <MatriculaColumn
                    matricula={matricula}
                    onDelete={eliminarMatricula}
                    onEditName={editarNombreMatricula}
                    onAddAsignatura={agregarAsignaturaAMatricula}
                    onRemoveAsignatura={removerAsignaturaDeMatricula}
                    onMoveAsignatura={moverAsignatura}
                    onReorderAsignaturas={reordenarAsignaturas}
                    onChangeAsignaturaColor={cambiarColorAsignatura}
                    isActive={matriculaActiva === matricula.id}
                  />
                </div>
              ))}
              
              {/* Tarjeta para agregar nueva matrícula */}
              <div 
                onClick={crearMatricula}
                className="cursor-pointer group"
              >
                <div className="w-[300px] bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 h-full min-h-[300px] flex flex-col items-center justify-center hover:border-unal-green-400 hover:bg-unal-green-50 transition-colors">
                  <div className="text-center">
                    <div className="text-4xl text-gray-400 group-hover:text-unal-green-500 mb-4 transition-colors">
                      +
                    </div>
                    <h4 className="font-semibold text-gray-600 group-hover:text-unal-green-700 mb-2 transition-colors">
                      Agregar Nueva Matrícula
                    </h4>
                    <p className="text-sm text-gray-500 group-hover:text-unal-green-600 transition-colors">
                      Haz clic para crear una nueva matrícula
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {simulacion.matriculas.length === 0 && (
              <div className="empty-state">
                <FontAwesomeIcon icon={faEdit} className="w-5 h-5 mr-2" />
                <h3 className="text-xl font-semibold mb-2">No tienes matrículas creadas</h3>
                <p className="mb-6">Crea tu primera matrícula para comenzar a planificar tu carrera</p>
                <Button 
                  variant="primary"
                  onClick={crearMatricula}
                >
                  <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
                  Crear tu primera matrícula
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Panel de asignaturas lateral */}
      {matriculaActiva && (
        <AsignaturasPanel 
          matriculaId={matriculaActiva}
          matriculaActiva={matriculaActiva}
          simulacion={simulacion}
          onClose={() => {
            if (isDesktop) {
              setShowPanel(false) // En desktop solo cerrar panel
            } else {
              setMatriculaActiva(null) // En móvil cerrar todo
              setShowPanel(false)
            }
          }}
          onSelectAsignaturas={handleSelectAsignaturas}
          selectedAsignaturas={simulacion.matriculas.find(m => m.id === matriculaActiva)?.asignaturas || []}
          todasLasAsignaturas={simulacion.matriculas.flatMap(m => m.asignaturas)}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          isDesktop={isDesktop}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, matriculaId: null })}
        onConfirm={confirmarEliminarMatricula}
        title="Eliminar Matrícula"
        message="¿Estás seguro de que deseas eliminar esta matrícula? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Modal de prerrequisitos para drag & drop */}
      <PrerequisitosModal
        isOpen={showPrerequisitosModal}
        onClose={() => setShowPrerequisitosModal(false)}
        prerequisitosFaltantes={prerequisitosFaltantes}
      />

      {/* Botón hamburguesa flotante para móvil - altura del header del panel */}
      {!isDesktop && matriculaActiva && (
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="fixed top-[75px] right-3 z-50 p-2 rounded-full shadow-lg transition-colors"
          style={{ 
            backgroundColor: '#57844A',
            color: 'white'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4a6d3e'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#57844A'}
          title={showPanel ? "Cerrar panel de asignaturas" : "Abrir panel de asignaturas"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SimulacionDetalle

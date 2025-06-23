import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import iconoAgregar from '../assets/iconos/agregar.svg'
import iconoEditar from '../assets/iconos/editar.svg'
import iconoExportar from '../assets/iconos/exportar.svg'
import Button from '../components/atoms/Button'
import ConfirmModal from '../components/atoms/ConfirmModal'
import PrerequisitosModal from '../components/atoms/PrerequisitosModal'
import CreditCounter from '../components/molecules/CreditCounter'
import MatriculaColumn from '../components/molecules/MatriculaColumn'
import AsignaturasPanel from '../components/organisms/AsignaturasPanel'

function SimulacionDetalle() {
  const { id } = useParams()
  
  // Obtener simulación desde localStorage
  const obtenerSimulacionPorId = (simulacionId) => {
    const simulacionesGuardadas = localStorage.getItem('simulaciones')
    if (simulacionesGuardadas) {
      try {
        const simulaciones = JSON.parse(simulacionesGuardadas)
        return simulaciones.find(sim => sim.id === simulacionId)
      } catch (error) {
        console.error('Error al cargar simulaciones:', error)
      }
    }
    return null
  }

  const [simulacion, setSimulacion] = useState(() => {
    const simulacionEncontrada = obtenerSimulacionPorId(id)
    return simulacionEncontrada || null
  })
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

  // Actualizar localStorage cuando la simulación cambie
  useEffect(() => {
    if (simulacion) {
      const simulacionesGuardadas = localStorage.getItem('simulaciones')
      if (simulacionesGuardadas) {
        try {
          const simulaciones = JSON.parse(simulacionesGuardadas)
          const simulacionesActualizadas = simulaciones.map(sim => 
            sim.id === simulacion.id ? simulacion : sim
          )
          localStorage.setItem('simulaciones', JSON.stringify(simulacionesActualizadas))
        } catch (error) {
          console.error('Error al actualizar simulaciones:', error)
        }
      }
    }
  }, [simulacion])

  // Si no se encuentra la simulación, mostrar mensaje o redirigir
  if (!simulacion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Simulación no encontrada</h2>
          <Link to="/misimulacion" className="text-blue-600 hover:text-blue-800">
            Volver a mis simulaciones
          </Link>
        </div>
      </div>
    )
  }

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
    // VALIDACIÓN DE PRERREQUISITOS PARA DRAG & DROP
    if (asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0) {
      console.log('🔍 [DRAG&DROP] Validando prerrequisitos para:', asignatura.nombre)
      
      // Encontrar la matrícula de destino
      const matriculaDestino = simulacion.matriculas.find(m => m.id === matriculaId)
      
      if (matriculaDestino) {
        // Obtener asignaturas aprobadas hasta la matrícula anterior
        const asignaturasAprobadas = simulacion.matriculas
          .filter(m => m.posicion < matriculaDestino.posicion)
          .flatMap(m => m.asignaturas.map(a => a.codigo))
        
        console.log('🔍 [DRAG&DROP] Asignaturas ya aprobadas:', asignaturasAprobadas)
        console.log('🔍 [DRAG&DROP] Prerrequisitos requeridos:', asignatura.prerrequisitos)
        
        // Verificar prerrequisitos faltantes
        const prerequisitosFaltantes = asignatura.prerrequisitos.filter(prereqCodigo => 
          !asignaturasAprobadas.includes(prereqCodigo)
        )
        
        if (prerequisitosFaltantes.length > 0) {
          console.log('⚠️ [DRAG&DROP] Prerrequisitos no cumplidos, mostrando advertencia (pero se permite agregar)')
          
          // Obtener información de los prerrequisitos faltantes
          import('../data/asignaturas.json').then(({ asignaturas }) => {
            const prerequisitosInfo = prerequisitosFaltantes.map(codigo => {
              const asignaturaInfo = asignaturas.find(a => a.codigo === codigo)
              return asignaturaInfo ? {
                codigo: asignaturaInfo.codigo,
                nombre: asignaturaInfo.nombre,
                creditos: asignaturaInfo.creditos
              } : { codigo, nombre: 'Asignatura no encontrada', creditos: 0 }
            })
            
            setPrerrequisitosFaltantes(prerequisitosInfo)
            setShowPrerequisitosModal(true)
          })
          
          // NO HACEMOS RETURN - PERMITIMOS QUE CONTINÚE Y AGREGUE LA ASIGNATURA
        }
      }
    }
    
    // Agregar la asignatura (ahora se ejecuta siempre, sin importar los prerrequisitos)
    console.log('✅ [DRAG&DROP] Agregando asignatura:', asignatura.nombre)
    
    setSimulacion(prev => ({
      ...prev,
      matriculas: prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          // Verificar si la asignatura ya existe
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

  const moverAsignatura = (sourceMatriculaId, targetMatriculaId, asignatura, targetIndex) => {
    console.log('🔄 Moviendo asignatura:', { 
      asignatura: asignatura.nombre, 
      from: sourceMatriculaId, 
      to: targetMatriculaId, 
      index: targetIndex 
    })

    setSimulacion(prev => {
      let updatedMatriculas = [...prev.matriculas]
      
      // Si es el mismo target (reordenamiento dentro de la misma matrícula)
      if (sourceMatriculaId === targetMatriculaId) {
        const matriculaIndex = updatedMatriculas.findIndex(m => m.id === sourceMatriculaId)
        if (matriculaIndex !== -1) {
          const matricula = { ...updatedMatriculas[matriculaIndex] }
          const asignaturas = [...matricula.asignaturas]
          
          // Encontrar y remover la asignatura
          const sourceIndex = asignaturas.findIndex(a => a.codigo === asignatura.codigo)
          if (sourceIndex !== -1) {
            const [movedAsignatura] = asignaturas.splice(sourceIndex, 1)
            
            // Insertar en la nueva posición
            const finalIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
            asignaturas.splice(finalIndex, 0, movedAsignatura)
            
            matricula.asignaturas = asignaturas
            updatedMatriculas[matriculaIndex] = matricula
          }
        }
      } else {
        // Mover entre diferentes matrículas
        // 1. Remover de la matrícula origen
        updatedMatriculas = updatedMatriculas.map(matricula => {
          if (matricula.id === sourceMatriculaId) {
            return {
              ...matricula,
              asignaturas: matricula.asignaturas.filter(a => a.codigo !== asignatura.codigo)
            }
          }
          return matricula
        })
        
        // 2. Agregar a la matrícula destino en la posición especificada
        updatedMatriculas = updatedMatriculas.map(matricula => {
          if (matricula.id === targetMatriculaId) {
            const newAsignaturas = [...matricula.asignaturas]
            newAsignaturas.splice(targetIndex, 0, asignatura)
            return {
              ...matricula,
              asignaturas: newAsignaturas
            }
          }
          return matricula
        })
      }
      
      return {
        ...prev,
        matriculas: updatedMatriculas
      }
    })
  }

  const cambiarColorAsignatura = (matriculaId, asignaturaCodigo, colorOption) => {
    console.log('🎨 Cambiando color de asignatura:', { 
      matricula: matriculaId, 
      asignatura: asignaturaCodigo, 
      color: colorOption?.name || 'Por defecto' 
    })

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
                  customColor: colorOption // null para resetear, objeto para color personalizado
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

  const editarNombre = () => {
    const nuevoNombre = prompt('Nuevo nombre de la simulación:', simulacion.nombre)
    if (nuevoNombre && nuevoNombre.trim()) {
      setSimulacion({
        ...simulacion,
        nombre: nuevoNombre.trim()
      })
    }
  }

  const calcularCreditos = () => {
    // Límites máximos para cada tipología
    const limites = {
      fundamentacion_obligatoria: 27,
      fundamentacion_optativa: 16,
      disciplinar_obligatoria: 57,
      disciplinar_optativa: 22,
      libre_eleccion: 32,
      trabajo_de_grado: 6
    }

    const creditos = {
      fundamentacionObligatoria: 0,
      fundamentacionOptativa: 0,
      disciplinarObligatoria: 0,
      disciplinarOptativa: 0,
      libreEleccion: 0,
      trabajoGrado: 0,
      total: 0
    }

    // Calcular créditos basándose en las asignaturas de todas las matrículas
    simulacion.matriculas.forEach(matricula => {
      matricula.asignaturas.forEach(asignatura => {
        const creditosAsignatura = parseInt(asignatura.creditos) || 0
        
        switch (asignatura.tipologia) {
          case 'fundamentacion_obligatoria':
            creditos.fundamentacionObligatoria += creditosAsignatura
            break
          case 'fundamentacion_optativa':
            creditos.fundamentacionOptativa += creditosAsignatura
            break
          case 'disciplinar_obligatoria':
            creditos.disciplinarObligatoria += creditosAsignatura
            break
          case 'disciplinar_optativa':
            creditos.disciplinarOptativa += creditosAsignatura
            break
          case 'libre_eleccion':
            creditos.libreEleccion += creditosAsignatura
            break
          case 'trabajo_de_grado':
            creditos.trabajoGrado += creditosAsignatura
            break
        }
      })
    })

    // Calcular total aplicando límites máximos para cada tipología
    creditos.total = 
      Math.min(creditos.fundamentacionObligatoria, limites.fundamentacion_obligatoria) +
      Math.min(creditos.fundamentacionOptativa, limites.fundamentacion_optativa) +
      Math.min(creditos.disciplinarObligatoria, limites.disciplinar_obligatoria) +
      Math.min(creditos.disciplinarOptativa, limites.disciplinar_optativa) +
      Math.min(creditos.libreEleccion, limites.libre_eleccion) +
      Math.min(creditos.trabajoGrado, limites.trabajo_de_grado)

    return creditos
  }

  const creditosActuales = calcularCreditos()

  const handleSelectAsignaturas = (asignaturasSeleccionadas) => {
    if (matriculaActiva && asignaturasSeleccionadas.length > 0) {
      // Agregar cada asignatura seleccionada a la matrícula activa
      asignaturasSeleccionadas.forEach(asignatura => {
        agregarAsignaturaAMatricula(matriculaActiva, asignatura)
      })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Contenido principal */}
      <main className={`container py-8 transition-all duration-300 ${
        isDesktop && showPanel && matriculaActiva ? 'pr-80' : ''
      }`}>
        {/* Contenedor centrado más pequeño como en la imagen */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header de la simulación */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-800">{simulacion.nombre}</h1>
              <button 
                className="p-2 text-unal-green-600 hover:bg-unal-green-100 rounded-full transition-colors" 
                onClick={editarNombre} 
                title="Editar nombre"
              >
                <img src={iconoEditar} alt="Editar" className="w-9 h-9" />
              </button>
              <button 
                className="p-2 text-unal-green-600 hover:bg-unal-green-100 rounded-full transition-colors" 
                title="Descargar simulación"
              >
                <img src={iconoExportar} alt="Exportar" className="w-9 h-9" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Botón hamburguesa para abrir/cerrar panel - solo en desktop */}
              {matriculaActiva && isDesktop && (
                <button
                  onClick={() => setShowPanel(!showPanel)}
                  className="p-2 rounded-full transition-colors"
                  style={{
                    color: '#57844A'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdf4'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  title={showPanel ? "Cerrar panel de asignaturas" : "Abrir panel de asignaturas"}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              <Link 
                to="/misimulacion/" 
                className="btn btn-secondary text-sm"
              >
                ← Volver
              </Link>
            </div>
          </div>

          {/* Panel de créditos */}
          <div className="px-6 py-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Créditos Acumulados</h3>
            <div className="credit-grid">
              <CreditCounter 
                label="Fund. Obligatoria" 
                value={creditosActuales.fundamentacionObligatoria}
                total={27}
                tipologia="fundamentacion_obligatoria"
              />
              <CreditCounter 
                label="Fund. Optativa" 
                value={creditosActuales.fundamentacionOptativa}
                total={16}
                tipologia="fundamentacion_optativa"
              />
              <CreditCounter 
                label="Disciplinar Obligatoria" 
                value={creditosActuales.disciplinarObligatoria}
                total={57}
                tipologia="disciplinar_obligatoria"
              />
              <CreditCounter 
                label="Disciplinar Optativa" 
                value={creditosActuales.disciplinarOptativa}
                total={22}
                tipologia="disciplinar_optativa"
              />
              <CreditCounter 
                label="Libre Elección" 
                value={creditosActuales.libreEleccion}
                total={32}
                tipologia="libre_eleccion"
              />
              <CreditCounter 
                label="Trabajo de Grado" 
                value={creditosActuales.trabajoGrado || 0}
                total={6}
                tipologia="trabajo_grado"
              />
              <CreditCounter 
                label="TOTAL" 
                value={creditosActuales.total} 
                total={160}
                isTotal={true}
              />
            </div>
            
            {/* Mensaje especial de graduación */}
            {creditosActuales.total >= 160 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
                    <div className="text-4xl mb-4">
                      🎓🎉✨
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 mb-3">
                      ¡Felicitaciones, te graduaste! 🎊
                    </h2>
                    <p className="text-lg text-gray-700 mb-2 leading-relaxed">
                      Has completado exitosamente todos los créditos académicos de la 
                      <span className="font-semibold text-green-700"> Universidad Nacional de Colombia</span>, 
                      la mejor universidad del país 🏆
                    </p>
                    <p className="text-base text-gray-600 font-medium">
                      ¡Muchos éxitos en tu vida profesional y laboral! 🚀💼✨
                    </p>
                    <div className="mt-4 text-2xl">
                      🌟🎯💪
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grid de matrículas */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Matrículas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 h-full min-h-[300px] flex flex-col items-center justify-center hover:border-unal-green-400 hover:bg-unal-green-50 transition-colors">
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
                <div className="empty-state-icon">📝</div>
                <h3 className="text-xl font-semibold mb-2">No tienes matrículas creadas</h3>
                <p className="mb-6">Crea tu primera matrícula para comenzar a planificar tu carrera</p>
                <Button 
                  variant="primary"
                  onClick={crearMatricula}
                >
                  <img src={iconoAgregar} alt="Crear" className="w-5 h-5 mr-2" />
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

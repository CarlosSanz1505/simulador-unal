import { faDownload, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AsignaturaDetalleModal from '../components/atoms/AsignaturaDetalleModal'
import ConfirmModal from '../components/atoms/ConfirmModal'
import PrerequisitosModal from '../components/atoms/PrerequisitosModal'
import MatriculaColumn from '../components/molecules/MatriculaColumn'
import AsignaturasPanel from '../components/organisms/AsignaturasPanel'
import CreditosPanel from '../components/organisms/CreditosPanel'
import AsignaturasService from '../data/asignaturasService'
import { getSimulacion, updateSimulacion } from '../data/services/simulaciones'
import { getPrerequisitosFaltantes, recalcularErroresMatriculas } from '../utils/validarPrerrequisitos'

function SimulacionDetalle() {
  const { id } = useParams()
  const [simulacion, setSimulacion] = useState();
  const [loading, setLoading] = useState(true);
  const [matriculaActiva, setMatriculaActiva] = useState(null)
  const [showPanel, setShowPanel] = useState(false) // Panel cerrado por defecto para móvil
  const [confirmModal, setConfirmModal] = useState({ show: false, matriculaId: null })
  const [showPrerequisitosModal, setShowPrerequisitosModal] = useState(false)
  const [prerequisitosFaltantes, setPrerrequisitosFaltantes] = useState([])
  const [asignaturaDetalle, setAsignaturaDetalle] = useState({ open: false, asignatura: null });

  // Detectar si es desktop o móvil
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  useEffect(() => {
    getSimulacion(id).then(data => {
      setSimulacion(data);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching simulation:', error);
      setLoading(false);
    });
  }, [id]);

  // Establecer la primera matrícula como activa por defecto si existe
  useEffect(() => {
    if (simulacion?.matriculas.length > 0 && !matriculaActiva) {
      setMatriculaActiva(simulacion.matriculas[0].id)
    }
  }, [simulacion, matriculaActiva])

  // Abrir panel automáticamente en desktop cuando hay matrícula activa
  useEffect(() => {
    if (matriculaActiva) {
      if (isDesktop) {
        setShowPanel(true) // Abrir automáticamente en desktop
      }
      // En móvil no abrir automáticamente
    }
  }, [matriculaActiva, isDesktop])

  // Guardar automáticamente los cambios en la simulación
  useEffect(() => {
    if (simulacion && simulacion.id && !loading) {
      const saveSimulation = async () => {
        try {
          await updateSimulacion(simulacion.id, simulacion);
          console.log('Simulación guardada automáticamente');
        } catch (error) {
          console.error('Error guardando simulación:', error);
        }
      };

      // Debounce para evitar demasiadas llamadas al API
      const timeoutId = setTimeout(saveSimulation, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [simulacion, loading])

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

  const handleExport = (e) => {
    e.preventDefault()
    const dataStr = JSON.stringify(simulacion, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${simulacion.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
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

  const agregarAsignaturaAMatricula = (matriculaId, asignatura) => {
    // VALIDACIÓN DE PRERREQUISITOS PARA DRAG & DROP
    if (asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0) {
      // Encontrar la matrícula de destino
      const matriculaDestino = simulacion.matriculas.find(m => m.id === matriculaId);

      if (matriculaDestino) {
        // Obtener asignaturas aprobadas hasta las matrículas ANTERIORES (no incluye la actual)
        const asignaturasAprobadas = simulacion.matriculas
          .filter(m => m.posicion < matriculaDestino.posicion)
          .flatMap(m => m.asignaturas.map(a => a.codigo));

        // Verificar prerrequisitos faltantes
        const prerrequisitosFaltantes = asignatura.prerrequisitos.filter(prereqCodigo =>
          !asignaturasAprobadas.includes(prereqCodigo)
        );

        if (prerrequisitosFaltantes.length > 0) {
          // Obtener información de los prerrequisitos faltantes usando el servicio
          const prerrequisitosInfo = prerrequisitosFaltantes.map(codigo => {
            const asignaturaInfo = AsignaturasService.getAsignaturaPorCodigo(codigo);
            return asignaturaInfo
              ? { codigo: asignaturaInfo.codigo, nombre: asignaturaInfo.nombre, creditos: asignaturaInfo.creditos }
              : { codigo, nombre: 'Asignatura no encontrada', creditos: 0 }
          });

          setPrerrequisitosFaltantes(prerrequisitosInfo);
          setShowPrerequisitosModal(true);
          return; // No agregar la asignatura
        }
      }
    }

    setSimulacion(prev => {
      const nuevasMatriculas = prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          const yaExiste = matricula.asignaturas.some(a => a.codigo === asignatura.codigo);
          if (!yaExiste) {
            return {
              ...matricula,
              asignaturas: [...matricula.asignaturas, asignatura]
            };
          }
        }
        return matricula;
      });

      return {
        ...prev,
        matriculas: recalcularErroresMatriculas(nuevasMatriculas)
      }
    });
  };

  const removerAsignaturaDeMatricula = (matriculaId, asignaturaCodigo) => {
    setSimulacion(prev => {
      const nuevasMatriculas = prev.matriculas.map(matricula => {
        if (matricula.id === matriculaId) {
          return {
            ...matricula,
            asignaturas: matricula.asignaturas.filter(a => a.codigo !== asignaturaCodigo)
          }
        }
        return matricula;
      });

      return {
        ...prev,
        matriculas: recalcularErroresMatriculas(nuevasMatriculas)
      }
    });
  };

  const editarNombre = async () => {
    const nuevoNombre = prompt('Nuevo nombre de la simulación:', simulacion.nombre)
    if (nuevoNombre && nuevoNombre.trim()) {

      try {
        const editada = await updateSimulacion(id, { nombre: nuevoNombre });
        setSimulacion(editada);
      } catch (error) {
        alert(`Error al crear la simulación: ${error.message}`);
      }
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

  // Mover asignaturas entre matrículas
  const moverAsignatura = (sourceMatriculaId, targetMatriculaId, asignatura) => {
    if (sourceMatriculaId === targetMatriculaId) return; // No mover si es la misma matrícula

    const matriculaDestino = simulacion.matriculas.find(m => m.id === targetMatriculaId);

    if (matriculaDestino) {
      // Obtener asignaturas aprobadas hasta las matrículas ANTERIORES (excluyendo la matrícula destino)
      const asignaturasAprobadas = simulacion.matriculas
        .filter(m => m.posicion < matriculaDestino.posicion)
        .flatMap(m => m.asignaturas.map(a => a.codigo));

      const faltantes = getPrerequisitosFaltantes(asignatura, asignaturasAprobadas);
      if (faltantes.length > 0) {
        setPrerrequisitosFaltantes(faltantes);
        setShowPrerequisitosModal(true);
        return; // No mover la asignatura
      }
    }

    setSimulacion(prev => {
      const nuevasMatriculas = prev.matriculas.map(matricula => {
        if (matricula.id === sourceMatriculaId) {
          return {
            ...matricula,
            asignaturas: matricula.asignaturas.filter(a => a.codigo !== asignatura.codigo)
          }
        } else if (matricula.id === targetMatriculaId) {
          const yaExiste = matricula.asignaturas.some(a => a.codigo === asignatura.codigo)
          if (!yaExiste) {
            const asignaturaSinError = { ...asignatura }
            delete asignaturaSinError.error
            delete asignaturaSinError.faltantes
            return {
              ...matricula,
              asignaturas: [...matricula.asignaturas, asignaturaSinError]
            }
          }
        }
        return matricula
      })

      return {
        ...prev,
        matriculas: recalcularErroresMatriculas(nuevasMatriculas)
      }
    })
  }

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
    <div
      className="m-auto h-[calc(100vh-45px)]"
    >
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <svg className="animate-spin h-10 w-10 text-unal-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      ) : (
        <>
          {/* Contenido principal */}
          <main className="container py-8 transition-all duration-300">
            <div
              className={`w-[96vw] md:w-[94vw] lg:w-[92vw] max-w-7xl mx-auto bg-white
                      rounded-lg shadow-lg overflow-hidden
                      ${isDesktop && showPanel ? 'lg:mr-[384px]' : ''}`}
            >

              {/* Header de la simulación */}
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                <Link to="/simulaciones" className="btn btn-secondary text-sm hidden sm:inline">
                  ← Volver
                </Link>

                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-800">
                    {simulacion.nombre}
                  </h1>
                  <button
                    className="p-2 text-gray-400 hover:text-unal-green-600 hover:bg-unal-green-50 rounded-lg transition-colors"
                    onClick={editarNombre}
                    title="Editar nombre"
                    aria-label="Editar nombre de la simulación"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExport}
                    className="p-2 text-unal-green-600 hover:bg-unal-green-100 rounded-lg transition-colors"
                    title="Descargar simulación"
                    aria-label="Descargar simulación"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>

              {/* Panel de créditos */}
              <CreditosPanel simulacion={simulacion} />
              <hr className="my-6 border-t border-gray-200" />

              { /* Grid de matrículas */}
              <div className="py-4 px-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Matrículas</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-[20px] p-0 md:p-[20px] overflow-x-auto border-0 md:border-[2px] md:border-solid md:border-gray">
                  {simulacion.matriculas.map((matricula) => (
                    <div
                      key={matricula.id}
                      onClick={() => setMatriculaActiva(matricula.id)}
                      className="cursor-pointer flex-shrink-0"
                    >
                      <MatriculaColumn
                        matricula={matricula}
                        onDelete={eliminarMatricula}
                        onAddAsignatura={agregarAsignaturaAMatricula}
                        onRemoveAsignatura={removerAsignaturaDeMatricula}
                        onMoveAsignatura={moverAsignatura}
                        onReorderAsignaturas={reordenarAsignaturas}
                        onChangeAsignaturaColor={cambiarColorAsignatura}
                        setAsignaturaDetalle={setAsignaturaDetalle}
                        setShowPanel={setShowPanel}
                        isActive={matriculaActiva === matricula.id}
                      />
                    </div>
                  ))}

                  {/* Tarjeta para agregar nueva matrícula */}
                  <div
                    onClick={crearMatricula}
                    className="cursor-pointer group flex-shrink-0"
                  >
                    <div className="w-full bg-white border-2 border-dashed border-gray-300
                                rounded-lg p-[20px] h-[378.2px]
                                flex flex-col items-center justify-center
                                hover:border-unal-green-400 hover:bg-unal-green-50 transition-colors">
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
              </div>
            </div>
          </main>
        </>
      )}

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
          selectedAsignaturas={
            simulacion.matriculas.find(m => m.id === matriculaActiva)?.asignaturas || []
          }
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

      <AsignaturaDetalleModal
        open={asignaturaDetalle.open}
        asignatura={asignaturaDetalle.asignatura}
        onClose={() => setAsignaturaDetalle({ open: false, asignatura: null })}
      />

      {/* Botón hamburguesa flotante para móvil */}
      {!isDesktop && matriculaActiva && (
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="fixed top-[75px] right-3 z-50 p-3 rounded-full shadow-lg transition-colors lg:hidden"
          style={{ backgroundColor: '#57844A', color: 'white' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4a6d3e')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#57844A')}
          title={showPanel ? 'Cerrar panel de asignaturas' : 'Abrir panel de asignaturas'}
          aria-label="Alternar panel de asignaturas"
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

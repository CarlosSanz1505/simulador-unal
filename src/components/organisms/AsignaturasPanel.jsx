import { useMemo, useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import { asignaturas } from '../../data/asignaturas.json'
import PrerequisitosModal from '../atoms/PrerequisitosModal'

function AsignaturasPanel({ onSelectAsignaturas, onClose, matriculaActiva, todasLasAsignaturas = [], showPanel = true, setShowPanel, isDesktop = false, simulacion }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('nombre')
  const [localSelectedAsignaturas, setLocalSelectedAsignaturas] = useState([]) // Inicializar vacío
  const [collapsedTipologias, setCollapsedTipologias] = useState({}) // Estado para colapsar tipologías
  const [showPrerequisitosModal, setShowPrerequisitosModal] = useState(false)
  const [prerequisitosFaltantes, setPrerrequisitosFaltantes] = useState([])

  // Filtrar asignaturas según el término de búsqueda y excluir las ya agregadas
  const filteredAsignaturas = useMemo(() => {
    const asignaturasDisponibles = asignaturas.filter(asignatura => {
      // Excluir asignaturas que ya están en cualquier matrícula
      return !todasLasAsignaturas.some(a => a.codigo === asignatura.codigo)
    })

    if (!searchTerm) return asignaturasDisponibles

    return asignaturasDisponibles.filter(asignatura => {
      const searchValue = searchTerm.toLowerCase().trim()
      
      switch (searchBy) {
        case 'nombre':
          return asignatura.nombre.toLowerCase().includes(searchValue)
        case 'codigo':
          return asignatura.codigo.toLowerCase().includes(searchValue)
        case 'tipologia':
          return asignatura.tipologia.toLowerCase().includes(searchValue)
        default:
          return true
      }
    })
  }, [searchTerm, searchBy, todasLasAsignaturas])

  // Agrupar asignaturas por tipología con orden específico
  const asignaturasPorTipologia = useMemo(() => {
    const grupos = {}
    filteredAsignaturas.forEach(asignatura => {
      if (!grupos[asignatura.tipologia]) {
        grupos[asignatura.tipologia] = []
      }
      grupos[asignatura.tipologia].push(asignatura)
    })
    
    // Definir el orden deseado de las tipologías
    const ordenTipologias = [
      'fundamentacion_obligatoria',
      'fundamentacion_optativa', 
      'disciplinar_obligatoria',
      'disciplinar_optativa',
      'trabajo_de_grado',
      'libre_eleccion'
    ]
    
    // Crear objeto ordenado
    const gruposOrdenados = {}
    ordenTipologias.forEach(tipologia => {
      if (grupos[tipologia]) {
        gruposOrdenados[tipologia] = grupos[tipologia]
      }
    })
    
    // Agregar cualquier tipología no definida en el orden
    Object.keys(grupos).forEach(tipologia => {
      if (!gruposOrdenados[tipologia]) {
        gruposOrdenados[tipologia] = grupos[tipologia]
      }
    })
    
    return gruposOrdenados
  }, [filteredAsignaturas])

  const handleAsignaturaToggle = (asignatura) => {
    const isSelected = localSelectedAsignaturas.some(a => a.codigo === asignatura.codigo)
    
    if (isSelected) {
      // Si está seleccionada, la removemos
      setLocalSelectedAsignaturas(prev => prev.filter(a => a.codigo !== asignatura.codigo))
    } else {
      // VALIDACIÓN DE PRERREQUISITOS
      // Solo validar si la asignatura tiene prerrequisitos
      if (asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0) {
        console.log('🔍 Validando prerrequisitos para:', asignatura.nombre)
        console.log('🔍 Prerrequisitos requeridos:', asignatura.prerrequisitos)
        
        // Obtener todas las asignaturas ya agregadas en matrículas anteriores
        let asignaturasAprobadas = []
        
        if (simulacion && matriculaActiva) {
          const matriculaActual = simulacion.matriculas.find(m => m.id === matriculaActiva)
          if (matriculaActual) {
            // Obtener asignaturas de matrículas con posición menor
            asignaturasAprobadas = simulacion.matriculas
              .filter(m => m.posicion < matriculaActual.posicion)
              .flatMap(m => m.asignaturas.map(a => a.codigo))
          }
        }
        
        console.log('🔍 Asignaturas ya aprobadas:', asignaturasAprobadas)
        
        // Verificar si todos los prerrequisitos están cumplidos
        const prerequisitosFaltantes = asignatura.prerrequisitos.filter(prereqCodigo => 
          !asignaturasAprobadas.includes(prereqCodigo)
        )
        
        console.log('🔍 Prerrequisitos faltantes:', prerequisitosFaltantes)
        
        if (prerequisitosFaltantes.length > 0) {
          // Obtener información de los prerrequisitos faltantes
          const prerequisitosInfo = prerequisitosFaltantes.map(codigo => {
            const asignatura = asignaturas.find(a => a.codigo === codigo)
            return asignatura ? {
              codigo: asignatura.codigo,
              nombre: asignatura.nombre,
              creditos: asignatura.creditos
            } : { codigo, nombre: 'Asignatura no encontrada', creditos: 0 }
          })
          
          console.log('❌ Mostrando modal de prerrequisitos')
          setPrerrequisitosFaltantes(prerequisitosInfo)
          setShowPrerequisitosModal(true)
          return // No agregar la asignatura
        }
      }
      
      console.log('✅ Agregando asignatura:', asignatura.nombre)
      // Agregar la asignatura
      setLocalSelectedAsignaturas(prev => [...prev, asignatura])
    }
  }

  const toggleTipologia = (tipologia) => {
    setCollapsedTipologias(prev => ({
      ...prev,
      [tipologia]: !prev[tipologia]
    }))
  }

  const handleGuardar = () => {
    onSelectAsignaturas(localSelectedAsignaturas)
    setLocalSelectedAsignaturas([]) // Limpiar selección después de guardar
    if (!isDesktop && setShowPanel) {
      setShowPanel(false) // Solo cerrar panel en móvil después de guardar
    }
  }

  const tipologiaLabels = {
    'fundamentacion_obligatoria': 'Fund. Obligatoria',
    'fundamentacion_optativa': 'Fund. Optativa',
    'disciplinar_obligatoria': 'Disciplinar Obligatoria',
    'disciplinar_optativa': 'Disciplinar Optativa',
    'trabajo_de_grado': 'Trabajo de Grado',
    'libre_eleccion': 'Libre Elección'
  }

  const tipologiaColors = {
    'fundamentacion_obligatoria': '#dc2626',
    'fundamentacion_optativa': '#ea580c',
    'disciplinar_obligatoria': '#059669',
    'disciplinar_optativa': '#2563eb',
    'trabajo_de_grado': '#7c3aed',
    'libre_eleccion': '#f59e0b'
  }

  return (
    <>
      {/* Overlay - solo en móvil cuando showPanel es true */}
      {showPanel && !isDesktop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowPanel(false)}></div>
      )}
      
      {/* Panel de asignaturas */}
      <div className={`fixed right-0 bg-white border-l border-gray-200 flex flex-col shadow-lg z-50
                      ${isDesktop ? (showPanel ? '' : 'translate-x-full') : (showPanel ? 'translate-x-0' : 'translate-x-full')}
                      transition-transform duration-300 ease-in-out
                      ${isDesktop 
                        ? 'top-[50px] w-80 h-[90vh]' 
                        : 'top-16 w-full h-[calc(100vh-7rem)]'
                      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">Buscar Asignaturas</h3>
          <button 
            onClick={() => {
              if (isDesktop) {
                setShowPanel(false) // En desktop solo cerrar panel
              } else {
                onClose() // En móvil usar onClose
              }
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            title="Cerrar panel"
          >
            <img src={iconoCancelar} alt="Cerrar" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 space-y-4 flex-shrink-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por</label>
            <select 
              value={searchBy} 
              onChange={(e) => setSearchBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unal-green-500 focus:border-transparent"
            >
              <option value="nombre">Nombre</option>
              <option value="codigo">Código</option>
              <option value="tipologia">Tipología</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Escriba aquí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-unal-green-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              🔍
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(asignaturasPorTipologia).map(([tipologia, asignaturasList]) => (
            <div key={tipologia}>
              <div 
                className="sticky top-0 px-4 py-2 text-white text-sm font-medium z-10 flex items-center justify-between cursor-pointer"
                style={{ backgroundColor: tipologiaColors[tipologia] }}
                onClick={() => toggleTipologia(tipologia)}
              >
                <span>{tipologiaLabels[tipologia] || tipologia}</span>
                <span className="text-xs">
                  {collapsedTipologias[tipologia] ? '▼' : '▲'}
                </span>
              </div>
              
              {!collapsedTipologias[tipologia] && asignaturasList.map(asignatura => {
                const isSelected = localSelectedAsignaturas.some(a => a.codigo === asignatura.codigo)
                
                return (
                  <div 
                    key={asignatura.codigo}
                    className={`flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-unal-green-50 border-unal-green-200' : ''
                    }`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(asignatura))
                    }}
                  >
                    {/* Grip handle */}
                    <span className="flex items-center mr-2 cursor-grab select-none text-gray-400">
                      <svg width="16" height="16" fill="none" className="inline-block">
                        <circle cx="4" cy="4" r="1.5" fill="currentColor"/>
                        <circle cx="4" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
                      </svg>
                    </span>

                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAsignaturaToggle(asignatura)}
                        className="w-4 h-4 text-unal-green-500 bg-gray-100 border-gray-300 rounded focus:ring-unal-green-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 leading-tight mb-1">
                        {asignatura.nombre}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span className="font-mono">({asignatura.codigo})</span>
                        <span>{asignatura.creditos} créditos</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {tipologiaLabels[asignatura.tipologia]}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          {/* Texto explicativo */}
          <p className="text-sm text-gray-600 mb-3 text-center">
            {isDesktop 
              ? "Selecciona o arrastra las materias que deseas agregar a la matrícula activa que tienes seleccionada"
              : "Selecciona las materias que deseas agregar a la matrícula activa que tienes seleccionada"
            }
          </p>
          
          <button 
            onClick={handleGuardar}
            disabled={localSelectedAsignaturas.length === 0 || !matriculaActiva}
            className="w-full py-2 px-4 bg-unal-green-500 text-white rounded-md hover:bg-unal-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Guardar ({localSelectedAsignaturas.length})
          </button>
          {!matriculaActiva && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Selecciona una matrícula para agregar asignaturas
            </p>
          )}
        </div>
      </div>

      {/* Modal de prerrequisitos */}
      <PrerequisitosModal
        isOpen={showPrerequisitosModal}
        onClose={() => setShowPrerequisitosModal(false)}
        prerequisitosFaltantes={prerequisitosFaltantes}
      />
    </>
  )
}

export default AsignaturasPanel

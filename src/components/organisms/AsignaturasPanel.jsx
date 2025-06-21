import { useMemo, useState } from 'react'
import { asignaturas } from '../../data/asignaturas.json'

function AsignaturasPanel({ onSelectAsignaturas, onClose, selectedAsignaturas = [], matriculaActiva }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('nombre')
  const [localSelectedAsignaturas, setLocalSelectedAsignaturas] = useState(selectedAsignaturas)

  // Filtrar asignaturas según el término de búsqueda
  const filteredAsignaturas = useMemo(() => {
    if (!searchTerm) return asignaturas

    return asignaturas.filter(asignatura => {
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
  }, [searchTerm, searchBy])

  // Agrupar asignaturas por tipología
  const asignaturasPorTipologia = useMemo(() => {
    const grupos = {}
    filteredAsignaturas.forEach(asignatura => {
      if (!grupos[asignatura.tipologia]) {
        grupos[asignatura.tipologia] = []
      }
      grupos[asignatura.tipologia].push(asignatura)
    })
    return grupos
  }, [filteredAsignaturas])

  const handleAsignaturaToggle = (asignatura) => {
    const isSelected = localSelectedAsignaturas.some(a => a.codigo === asignatura.codigo)
    
    if (isSelected) {
      setLocalSelectedAsignaturas(prev => prev.filter(a => a.codigo !== asignatura.codigo))
    } else {
      setLocalSelectedAsignaturas(prev => [...prev, asignatura])
    }
  }

  const handleGuardar = () => {
    onSelectAsignaturas(localSelectedAsignaturas)
    onClose()
  }

  const tipologiaLabels = {
    'nivelacion': 'Nivelación',
    'fundamentacion_obligatoria': 'Fund. Obligatoria',
    'fundamentacion_optativa': 'Fund. Optativa',
    'disciplinar_obligatoria': 'Disciplinar Obligatoria',
    'disciplinar_optativa': 'Disciplinar Optativa',
    'trabajo_de_grado': 'Trabajo de Grado',
    'libre_eleccion': 'Libre Elección'
  }

  const tipologiaColors = {
    'nivelacion': '#7c3aed',
    'fundamentacion_obligatoria': '#dc2626',
    'fundamentacion_optativa': '#ea580c',
    'disciplinar_obligatoria': '#059669',
    'disciplinar_optativa': '#2563eb',
    'trabajo_de_grado': '#7c2d12',
    'libre_eleccion': '#059669'
  }

  return (
    <div className="asignaturas-panel">
      <div className="panel-header">
        <h3>Buscar Asignaturas</h3>
        <div className="filter-icon">🔍</div>
      </div>

      <div className="search-controls">
        <div className="search-by-select">
          <label>Buscar por</label>
          <select 
            value={searchBy} 
            onChange={(e) => setSearchBy(e.target.value)}
            className="search-select"
          >
            <option value="nombre">Nombre</option>
            <option value="codigo">Código</option>
            <option value="tipologia">Tipología</option>
          </select>
        </div>

        <div className="search-input-container">
          <input
            type="text"
            placeholder="Escriba aquí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="asignaturas-list">
        {Object.entries(asignaturasPorTipologia).map(([tipologia, asignaturasList]) => (
          <div key={tipologia} className="tipologia-group">
            <div 
              className="tipologia-header"
              style={{ backgroundColor: tipologiaColors[tipologia] }}
            >
              {tipologiaLabels[tipologia] || tipologia}
            </div>
            
            {asignaturasList.map(asignatura => {
              const isSelected = localSelectedAsignaturas.some(a => a.codigo === asignatura.codigo)
              
              return (
                <div 
                  key={asignatura.codigo}
                  className={`asignatura-item ${isSelected ? 'selected' : ''}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(asignatura))
                  }}
                >
                  <div className="asignatura-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAsignaturaToggle(asignatura)}
                    />
                  </div>
                  
                  <div className="asignatura-info">
                    <div className="asignatura-name">
                      {asignatura.nombre}
                    </div>
                    <div className="asignatura-details">
                      <span className="asignatura-codigo">({asignatura.codigo})</span>
                      <span className="asignatura-creditos">{asignatura.creditos} créditos</span>
                    </div>
                    <div className="asignatura-tipologia">
                      {tipologiaLabels[asignatura.tipologia]}
                    </div>
                  </div>
                  
                  <div className="asignatura-credits">
                    {asignatura.creditos}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <button 
          onClick={handleGuardar}
          className="guardar-btn"
          disabled={localSelectedAsignaturas.length === 0 || !matriculaActiva}
        >
          Guardar
        </button>
        {!matriculaActiva && (
          <p className="text-sm text-gray-500 mt-2">
            Selecciona una matrícula para agregar asignaturas
          </p>
        )}
      </div>
    </div>
  )
}

export default AsignaturasPanel

import { useEffect, useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import iconoEditar from '../../assets/iconos/editar.svg'
import iconoPincel from '../../assets/iconos/pincel.svg'
import Card from '../atoms/Card'

function MatriculaColumn({ matricula, onDelete, onAddAsignatura, onRemoveAsignatura, onEditName, onMoveAsignatura, onChangeAsignaturaColor, isActive = false }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(matricula.nombre || `Matrícula ${matricula.posicion}`)
  const [draggedAsignatura, setDraggedAsignatura] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(null) // código de asignatura para mostrar picker

  // Cerrar modal de color cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && !event.target.closest('.color-picker-modal') && !event.target.closest('[data-color-button]')) {
        setShowColorPicker(null)
      }
    }

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorPicker])

  // Colores suavizados para las tipologías (más claros que los del header)
  const tipologiaColors = {
    'fundamentacion_obligatoria': { 
      border: '#f87171', // red-400
      background: '#fef2f2', // red-50
      text: '#dc2626' // red-600
    },
    'fundamentacion_optativa': { 
      border: '#fb923c', // orange-400
      background: '#fff7ed', // orange-50
      text: '#ea580c' // orange-600
    },
    'disciplinar_obligatoria': { 
      border: '#34d399', // emerald-400
      background: '#ecfdf5', // emerald-50
      text: '#059669' // emerald-600
    },
    'disciplinar_optativa': { 
      border: '#60a5fa', // blue-400
      background: '#eff6ff', // blue-50
      text: '#2563eb' // blue-600
    },
    'trabajo_de_grado': { 
      border: '#a78bfa', // violet-400
      background: '#f5f3ff', // violet-50
      text: '#7c3aed' // violet-600
    },
    'libre_eleccion': { 
      border: '#fbbf24', // amber-400
      background: '#fffbeb', // amber-50
      text: '#f59e0b' // amber-500
    }
  }

  // Colores predefinidos para selección
  const colorOptions = [
    { name: 'Rojo', border: '#f87171', background: '#fef2f2', text: '#dc2626' },
    { name: 'Naranja', border: '#fb923c', background: '#fff7ed', text: '#ea580c' },
    { name: 'Verde', border: '#34d399', background: '#ecfdf5', text: '#059669' },
    { name: 'Azul', border: '#60a5fa', background: '#eff6ff', text: '#2563eb' },
    { name: 'Púrpura', border: '#a78bfa', background: '#f5f3ff', text: '#7c3aed' },
    { name: 'Amarillo', border: '#fbbf24', background: '#fffbeb', text: '#f59e0b' },
    { name: 'Rosa', border: '#f472b6', background: '#fdf2f8', text: '#ec4899' },
    { name: 'Turquesa', border: '#22d3ee', background: '#f0fdfa', text: '#0891b2' },
    { name: 'Gris', border: '#6b7280', background: '#f9fafb', text: '#374151' },
    { name: 'Índigo', border: '#6366f1', background: '#eef2ff', text: '#4f46e5' }
  ]

  const getAsignaturaStyle = (asignatura) => {
    // Si la asignatura tiene un color personalizado, usarlo
    if (asignatura.customColor) {
      return {
        borderLeft: `4px solid ${asignatura.customColor.border}`,
        backgroundColor: asignatura.customColor.background
      }
    }
    
    // Sino, usar el color por tipología
    const colors = tipologiaColors[asignatura.tipologia] || tipologiaColors['libre_eleccion']
    return {
      borderLeft: `4px solid ${colors.border}`,
      backgroundColor: colors.background
    }
  }

  const handleChangeColor = (asignaturaCodigo, colorOption) => {
    if (onChangeAsignaturaColor) {
      onChangeAsignaturaColor(matricula.id, asignaturaCodigo, colorOption)
    }
    setShowColorPicker(null)
  }

  const handleResetColor = (asignaturaCodigo) => {
    if (onChangeAsignaturaColor) {
      onChangeAsignaturaColor(matricula.id, asignaturaCodigo, null) // null para resetear
    }
    setShowColorPicker(null)
  }

  const handleDelete = () => {
    onDelete(matricula.id)
  }

  const handleEditName = () => {
    setIsEditingName(true)
  }

  const handleSaveName = () => {
    if (editedName.trim() && onEditName) {
      onEditName(matricula.id, editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditedName(matricula.nombre || `Matrícula ${matricula.posicion}`)
    setIsEditingName(false)
  }

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverIndex(null)
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'))
      
      if (dragData.type === 'asignatura-from-panel') {
        // Asignatura arrastrada desde el panel de asignaturas
        if (dragData.asignatura && onAddAsignatura) {
          onAddAsignatura(matricula.id, dragData.asignatura)
        }
      } else if (dragData.type === 'asignatura-from-matricula') {
        // Asignatura arrastrada desde otra matrícula
        if (onMoveAsignatura) {
          const dropIndex = dragOverIndex !== null ? dragOverIndex : matricula.asignaturas.length
          onMoveAsignatura(
            dragData.sourceMatriculaId, 
            matricula.id, 
            dragData.asignatura, 
            dropIndex
          )
        }
      }
    } catch (error) {
      console.error('Error al procesar la asignatura:', error)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
    
    // Calcular posición de inserción para reordenamiento
    if (matricula.asignaturas.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect()
      const y = e.clientY - rect.top
      const asignaturaHeight = 80 // altura aproximada de cada asignatura
      const insertIndex = Math.floor(y / asignaturaHeight)
      setDragOverIndex(Math.min(insertIndex, matricula.asignaturas.length))
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverIndex(null)
  }

  // Funciones para drag de asignaturas existentes
  const handleAsignaturaDragStart = (e, asignatura, index) => {
    setDraggedAsignatura({ asignatura, index })
    const dragData = {
      type: 'asignatura-from-matricula',
      sourceMatriculaId: matricula.id,
      asignatura: asignatura,
      sourceIndex: index
    }
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleAsignaturaDragEnd = () => {
    setDraggedAsignatura(null)
    setDragOverIndex(null)
  }

  const handleAsignaturaDragOver = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedAsignatura && draggedAsignatura.asignatura.codigo !== matricula.asignaturas[index]?.codigo) {
      setDragOverIndex(index)
    }
  }

  const handleRemoveAsignatura = (asignaturaId) => {
    if (onRemoveAsignatura) {
      onRemoveAsignatura(matricula.id, asignaturaId)
    }
  }

  const calcularCreditos = () => {
    return matricula.asignaturas.reduce((total, asignatura) => total + asignatura.creditos, 0)
  }

  return (
    <Card active={isActive} className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 flex-1">
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleNameKeyPress}
              className="font-semibold text-gray-900 bg-transparent border-b-2 border-unal-green-500 focus:outline-none focus:border-unal-green-600 px-1"
              autoFocus
              maxLength={50}
            />
          ) : (
            <>
              <h4 className="font-semibold text-gray-900">
                {matricula.nombre || `Matrícula ${matricula.posicion}`}
              </h4>
              <button
                onClick={handleEditName}
                className="text-gray-400 hover:text-unal-green-600 hover:bg-unal-green-50 p-1 rounded transition-colors"
                title="Editar nombre"
              >
                <img src={iconoEditar} alt="Editar" className="w-7 h-7" />
              </button>
            </>
          )}
        </div>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors ml-2"
          title="Eliminar matrícula"
        >
          <img src={iconoCancelar} alt="Eliminar" className="w-8 h-8" />
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        {matricula.asignaturas.length === 0 ? (
          <p>Sin asignaturas</p>
        ) : (
          <p>
            {matricula.asignaturas.length} asignatura{matricula.asignaturas.length !== 1 ? 's' : ''} - {calcularCreditos()} créditos
          </p>
        )}
      </div>

      <div 
        className={`min-h-[200px] border-2 border-dashed rounded-lg p-3 drop-zone ${
          isDragOver 
            ? 'border-unal-green-400 bg-unal-green-50 drag-over' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {matricula.asignaturas.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">
                {isDragOver ? '↓' : '+'}
              </div>
              <div>
                {isDragOver ? 'Suelta aquí' : 'Arrastra asignaturas aquí'}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {matricula.asignaturas.map((asignatura, index) => (
              <div key={asignatura.codigo}>
                {/* Indicador de zona de drop para reordenamiento */}
                {dragOverIndex === index && draggedAsignatura && (
                  <div className="drop-indicator"></div>
                )}
                
                <div 
                  draggable
                  onDragStart={(e) => handleAsignaturaDragStart(e, asignatura, index)}
                  onDragEnd={handleAsignaturaDragEnd}
                  onDragOver={(e) => handleAsignaturaDragOver(e, index)}
                  className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md drag-item relative
                    ${draggedAsignatura?.asignatura.codigo === asignatura.codigo ? 'dragging' : ''}
                    ${dragOverIndex === index ? 'transform translate-y-1' : ''}
                  `}
                  style={getAsignaturaStyle(asignatura)}
                  title={`${asignatura.descripcion} - Arrastra para mover o clic derecho para cambiar color`}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setShowColorPicker(showColorPicker === asignatura.codigo ? null : asignatura.codigo)
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      {/* Icono de arrastre */}
                      <div className="text-gray-400 text-xs">⋮⋮</div>
                      <span className="font-medium text-xs text-gray-800 leading-tight">
                        {asignatura.nombre}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Indicador de color personalizado */}

                      {/* Botón de cambio de color */}
                      <button
                        data-color-button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowColorPicker(showColorPicker === asignatura.codigo ? null : asignatura.codigo)
                        }}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"
                        title="Cambiar color"
                      >
                        <img src={iconoPincel} alt="Cambiar color" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveAsignatura(asignatura.codigo)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded transition-colors flex-shrink-0"
                        title="Remover asignatura"
                      >
                        <img src={iconoCancelar} alt="Remover" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 font-mono">{asignatura.codigo}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {asignatura.creditos} Créditos
                    </span>
                  </div>

                  {/* Modal de selección de color */}
                  {showColorPicker === asignatura.codigo && (
                    <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 mt-1 color-picker-modal">
                      <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <img src={iconoPincel} alt="Seleccionar color" className="w-10 h-6" />
                        Seleccionar color:
                      </div>
                      <div className="grid grid-cols-5 gap-1 mb-3">
                        {colorOptions.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChangeColor(asignatura.codigo, color)}
                            className="w-7 h-7 rounded-lg border-2 border-gray-200 hover:border-gray-400 color-option"
                            style={{ 
                              backgroundColor: color.background, 
                              borderLeftColor: color.border, 
                              borderLeftWidth: '4px' 
                            }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleResetColor(asignatura.codigo)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                        >
                          Por defecto
                        </button>
                        <button
                          onClick={() => setShowColorPicker(null)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Indicador de zona de drop al final */}
                {index === matricula.asignaturas.length - 1 && dragOverIndex === matricula.asignaturas.length && draggedAsignatura && (
                  <div className="drop-indicator mt-2"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default MatriculaColumn

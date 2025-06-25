import { faEdit, faPaintBrush } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import Card from '../atoms/Card'
import ColorPicker from '../atoms/ColorPicker'

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
};

function MatriculaColumn({ 
  matricula, 
  onDelete, 
  onAddAsignatura, 
  onRemoveAsignatura, 
  onEditName, 
  onMoveAsignatura, // Nueva prop para mover asignaturas entre matrículas
  onReorderAsignaturas, // Nueva prop para reordenar asignaturas dentro de la matrícula
  onChangeAsignaturaColor, // Nueva prop para cambiar el color de una asignatura
  isActive = false 
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedAsignatura, setDraggedAsignatura] = useState(null) // Para efectos visuales
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(matricula.nombre || `Matrícula ${matricula.posicion}`)
  const [colorPicker, setColorPicker] = useState({ isOpen: false, asignatura: null, anchorElement: null })

  const getAsignaturaStyle = (tipologia, customColor = null) => {
    if (customColor) {
      // Si hay color personalizado, usar ese color
      return {
        borderLeft: `4px solid ${customColor}`,
        backgroundColor: `${customColor}15` // Agregar transparencia al fondo
      }
    } else {
      // Usar colores por tipología
      const colors = tipologiaColors[tipologia] || tipologiaColors['libre_eleccion']
      return {
        borderLeft: `4px solid ${colors.border}`,
        backgroundColor: colors.background
      }
    }
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
    
    console.log('Drop detectado en matrícula:', matricula.id)
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'))
      console.log('Datos del drag:', dragData)
      
      if (dragData.type === 'asignatura-from-panel') {
        // Asignatura del panel lateral (comportamiento original)
        console.log('Asignatura desde panel:', dragData.data?.nombre)
        if (dragData.data && onAddAsignatura) {
          onAddAsignatura(matricula.id, dragData.data)
        }
      } else if (dragData.type === 'asignatura-from-matricula') {
        // Asignatura de otra matrícula
        const { asignatura, sourceMatriculaId } = dragData.data
        console.log('Moviendo asignatura entre matrículas:', asignatura?.nombre)
        if (sourceMatriculaId !== matricula.id && onMoveAsignatura) {
          onMoveAsignatura(sourceMatriculaId, matricula.id, asignatura)
        }
      }
    } catch (error) {
      console.error('Error al procesar la asignatura:', error)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    // Solo desactivar el estado si realmente salimos del contenedor
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  const handleRemoveAsignatura = (asignaturaId) => {
    if (onRemoveAsignatura) {
      onRemoveAsignatura(matricula.id, asignaturaId)
    }
  }

  // Funciones para manejar el color picker
  const handleOpenColorPicker = (e, asignatura) => {
    e.stopPropagation() // Evitar que se active el drag
    e.preventDefault()
    
    setColorPicker({
      isOpen: true,
      asignatura: asignatura,
      anchorElement: e.currentTarget
    })
  }

  const handleCloseColorPicker = () => {
    setColorPicker({ isOpen: false, asignatura: null, anchorElement: null })
  }

  const handleColorSelect = (color) => {
    if (colorPicker.asignatura && onChangeAsignaturaColor) {
      onChangeAsignaturaColor(matricula.id, colorPicker.asignatura.codigo, color)
    }
  }

  const calcularCreditos = () => {
    return matricula.asignaturas.reduce((total, asignatura) => total + asignatura.creditos, 0)
  }

  // Funciones para drag and drop de asignaturas individuales
  const handleAsignaturaDragStart = (e, asignatura) => {
    setDraggedAsignatura(asignatura.codigo)
    const dragData = {
      type: 'asignatura-from-matricula',
      data: {
        asignatura,
        sourceMatriculaId: matricula.id
      }
    }
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleAsignaturaDragEnd = () => {
    setDraggedAsignatura(null)
  }

  // Funciones para reordenamiento dentro de la matrícula
  const handleAsignaturaDragOver = (e, targetIndex) => {
    e.preventDefault()
    // Solo permitir drop si es del mismo tipo y misma matrícula para reordenamiento
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'))
      if (dragData.type === 'asignatura-from-matricula' && dragData.data.sourceMatriculaId === matricula.id) {
        e.stopPropagation() // Solo detener propagación si es reordenamiento
        e.dataTransfer.dropEffect = 'move'
      }
      // Si es desde el panel, permitir que se propague al contenedor padre
    } catch (error) {
      // No hacer nada si hay error parseando
    }
  }

  const handleAsignaturaDropOnItem = (e, targetIndex) => {
    e.preventDefault()
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'))
      
      if (dragData.type === 'asignatura-from-matricula' && dragData.data.sourceMatriculaId === matricula.id) {
        // Reordenamiento dentro de la misma matrícula
        e.stopPropagation() // Solo detener propagación si es reordenamiento
        const { asignatura } = dragData.data
        const currentIndex = matricula.asignaturas.findIndex(a => a.codigo === asignatura.codigo)
        
        if (currentIndex !== -1 && currentIndex !== targetIndex && onReorderAsignaturas) {
          onReorderAsignaturas(matricula.id, currentIndex, targetIndex)
        }
      }
      // Si es desde el panel, permitir que se propague al contenedor padre (no hacer nada aquí)
    } catch (error) {
      console.error('Error al reordenar asignatura:', error)
    }
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
                <FontAwesomeIcon icon={faEdit} />
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
        className={`h-[300px] overflow-y-auto min-h-[200px] border-2 border-dashed rounded-lg p-3 transition-colors ${
          isDragOver 
            ? 'border-unal-green-400 bg-unal-green-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {matricula.asignaturas.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">+</div>
              <div>Arrastra asignaturas aquí</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {matricula.asignaturas.map((asignatura, index) => (
              <div 
                key={asignatura.codigo}
                draggable
                onDragStart={(e) => handleAsignaturaDragStart(e, asignatura)}
                onDragEnd={handleAsignaturaDragEnd}
                onDragOver={(e) => handleAsignaturaDragOver(e, index)}
                onDrop={(e) => handleAsignaturaDropOnItem(e, index)}
                className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move
                  ${asignatura.error ? 'border-red-500 border-4' : 'border-gray-200'}
                  ${draggedAsignatura === asignatura.codigo ? 'asignatura-dragging' : ''}`}
                style={getAsignaturaStyle(asignatura.tipologia, asignatura.customColor)}
                title={`${asignatura.descripcion || asignatura.nombre} - Arrastra para mover o reordenar`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Icono de grip para indicar que es arrastrable */}
                    <span className="asignatura-grip text-gray-400 cursor-grab select-none hover:text-gray-600 transition-colors">
                      <svg width="16" height="16" fill="none" className="inline-block">
                        <circle cx="4" cy="4" r="1.5" fill="currentColor"/>
                        <circle cx="4" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                      </svg>
                    </span>
                    <span className="font-medium text-sm text-gray-800 leading-tight">
                      {asignatura.nombre}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Botón de pincel para cambiar color */}
                    <button
                      onClick={(e) => handleOpenColorPicker(e, asignatura)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                      title="Cambiar color"
                    >
                      <FontAwesomeIcon icon={faPaintBrush} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveAsignatura(asignatura.codigo)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Remover asignatura"
                    >
                      <img src={iconoCancelar} alt="Remover" className="w-8 h-8" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-mono">{asignatura.codigo}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {asignatura.creditos} Créditos
                  </span>
                </div>
                {asignatura.error && asignatura.faltantes && (
                  <div className="mt-2 text-red-500 text-xs">
                    Prerrequisitos pendientes:
                    <ul className="list-disc ml-4">
                      {asignatura.faltantes.map(pr => (
                        <li key={pr.codigo}>{pr.nombre} ({pr.codigo})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker para asignaturas */}
      <ColorPicker
        isOpen={colorPicker.isOpen}
        onClose={handleCloseColorPicker}
        onColorSelect={handleColorSelect}
        currentColor={colorPicker.asignatura?.customColor}
        anchorElement={colorPicker.anchorElement}
      />
    </Card>
  )
}

export default MatriculaColumn

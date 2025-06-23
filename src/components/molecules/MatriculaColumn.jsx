import { useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import Card from '../atoms/Card'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function MatriculaColumn({ matricula, onDelete, onAddAsignatura, onRemoveAsignatura, onEditName, isActive = false }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(matricula.nombre || `Matrícula ${matricula.posicion}`)

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

  const getAsignaturaStyle = (tipologia) => {
    const colors = tipologiaColors[tipologia] || tipologiaColors['libre_eleccion']
    return {
      borderLeft: `4px solid ${colors.border}`,
      backgroundColor: colors.background
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
    
    try {
      const asignaturaData = JSON.parse(e.dataTransfer.getData('application/json'))
      if (asignaturaData && onAddAsignatura) {
        onAddAsignatura(matricula.id, asignaturaData)
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
    e.preventDefault()
    setIsDragOver(false)
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
        className={`min-h-[200px] border-2 border-dashed rounded-lg p-3 transition-colors ${
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
            {matricula.asignaturas.map((asignatura) => (
              <div 
                key={asignatura.codigo}
                className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                style={getAsignaturaStyle(asignatura.tipologia)}
                title={asignatura.descripcion}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-800 leading-tight">
                    {asignatura.nombre}
                  </span>
                  <button
                    onClick={() => handleRemoveAsignatura(asignatura.codigo)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors ml-2 flex-shrink-0"
                    title="Remover asignatura"
                  >
                    <img src={iconoCancelar} alt="Remover" className="w-8 h-8" />
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-mono">{asignatura.codigo}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {asignatura.creditos} Créditos
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default MatriculaColumn

import { useState } from 'react'
import Card from '../atoms/Card'

function MatriculaColumn({ matricula, onDelete, onAddAsignatura, onRemoveAsignatura, isActive = false }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta matrícula?')) {
      onDelete(matricula.id)
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
    <Card active={isActive} className="fade-in">
      <div className="flex-between mb-4">
        <h4 className="font-semibold text-gray-900">
          Matrícula {matricula.posicion}
        </h4>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 transition-colors"
          style={{
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px'
          }}
          title="Eliminar matrícula"
        >
          ✕
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
        className={`matricula-dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {matricula.asignaturas.length === 0 ? (
          <div className="flex-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">+</div>
              <div>Nueva Matrícula</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {matricula.asignaturas.map((asignatura) => (
              <div 
                key={asignatura.codigo}
                className="asignatura-card"
                title={asignatura.descripcion}
              >
                <div className="asignatura-header">
                  <span className="asignatura-nombre">{asignatura.nombre}</span>
                  <button
                    onClick={() => handleRemoveAsignatura(asignatura.codigo)}
                    className="remove-asignatura-btn"
                    title="Remover asignatura"
                  >
                    ✕
                  </button>
                </div>
                <div className="asignatura-details">
                  <span className="asignatura-codigo">{asignatura.codigo}</span>
                  <span className="asignatura-tipologia">{asignatura.tipologia.toUpperCase()}</span>
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

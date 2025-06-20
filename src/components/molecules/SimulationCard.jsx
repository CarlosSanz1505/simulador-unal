import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../atoms/Button'
import Card from '../atoms/Card'

function SimulationCard({ simulacion, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(simulacion.nombre)

  const handleDelete = (e) => {
    e.preventDefault() // Evitar que el Link se active
    if (confirm('¿Estás seguro de eliminar esta simulación?')) {
      onDelete(simulacion.id)
    }
  }

  const handleExport = (e) => {
    e.preventDefault() // Evitar que el Link se active
    const dataStr = JSON.stringify(simulacion, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${simulacion.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleEdit = (e) => {
    e.preventDefault() // Evitar que el Link se active
    setIsEditing(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (editedName.trim() && editedName.trim() !== simulacion.nombre) {
      onEdit(simulacion.id, editedName.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = (e) => {
    e.preventDefault()
    setEditedName(simulacion.nombre)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit(e)
    } else if (e.key === 'Escape') {
      handleCancelEdit(e)
    }
  }

  return (
    <Card>
      <div className="flex-between mb-4">
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              style={{
                flex: 1,
                padding: '4px 8px',
                border: '2px solid #57844A',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            />
            <button 
              onClick={handleSaveEdit}
              style={{
                background: '#57844A', 
                color: 'white',
                border: 'none', 
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="Guardar"
            >
              ✓
            </button>
            <button 
              onClick={handleCancelEdit}
              style={{
                background: '#6b7280', 
                color: 'white',
                border: 'none', 
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="Cancelar"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold" style={{ cursor: 'pointer' }} onClick={handleEdit}>
              {simulacion.nombre}
            </h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={handleEdit}
                style={{
                  background: 'none', 
                  border: 'none', 
                  color: '#57844A', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px'
                }}
                title="Editar nombre"
              >
                ✏️
              </button>
              <button 
                onClick={handleDelete}
                style={{
                  background: 'none', 
                  border: 'none', 
                  color: '#dc2626', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px'
                }}
                title="Eliminar simulación"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-between mb-4" style={{gap: '8px'}}>
        <div style={{flex: 1}}>
          <p className="text-sm text-gray-600 mb-2">
            Creada: {simulacion.fechaCreacion}
          </p>
          
          <div className="text-sm mb-4">
            <p>
              Total créditos: <span className="font-semibold text-green-600">{simulacion.creditos.total}</span>
            </p>
            <p className="text-gray-600">
              Matrículas: {simulacion.matriculas.length}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          style={{
            background: '#3b82f6', 
            color: 'white',
            border: 'none', 
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            height: 'fit-content'
          }}
          title="Exportar simulación"
        >
          📥 Exportar
        </button>
      </div>

      <Link 
        to={`/simulacion/${simulacion.id}`}
        style={{textDecoration: 'none'}}
      >
        <Button variant="primary" style={{width: '100%'}}>
          Ver simulación →
        </Button>
      </Link>
    </Card>
  )
}

export default SimulationCard

import { useState } from 'react'
import { Link } from 'react-router-dom'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import iconoConfirmar from '../../assets/iconos/confirmar.svg'
import iconoEditar from '../../assets/iconos/editar.svg'
import iconoEliminar from '../../assets/iconos/eliminar.svg'
import iconoExportar from '../../assets/iconos/exportar.svg'
import Button from '../atoms/Button'
import Card from '../atoms/Card'

function SimulationCard({ simulacion, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(simulacion.nombre)
  const [error, setError] = useState('')

  const handleDelete = (e) => {
    e.preventDefault()
    onDelete(simulacion.id)
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

  const handleEdit = (e) => {
    e.preventDefault()
    setIsEditing(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (editedName.trim().length > 22) {
      setError('El nombre no puede tener más de 22 caracteres.')
      return
    }
    if (editedName.trim() && editedName.trim() !== simulacion.nombre) {
      onEdit(simulacion.id, editedName.trim())
    }
    setIsEditing(false)
    setError('')
  }

  const handleCancelEdit = (e) => {
    e.preventDefault()
    setEditedName(simulacion.nombre)
    setIsEditing(false)
    setError('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSaveEdit(e)
    if (e.key === 'Escape') handleCancelEdit(e)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setEditedName(value)
    if (value.length > 22) {
      setError('Máximo 22 caracteres.')
    } else {
      setError('')
    }
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 w-full flex-wrap">
              <input
                type="text"
                value={editedName}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                maxLength={100} // opcional, puedes limitar aún más
                autoFocus
                className="min-w-0 max-w-[60%] flex-1 px-2 py-1 border-2 border-unal-green-500 rounded text-base font-semibold focus:outline-none focus:ring-2 focus:ring-unal-green-300"
              />
              <button 
                onClick={handleSaveEdit}
                className="bg-unal-green-500 text-white rounded w-10 h-10 flex items-center justify-center hover:bg-unal-green-700"
                title="Guardar"
              >
                <img src={iconoConfirmar} alt="Guardar" className="w-6 h-6" />
              </button>
              <button 
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white rounded w-10 h-10 flex items-center justify-center hover:bg-gray-600"
                title="Cancelar"
              >
                <img src={iconoCancelar} alt="Cancelar" className="w-6 h-6" />
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        ) : (
          <>
            <h3 
              className="text-lg font-semibold cursor-pointer hover:text-unal-green-500 transition-colors" 
              onClick={handleEdit}
            >
              {simulacion.nombre}
            </h3>
            <div className="flex gap-1">
              <button 
                onClick={handleEdit}
                className="bg-transparent border-none text-unal-green-500 cursor-pointer p-2 hover:bg-gray-100 rounded transition-colors"
                title="Editar nombre"
              >
                <img src={iconoEditar} alt="Editar" className="w-8 h-8" />
              </button>
              <button 
                onClick={handleDelete}
                className="bg-transparent border-none text-red-600 cursor-pointer text-sm p-1 hover:bg-gray-100 rounded transition-colors"
                title="Eliminar simulación"
              >
                <img src={iconoEliminar} alt="Eliminar" className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-start gap-2 mb-4">
        <div className="flex-1">
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
          className="bg-unal-green-500 text-white border-none rounded px-3 py-2 cursor-pointer text-sm hover:bg-unal-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
          title="Exportar simulación"
        >
          <img src={iconoExportar} alt="Exportar" className="w-8 h-8" />
          Exportar
        </button>
      </div>

      <Link to={`/simulacion/${simulacion.id}`} className="block w-full no-underline">
        <Button variant="primary" className="w-full">
          Ver simulación →
        </Button>
      </Link>
    </Card>
  )
}

export default SimulationCard

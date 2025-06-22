import { useState } from 'react'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import Card from '../atoms/Card'

function MatriculaColumn({ matricula, onDelete, onAddAsignatura, onRemoveAsignatura, isActive = false }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDelete = () => {
    onDelete(matricula.id)
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
        <h4 className="font-semibold text-gray-900">
          Matrícula {matricula.posicion}
        </h4>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
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
                  <span className="px-2 py-1 bg-unal-green-100 text-unal-green-800 rounded-full text-xs font-medium">
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

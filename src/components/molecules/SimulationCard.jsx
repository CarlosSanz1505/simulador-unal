import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import iconoCancelar from '../../assets/iconos/cancelar.svg'
import iconoConfirmar from '../../assets/iconos/confirmar.svg'
import Button from '../atoms/Button'
import Card from '../atoms/Card'

// Función para calcular créditos totales dinámicamente
function calcularCreditosTotales(simulacion) {
  if (!simulacion || !simulacion.matriculas) return 0;
  
  const limites = {
    fundamentacion_obligatoria: 27,
    fundamentacion_optativa: 16,
    disciplinar_obligatoria: 57,
    disciplinar_optativa: 22,
    libre_eleccion: 32,
    trabajo_de_grado: 6
  };

  const creditos = {
    fundamentacionObligatoria: 0,
    fundamentacionOptativa: 0,
    disciplinarObligatoria: 0,
    disciplinarOptativa: 0,
    libreEleccion: 0,
    trabajoGrado: 0
  };

  // Calcular créditos basándose en las asignaturas de todas las matrículas
  simulacion.matriculas.forEach(matricula => {
    matricula.asignaturas.forEach(asignatura => {
      const creditosAsignatura = parseInt(asignatura.creditos) || 0;
      
      // Normalizar tipología para manejo consistente
      const tipologiaNormalizada = asignatura.tipologia?.toLowerCase().replace(/\s+/g, '_');
      
      switch (tipologiaNormalizada) {
        case 'fundamentacion_obligatoria':
        case 'fundamentación_obligatoria':
          creditos.fundamentacionObligatoria += creditosAsignatura;
          break;
        case 'fundamentacion_optativa':
        case 'fundamentación_optativa':
          creditos.fundamentacionOptativa += creditosAsignatura;
          break;
        case 'disciplinar_obligatoria':
          creditos.disciplinarObligatoria += creditosAsignatura;
          break;
        case 'disciplinar_optativa':
          creditos.disciplinarOptativa += creditosAsignatura;
          break;
        case 'libre_eleccion':
        case 'libre_elección':
          creditos.libreEleccion += creditosAsignatura;
          break;
        case 'trabajo_de_grado':
          creditos.trabajoGrado += creditosAsignatura;
          break;
      }
    });
  });

  // Calcular total aplicando límites máximos para cada tipología
  return Math.min(creditos.fundamentacionObligatoria, limites.fundamentacion_obligatoria) +
         Math.min(creditos.fundamentacionOptativa, limites.fundamentacion_optativa) +
         Math.min(creditos.disciplinarObligatoria, limites.disciplinar_obligatoria) +
         Math.min(creditos.disciplinarOptativa, limites.disciplinar_optativa) +
         Math.min(creditos.libreEleccion, limites.libre_eleccion) +
         Math.min(creditos.trabajoGrado, limites.trabajo_de_grado);
}

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

  // Calcular créditos totales dinámicamente
  const creditosTotales = calcularCreditosTotales(simulacion);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-start gap-2 w-full">
              <textarea
                value={editedName}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                maxLength={100}
                autoFocus
                rows={2}
                className="resize-none flex-1 min-w-0 px-2 py-1 border-2 border-unal-green-500 rounded text-base font-semibold focus:outline-none focus:ring-2 focus:ring-unal-green-300"
              />
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleSaveEdit}
                  className="w-10 h-10 flex items-center justify-center bg-unal-green-500 text-white rounded hover:bg-unal-green-700"
                  title="Guardar"
                >
                  <img src={iconoConfirmar} alt="Guardar" className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="w-10 h-10 flex items-center justify-center bg-gray-500 text-white rounded hover:bg-gray-600"
                  title="Cancelar"
                >
                  <img src={iconoCancelar} alt="Cancelar" className="w-6 h-6" />
                </button>
              </div>
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
                className="bg-transparent border-none text-unal-green-500 p-2 hover:bg-gray-100 rounded"
                title="Editar nombre"
              >
                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
              </button>
              <button 
                onClick={handleExport}
                className="bg-transparent border-none text-unal-green-500 p-2 hover:bg-gray-100 rounded"
                title="Exportar simulación"
              >
                <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDelete}
                className="bg-transparent border-none text-red-600 p-2 hover:bg-gray-100 rounded"
                title="Eliminar simulación"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
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
              Total créditos: <span className="font-semibold text-green-600">{creditosTotales}</span>
            </p>
            <p className="text-gray-600">
              Matrículas: {simulacion.matriculas.length}
            </p>
          </div>
        </div>
      </div>

      <Link 
        to={`/simulaciones/${simulacion.id}`}
        className="block w-full no-underline"
      >
        <Button variant="primary" className="w-full">
          Ver simulación →
        </Button>
      </Link>
    </Card>
  )
}

export default SimulationCard

import { Link } from 'react-router-dom'
import Button from '../atoms/Button'
import Card from '../atoms/Card'

function SimulationCard({ simulacion, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault() // Evitar que el Link se active
    if (confirm('¿Estás seguro de eliminar esta simulación?')) {
      onDelete(simulacion.id)
    }
  }

  return (
    <div className="card">
      <div className="flex-between mb-4">
        <h3 className="text-lg font-semibold">
          {simulacion.nombre}
        </h3>
        <button 
          onClick={handleDelete}
          style={{
            background: 'none', 
            border: 'none', 
            color: '#dc2626', 
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
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

      <Link 
        to={`/simulacion/${simulacion.id}`}
        style={{textDecoration: 'none'}}
      >
        <Button variant="primary" style={{width: '100%'}}>
          Ver simulación →
        </Button>
      </Link>
    </div>
  )
}

export default SimulationCard

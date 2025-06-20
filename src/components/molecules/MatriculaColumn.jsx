import Card from '../atoms/Card'

function MatriculaColumn({ matricula, onDelete, isActive = false }) {
  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta matrícula?')) {
      onDelete(matricula.id)
    }
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
            {matricula.asignaturas.length} asignatura{matricula.asignaturas.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="matricula-dropzone">
        {matricula.asignaturas.length === 0 ? (
          <div className="flex-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <div>Arrastra asignaturas aquí</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {matricula.asignaturas.map((asignaturaId) => (
              <div 
                key={asignaturaId}
                className="asignatura-pill"
                title={`Código: ${asignaturaId}`}
              >
                {asignaturaId}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default MatriculaColumn

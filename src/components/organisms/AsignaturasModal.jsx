import { useEffect, useState } from 'react'
import AsignaturasService from '../../data/asignaturasService'
import Button from '../atoms/Button'
import Modal from '../atoms/Modal'

function AsignaturasModal({ isOpen, onClose, onSelectAsignatura, asignaturasSeleccionadas = [], asignaturasAprobadas = [] }) {
  const [asignaturas, setAsignaturas] = useState([])
  const [filteredAsignaturas, setFilteredAsignaturas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTipologia, setSelectedTipologia] = useState('todas')
  const [selectedCreditos, setSelectedCreditos] = useState('todos')

  useEffect(() => {
    const todasAsignaturas = AsignaturasService.getAsignaturasDisponibles(
      asignaturasAprobadas, 
      asignaturasSeleccionadas
    )
    setAsignaturas(todasAsignaturas)
    setFilteredAsignaturas(todasAsignaturas)
  }, [asignaturasSeleccionadas, asignaturasAprobadas])

  useEffect(() => {
    let filtered = asignaturas

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = AsignaturasService.buscarAsignaturas(searchTerm).filter(asig => 
        asignaturas.some(a => a.codigo === asig.codigo)
      )
    }

    // Filtro por tipología
    if (selectedTipologia !== 'todas') {
      filtered = filtered.filter(asig => asig.tipologia === selectedTipologia)
    }

    // Filtro por créditos
    if (selectedCreditos !== 'todos') {
      filtered = filtered.filter(asig => asig.creditos === parseInt(selectedCreditos))
    }

    setFilteredAsignaturas(filtered)
  }, [searchTerm, selectedTipologia, selectedCreditos, asignaturas])

  const tipologias = AsignaturasService.getTipologias()

  const handleSelectAsignatura = (asignatura) => {
    onSelectAsignatura(asignatura)
    onClose()
  }

  const getTipologiaInfo = (tipologia) => {
    return tipologias[tipologia] || { nombre: tipologia, color: '#6b7280' }
  }

  if (!isOpen) return null

  return (
    <Modal onClose={onClose}>
      <div style={{ width: '800px', maxWidth: '90vw' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Seleccionar Asignatura
        </h2>

        {/* Filtros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 120px', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, código o área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={selectedTipologia}
            onChange={(e) => setSelectedTipologia(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="todas">Todas las tipologías</option>
            {Object.entries(tipologias).map(([key, tipologia]) => (
              <option key={key} value={key}>
                {tipologia.nombre}
              </option>
            ))}
          </select>

          <select
            value={selectedCreditos}
            onChange={(e) => setSelectedCreditos(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="todos">Todos</option>
            <option value="2">2 créditos</option>
            <option value="3">3 créditos</option>
            <option value="4">4 créditos</option>
          </select>
        </div>

        {/* Lista de asignaturas */}
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '8px'
        }}>
          {filteredAsignaturas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No se encontraron asignaturas disponibles
            </div>
          ) : (
            filteredAsignaturas.map((asignatura) => {
              const tipologiaInfo = getTipologiaInfo(asignatura.tipologia)
              
              return (
                <div
                  key={asignatura.codigo}
                  onClick={() => handleSelectAsignatura(asignatura)}
                  style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb'
                    e.target.style.borderColor = '#57844A'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                    e.target.style.borderColor = '#e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                          {asignatura.nombre}
                        </h3>
                        <span style={{
                          backgroundColor: tipologiaInfo.color,
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          {tipologiaInfo.nombre}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                        <strong>Código:</strong> {asignatura.codigo} | 
                        <strong> Créditos:</strong> {asignatura.creditos} | 
                        <strong> Área:</strong> {asignatura.area_conocimiento}
                      </div>

                      {asignatura.prerrequisitos.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#dc2626' }}>
                          <strong>Prerrequisitos:</strong> {asignatura.prerrequisitos.map(codigo => {
                            const prereq = AsignaturasService.getAsignaturaPorCodigo(codigo)
                            return prereq ? prereq.nombre : codigo
                          }).join(', ')}
                        </div>
                      )}

                      <p style={{ fontSize: '13px', color: '#4b5563', margin: '8px 0 0 0' }}>
                        {asignatura.descripcion}
                      </p>
                    </div>
                    
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#57844A' }}>
                      {asignatura.creditos}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {filteredAsignaturas.length} asignaturas disponibles
          </div>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AsignaturasModal

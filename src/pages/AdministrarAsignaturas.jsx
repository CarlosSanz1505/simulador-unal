import { useEffect, useState } from 'react';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Footer from '../components/organisms/Footer';
import Header from '../components/organisms/Header';
import ImportarAsignaturasModal from '../components/organisms/ImportarAsignaturasModal';
import asignaturasService from '../data/asignaturasService';

const AdministrarAsignaturas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [filtroTipologia, setFiltroTipologia] = useState('todas');
  const [termino, setTermino] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const stats = asignaturasService.getEstadisticas();
    setEstadisticas(stats);
    
    let asignaturasFiltered = asignaturasService.getTodasAsignaturas();
    
    if (filtroTipologia !== 'todas') {
      asignaturasFiltered = asignaturasService.getAsignaturasPorTipologia(filtroTipologia);
    }
    
    if (termino) {
      asignaturasFiltered = asignaturasService.buscarAsignaturas(termino);
    }
    
    setAsignaturas(asignaturasFiltered);
  };

  useEffect(() => {
    cargarDatos();
  }, [filtroTipologia, termino]);

  const handleImportSuccess = (resultado) => {
    setMensaje(`✅ Importación exitosa: ${resultado.exitosas.length} asignaturas agregadas`);
    cargarDatos();
    setTimeout(() => setMensaje(''), 5000);
  };

  const exportarDatos = () => {
    const datos = asignaturasService.exportarAsignaturas();
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asignaturas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMensaje('✅ Datos exportados exitosamente');
    setTimeout(() => setMensaje(''), 3000);
  };

  if (!estadisticas) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="admin-page">
      <Header />
      
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Administrar Asignaturas</h1>
            <p>Gestiona la base de datos de asignaturas del simulador</p>
          </div>

          {mensaje && (
            <div className="mensaje-exito">
              {mensaje}
            </div>
          )}

          {/* Estadísticas */}
          <section className="estadisticas-section">
            <h2>Estadísticas</h2>
            <div className="stats-grid">
              <Card>
                <div className="stat-card">
                  <h3>Total de Asignaturas</h3>
                  <div className="stat-number">{estadisticas.total}</div>
                </div>
              </Card>
              
              <Card>
                <div className="stat-card">
                  <h3>Promedio de Créditos</h3>
                  <div className="stat-number">{estadisticas.promedio_creditos}</div>
                </div>
              </Card>
            </div>

            <div className="tipologias-stats">
              <h3>Por Tipología</h3>
              <div className="tipologias-grid">
                {Object.entries(estadisticas.por_tipologia).map(([tipologia, count]) => (
                  <div key={tipologia} className="tipologia-stat">
                    <span className="tipologia-name">{tipologia.replace('_', ' ')}</span>
                    <span className="tipologia-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Acciones */}
          <section className="acciones-section">
            <h2>Acciones</h2>
            <div className="acciones-grid">
              <Button 
                onClick={() => setShowImportModal(true)}
                variant="primary"
              >
                📤 Importar desde HTML
              </Button>
              
              <Button 
                onClick={exportarDatos}
                variant="secondary"
              >
                💾 Exportar Datos
              </Button>
            </div>
          </section>

          {/* Filtros */}
          <section className="filtros-section">
            <h2>Buscar y Filtrar</h2>
            <div className="filtros-grid">
              <div className="filtro-grupo">
                <label htmlFor="buscar">Buscar:</label>
                <input
                  id="buscar"
                  type="text"
                  placeholder="Nombre o código..."
                  value={termino}
                  onChange={(e) => setTermino(e.target.value)}
                />
              </div>
              
              <div className="filtro-grupo">
                <label htmlFor="tipologia">Tipología:</label>
                <select
                  id="tipologia"
                  value={filtroTipologia}
                  onChange={(e) => setFiltroTipologia(e.target.value)}
                >
                  <option value="todas">Todas</option>
                  <option value="fundamentacion_obligatoria">Fundamentación Obligatoria</option>
                  <option value="fundamentacion_optativa">Fundamentación Optativa</option>
                  <option value="disciplinar_obligatoria">Disciplinar Obligatoria</option>
                  <option value="disciplinar_optativa">Disciplinar Optativa</option>
                  <option value="libre_eleccion">Libre Elección</option>
                  <option value="nivelacion">Nivelación</option>
                </select>
              </div>
            </div>
          </section>

          {/* Lista de Asignaturas */}
          <section className="asignaturas-section">
            <h2>Asignaturas ({asignaturas.length})</h2>
            <div className="asignaturas-list">
              {asignaturas.map((asignatura) => (
                <Card key={asignatura.codigo}>
                  <div className="asignatura-item">
                    <div className="asignatura-info">
                      <h4>{asignatura.nombre}</h4>
                      <div className="asignatura-details">
                        <span className="codigo">Código: {asignatura.codigo}</span>
                        <span className="creditos">Créditos: {asignatura.creditos}</span>
                        <span className={`tipologia tipologia-${asignatura.tipologia}`}>
                          {asignatura.tipologia.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="descripcion">{asignatura.descripcion}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <ImportarAsignaturasModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
      />

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .admin-main {
          padding: 20px 0;
          min-height: calc(100vh - 140px);
        }

        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 30px;
          color: white;
        }

        .admin-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .mensaje-exito {
          background-color: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: bold;
        }

        .estadisticas-section,
        .acciones-section,
        .filtros-section,
        .asignaturas-section {
          margin-bottom: 30px;
        }

        .estadisticas-section h2,
        .acciones-section h2,
        .filtros-section h2,
        .asignaturas-section h2 {
          color: white;
          margin-bottom: 15px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          text-align: center;
          padding: 20px;
        }

        .stat-card h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2A5490;
        }

        .tipologias-stats {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        .tipologias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        .tipologia-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
        }

        .tipologia-name {
          text-transform: capitalize;
          font-weight: 500;
        }

        .tipologia-count {
          background: #2A5490;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.9rem;
        }

        .acciones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .filtros-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        .filtros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .filtro-grupo {
          display: flex;
          flex-direction: column;
        }

        .filtro-grupo label {
          margin-bottom: 5px;
          font-weight: 500;
        }

        .filtro-grupo input,
        .filtro-grupo select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }

        .asignaturas-list {
          display: grid;
          gap: 15px;
        }

        .asignatura-item {
          padding: 15px;
        }

        .asignatura-info h4 {
          margin-bottom: 10px;
          color: #333;
        }

        .asignatura-details {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .codigo,
        .creditos {
          font-size: 0.9rem;
          color: #666;
        }

        .tipologia {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .tipologia-fundamentacion_obligatoria {
          background: #fee2e2;
          color: #dc2626;
        }

        .tipologia-fundamentacion_optativa {
          background: #dbeafe;
          color: #2563eb;
        }

        .tipologia-disciplinar_obligatoria {
          background: #ecfdf5;
          color: #16a34a;
        }

        .tipologia-disciplinar_optativa {
          background: #fef3c7;
          color: #d97706;
        }

        .tipologia-libre_eleccion {
          background: #f0fdf4;
          color: #059669;
        }

        .tipologia-nivelacion {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .descripcion {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .admin-header h1 {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .acciones-grid {
            grid-template-columns: 1fr;
          }

          .filtros-grid {
            grid-template-columns: 1fr;
          }

          .asignatura-details {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdministrarAsignaturas;

import { useRef, useState } from 'react';
import asignaturasService from '../../data/asignaturasService';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';

const ImportarAsignaturasModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.name.toLowerCase().endsWith('.html')) {
      alert('Por favor selecciona un archivo HTML válido');
      return;
    }

    setIsLoading(true);
    setImportResult(null);

    try {
      const resultado = await asignaturasService.importarDesdeHTML(file, 'nivelacion');
      setImportResult(resultado);
      
      if (resultado.exitosas.length > 0) {
        onImportSuccess?.(resultado);
      }
    } catch (error) {
      console.error('Error al importar:', error);
      setImportResult({
        exitosas: [],
        errores: [{ error: error.message }],
        mensaje: `Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Asignaturas">
      <div className="import-modal-content">
        <div className="import-instructions">
          <h3>Instrucciones para importar asignaturas</h3>
          <ul>
            <li>Selecciona un archivo HTML que contenga una tabla con las asignaturas</li>
            <li>La tabla debe tener las columnas: Código, Nombre, Créditos, Tipología, Descripción</li>
            <li>Las asignaturas se importarán como tipo "nivelación"</li>
            <li>Se validarán los datos antes de agregarlos a la base de datos</li>
          </ul>
        </div>

        <div className="file-input-section">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <Button
            onClick={handleSelectFile}
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? 'Procesando...' : 'Seleccionar archivo HTML'}
          </Button>
        </div>

        {importResult && (
          <div className="import-results">
            <h3>Resultados de la importación</h3>
            <div className="result-summary">
              <p><strong>{importResult.mensaje}</strong></p>
              
              {importResult.exitosas.length > 0 && (
                <div className="success-section">
                  <h4>✅ Asignaturas importadas exitosamente ({importResult.exitosas.length})</h4>
                  <div className="success-list">
                    {importResult.exitosas.slice(0, 5).map((asignatura, index) => (
                      <div key={index} className="import-item success">
                        <strong>{asignatura.codigo}</strong> - {asignatura.nombre} ({asignatura.creditos} créditos)
                      </div>
                    ))}
                    {importResult.exitosas.length > 5 && (
                      <div className="more-items">
                        ... y {importResult.exitosas.length - 5} más
                      </div>
                    )}
                  </div>
                </div>
              )}

              {importResult.errores.length > 0 && (
                <div className="error-section">
                  <h4>❌ Errores encontrados ({importResult.errores.length})</h4>
                  <div className="error-list">
                    {importResult.errores.slice(0, 5).map((error, index) => (
                      <div key={index} className="import-item error">
                        <strong>Error:</strong> {error.error}
                        {error.asignatura && (
                          <div>Asignatura: {error.asignatura.codigo} - {error.asignatura.nombre}</div>
                        )}
                      </div>
                    ))}
                    {importResult.errores.length > 5 && (
                      <div className="more-items">
                        ... y {importResult.errores.length - 5} errores más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <Button onClick={handleClose} variant="secondary">
            Cerrar
          </Button>
        </div>
      </div>

      <style jsx>{`
        .import-modal-content {
          max-width: 600px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .import-instructions {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
          border-left: 4px solid #007bff;
        }

        .import-instructions h3 {
          margin-top: 0;
          color: #007bff;
        }

        .import-instructions ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .import-instructions li {
          margin-bottom: 5px;
          line-height: 1.4;
        }

        .file-input-section {
          text-align: center;
          margin: 20px 0;
        }

        .import-results {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }

        .import-results h3 {
          margin-top: 0;
          color: #333;
        }

        .result-summary {
          margin-top: 10px;
        }

        .success-section, .error-section {
          margin: 15px 0;
        }

        .success-section h4 {
          color: #28a745;
          margin-bottom: 10px;
        }

        .error-section h4 {
          color: #dc3545;
          margin-bottom: 10px;
        }

        .success-list, .error-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .import-item {
          padding: 8px 12px;
          margin-bottom: 5px;
          border-radius: 3px;
          font-size: 14px;
        }

        .import-item.success {
          background-color: #d4edda;
          border-left: 3px solid #28a745;
        }

        .import-item.error {
          background-color: #f8d7da;
          border-left: 3px solid #dc3545;
        }

        .more-items {
          padding: 8px 12px;
          font-style: italic;
          color: #666;
        }

        .modal-actions {
          margin-top: 20px;
          text-align: right;
        }
      `}</style>
    </Modal>
  );
};

export default ImportarAsignaturasModal;

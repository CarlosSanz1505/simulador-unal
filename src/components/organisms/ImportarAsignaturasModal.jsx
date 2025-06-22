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
      <div className="max-w-2xl max-h-[70vh] overflow-y-auto">
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Instrucciones para importar asignaturas</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Selecciona un archivo HTML que contenga una tabla con las asignaturas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>La tabla debe tener las columnas: Código, Nombre, Créditos, Tipología, Descripción</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Las asignaturas se importarán como tipo "nivelación"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Se validarán los datos antes de agregarlos a la base de datos</span>
            </li>
          </ul>
        </div>

        <div className="text-center my-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            onClick={handleSelectFile}
            disabled={isLoading}
            variant="primary"
            className="px-6 py-3"
          >
            {isLoading ? 'Procesando...' : 'Seleccionar archivo HTML'}
          </Button>
        </div>

        {importResult && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultados de la importación</h3>
            <div>
              <p className="font-medium text-gray-700 mb-4">{importResult.mensaje}</p>
              
              {importResult.exitosas.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-base font-semibold text-green-700 mb-3">
                    ✅ Asignaturas importadas exitosamente ({importResult.exitosas.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {importResult.exitosas.slice(0, 5).map((asignatura, index) => (
                      <div key={index} className="p-3 bg-green-50 border-l-3 border-green-400 rounded text-sm">
                        <span className="font-medium">{asignatura.codigo}</span> - {asignatura.nombre} ({asignatura.creditos} créditos)
                      </div>
                    ))}
                    {importResult.exitosas.length > 5 && (
                      <div className="p-2 text-center text-gray-500 italic text-sm">
                        ... y {importResult.exitosas.length - 5} más
                      </div>
                    )}
                  </div>
                </div>
              )}

              {importResult.errores.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-red-700 mb-3">
                    ❌ Errores encontrados ({importResult.errores.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {importResult.errores.slice(0, 5).map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 border-l-3 border-red-400 rounded text-sm">
                        <div className="font-medium text-red-800">Error: {error.error}</div>
                        {error.asignatura && (
                          <div className="text-red-600 mt-1">
                            Asignatura: {error.asignatura.codigo} - {error.asignatura.nombre}
                          </div>
                        )}
                      </div>
                    ))}
                    {importResult.errores.length > 5 && (
                      <div className="p-2 text-center text-gray-500 italic text-sm">
                        ... y {importResult.errores.length - 5} errores más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleClose} variant="secondary" className="px-6">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportarAsignaturasModal;

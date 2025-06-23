/**
 * Utilidad para convertir tablas HTML de materias a formato JSON
 * Compatible con el formato de asignaturas del simulador UNAL
 */

/**
 * Extrae datos de una tabla HTML y los convierte al formato JSON de asignaturas
 * @param {string} htmlContent - Contenido HTML del archivo
 * @param {string} tipologia - Tipología de las materias (ej: "nivelacion")
 * @returns {Array} Array de objetos con formato de asignatura
 */
export function convertHtmlTableToAsignaturas(htmlContent, tipologia = "nivelacion") {
  try {
    // Crear un parser DOM temporal
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Buscar todas las tablas en el documento
    const tables = doc.querySelectorAll('table');
    const asignaturas = [];
    
    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      
      // Buscar la fila de encabezados para identificar las columnas
      let headerRowIndex = -1;
      let columnMapping = {};
      
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('th, td');
        const cellTexts = Array.from(cells).map(cell => 
          cell.textContent.trim().toLowerCase()
        );
        
        // Verificar si esta fila contiene los encabezados esperados
        if (cellTexts.some(text => 
          text.includes('código') || text.includes('codigo') ||
          text.includes('nombre') || text.includes('créditos') || 
          text.includes('creditos') || text.includes('tipología') ||
          text.includes('tipologia')
        )) {
          headerRowIndex = i;
          
          // Mapear las columnas
          cellTexts.forEach((text, index) => {
            if (text.includes('código') || text.includes('codigo')) {
              columnMapping.codigo = index;
            } else if (text.includes('nombre') && !text.includes('tipología')) {
              columnMapping.nombre = index;
            } else if (text.includes('créditos') || text.includes('creditos')) {
              columnMapping.creditos = index;
            } else if (text.includes('tipología') || text.includes('tipologia')) {
              columnMapping.tipologiaCol = index;
            } else if (text.includes('descripción') || text.includes('descripcion')) {
              columnMapping.descripcion = index;
            }
          });
          break;
        }
      }
      
      // Si no encontramos encabezados, asumir orden estándar
      if (headerRowIndex === -1) {
        console.warn('No se encontraron encabezados específicos, asumiendo orden: Código, Nombre, Créditos, Tipología, Descripción');
        columnMapping = {
          codigo: 0,
          nombre: 1,
          creditos: 2,
          tipologiaCol: 3,
          descripcion: 4
        };
        headerRowIndex = 0;
      }
      
      // Procesar las filas de datos (después de los encabezados)
      for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td, th');
        
        if (cells.length < 4) continue; // Saltar filas con pocas columnas
        
        const codigo = cells[columnMapping.codigo]?.textContent.trim() || '';
        const nombre = cells[columnMapping.nombre]?.textContent.trim() || '';
        const creditosText = cells[columnMapping.creditos]?.textContent.trim() || '0';
        const descripcion = cells[columnMapping.descripcion]?.textContent.trim() || '';
        
        // Validar que al menos tengamos código y nombre
        if (!codigo || !nombre || codigo === 'Código' || nombre === 'Nombre') {
          continue;
        }
        
        // Convertir créditos a número
        let creditos = 0;
        const creditosMatch = creditosText.match(/\d+/);
        if (creditosMatch) {
          creditos = parseInt(creditosMatch[0], 10);
        }
        
        // Crear objeto asignatura
        const asignatura = {
          codigo: codigo,
          nombre: nombre,
          creditos: creditos,
          tipologia: tipologia,
          prerrequisitos: [],
          correrquisitos: [],
          semestre_recomendado: null,
          area_conocimiento: "Nivelación",
          facultad: "Universidad Nacional",
          disponible: true,
          descripcion: descripcion || `Materia de nivelación: ${nombre}`
        };
        
        asignaturas.push(asignatura);
      }
    });
    
    console.log(`Extraídas ${asignaturas.length} asignaturas de nivelación`);
    return asignaturas;
    
  } catch (error) {
    console.error('Error al procesar el HTML:', error);
    return [];
  }
}

/**
 * Lee un archivo HTML y extrae las asignaturas
 * @param {File} file - Archivo HTML
 * @param {string} tipologia - Tipología de las materias
 * @returns {Promise<Array>} Promise que resuelve con el array de asignaturas
 */
export function processHtmlFile(file, tipologia = "nivelacion") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const htmlContent = e.target.result;
        const asignaturas = convertHtmlTableToAsignaturas(htmlContent, tipologia);
        resolve(asignaturas);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Valida una asignatura antes de agregarla a la base de datos
 * @param {Object} asignatura - Objeto asignatura a validar
 * @returns {boolean} true si la asignatura es válida
 */
export function validarAsignatura(asignatura) {
  return (
    asignatura &&
    typeof asignatura.codigo === 'string' &&
    asignatura.codigo.length > 0 &&
    typeof asignatura.nombre === 'string' &&
    asignatura.nombre.length > 0 &&
    typeof asignatura.creditos === 'number' &&
    asignatura.creditos >= 0 &&
    typeof asignatura.tipologia === 'string' &&
    asignatura.tipologia.length > 0
  );
}

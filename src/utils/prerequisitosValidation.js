import { asignaturas } from '../data/asignaturas.json'

/**
 * Valida si una asignatura puede ser agregada según sus prerrequisitos
 * @param {string} codigoAsignatura - Código de la asignatura a validar
 * @param {Array} asignaturasAprobadas - Array de códigos de asignaturas ya aprobadas/cursadas
 * @returns {Object} - { esValida: boolean, prerequisitosFaltantes: Array }
 */
export function validarPrerequisitos(codigoAsignatura, asignaturasAprobadas) {
  console.log('🔍 Validando prerrequisitos para:', codigoAsignatura)
  console.log('🔍 Asignaturas aprobadas recibidas:', asignaturasAprobadas)
  
  // Buscar la asignatura
  const asignatura = asignaturas.find(a => a.codigo === codigoAsignatura)
  
  if (!asignatura) {
    console.log('❌ Asignatura no encontrada')
    return { esValida: false, prerequisitosFaltantes: [], error: 'Asignatura no encontrada' }
  }

  console.log('🔍 Asignatura encontrada:', asignatura.nombre)
  console.log('🔍 Prerrequisitos de la asignatura:', asignatura.prerrequisitos)

  // Si no tiene prerrequisitos, es válida
  if (!asignatura.prerrequisitos || asignatura.prerrequisitos.length === 0) {
    console.log('✅ Sin prerrequisitos, válida')
    return { esValida: true, prerequisitosFaltantes: [] }
  }

  // Verificar cada prerrequisito
  const prerequisitosFaltantes = []
  
  asignatura.prerrequisitos.forEach(codigoPrereq => {
    console.log('🔍 Verificando prerrequisito:', codigoPrereq)
    console.log('🔍 ¿Está en aprobadas?', asignaturasAprobadas.includes(codigoPrereq))
    
    // Si el prerrequisito no está en las asignaturas aprobadas
    if (!asignaturasAprobadas.includes(codigoPrereq)) {
      const prereqInfo = asignaturas.find(a => a.codigo === codigoPrereq)
      if (prereqInfo) {
        prerequisitosFaltantes.push({
          codigo: prereqInfo.codigo,
          nombre: prereqInfo.nombre,
          creditos: prereqInfo.creditos,
          tipologia: prereqInfo.tipologia
        })
      }
    }
  })

  console.log('🔍 Prerrequisitos faltantes:', prerequisitosFaltantes)
  const esValida = prerequisitosFaltantes.length === 0
  console.log('🔍 ¿Es válida?', esValida)

  return {
    esValida,
    prerequisitosFaltantes
  }
}

/**
 * Obtiene todas las asignaturas cursadas/aprobadas de una simulación
 * @param {Object} simulacion - Objeto de simulación completo
 * @returns {Array} - Array de códigos de asignaturas
 */
export function obtenerAsignaturasAprobadas(simulacion) {
  const asignaturasAprobadas = []
  
  // Recorrer todas las matrículas
  simulacion.matriculas.forEach(matricula => {
    matricula.asignaturas.forEach(asignatura => {
      if (!asignaturasAprobadas.includes(asignatura.codigo)) {
        asignaturasAprobadas.push(asignatura.codigo)
      }
    })
  })
  
  return asignaturasAprobadas
}

/**
 * Obtiene todas las asignaturas cursadas hasta una matrícula específica (excluyendo la actual)
 * @param {Object} simulacion - Objeto de simulación completo
 * @param {number} posicionMatriculaActual - Posición de la matrícula actual
 * @returns {Array} - Array de códigos de asignaturas
 */
export function obtenerAsignaturasAprobadasHasta(simulacion, posicionMatriculaActual) {
  const asignaturasAprobadas = []
  
  // Solo incluir matrículas anteriores a la actual
  simulacion.matriculas
    .filter(matricula => matricula.posicion < posicionMatriculaActual)
    .forEach(matricula => {
      matricula.asignaturas.forEach(asignatura => {
        if (!asignaturasAprobadas.includes(asignatura.codigo)) {
          asignaturasAprobadas.push(asignatura.codigo)
        }
      })
    })
  
  return asignaturasAprobadas
}

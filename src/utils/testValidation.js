// Archivo temporal para probar la validación
import { validarPrerequisitos } from './prerequisitosValidation.js'

// Simular que no hay asignaturas aprobadas (primer semestre)
const asignaturasAprobadas = []

// Probar con INGLÉS II que requiere INGLÉS I
const resultado = validarPrerequisitos('1000045-M', asignaturasAprobadas)

console.log('=== PRUEBA DE VALIDACIÓN ===')
console.log('Código a validar: 1000045-M (INGLÉS II)')
console.log('Asignaturas aprobadas:', asignaturasAprobadas)
console.log('Resultado:', resultado)
console.log('=============================')

export default resultado

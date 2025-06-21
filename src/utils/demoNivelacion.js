// Script de demostración para procesar materias de nivelación
// Este script simula el procesamiento del archivo HTML de materias de nivelación

const materiasNivelacionDemo = [
  {
    codigo: "1000201",
    nombre: "Precálculo",
    creditos: 4,
    descripcion: "Revisión de conceptos básicos de álgebra, trigonometría y geometría analítica necesarios para cursos de cálculo."
  },
  {
    codigo: "1000202",
    nombre: "Álgebra Básica",
    creditos: 3,
    descripcion: "Operaciones básicas con números reales, polinomios, factorización y ecuaciones lineales."
  },
  {
    codigo: "1000203",
    nombre: "Geometría Analítica",
    creditos: 3,
    descripcion: "Estudio de puntos, rectas, circunferencias y secciones cónicas en el plano cartesiano."
  },
  {
    codigo: "1000204",
    nombre: "Trigonometría",
    creditos: 2,
    descripcion: "Funciones trigonométricas, identidades trigonométricas y aplicaciones."
  },
  {
    codigo: "1000205",
    nombre: "Física Mecánica Básica",
    creditos: 4,
    descripcion: "Conceptos fundamentales de mecánica: cinemática, dinámica, trabajo y energía."
  },
  {
    codigo: "1000206",
    nombre: "Química General Básica",
    creditos: 3,
    descripcion: "Estructura atómica, tabla periódica, enlaces químicos y reacciones básicas."
  },
  {
    codigo: "1000207",
    nombre: "Comprensión Lectora",
    creditos: 2,
    descripcion: "Desarrollo de habilidades de comprensión lectora y análisis de textos académicos."
  },
  {
    codigo: "1000208",
    nombre: "Producción Textual",
    creditos: 2,
    descripcion: "Técnicas de redacción académica, estructura de textos y normas de citación."
  },
  {
    codigo: "1000209",
    nombre: "Razonamiento Lógico",
    creditos: 2,
    descripcion: "Desarrollo del pensamiento lógico y habilidades de razonamiento matemático."
  },
  {
    codigo: "1000210",
    nombre: "Métodos de Estudio",
    creditos: 1,
    descripcion: "Técnicas de estudio, organización del tiempo y estrategias de aprendizaje para la vida universitaria."
  }
];

/**
 * Función para convertir las materias de demo al formato JSON requerido
 */
function convertirMateriasNivelacion() {
  return materiasNivelacionDemo.map(materia => ({
    codigo: materia.codigo,
    nombre: materia.nombre,
    creditos: materia.creditos,
    tipologia: "nivelacion",
    prerrequisitos: [],
    correrquisitos: [],
    semestre_recomendado: null,
    area_conocimiento: "Nivelación",
    facultad: "Universidad Nacional",
    disponible: true,
    descripcion: materia.descripcion
  }));
}

/**
 * Función para mostrar las materias convertidas
 */
function mostrarMateriasConvertidas() {
  const materias = convertirMateriasNivelacion();
  console.log("Materias de nivelación convertidas:");
  console.log(JSON.stringify(materias, null, 2));
  return materias;
}

/**
 * Función para simular la importación desde HTML
 */
function simularImportacionHTML() {
  const materias = convertirMateriasNivelacion();
  
  console.log(`✅ Simulación de importación completada:`);
  console.log(`   - Total de materias procesadas: ${materias.length}`);
  console.log(`   - Materias de nivelación: ${materias.length}`);
  console.log(`   - Créditos totales: ${materias.reduce((sum, m) => sum + m.creditos, 0)}`);
  
  // Mostrar resumen por créditos
  const porCreditos = materias.reduce((acc, materia) => {
    acc[materia.creditos] = (acc[materia.creditos] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`   - Distribución por créditos:`, porCreditos);
  
  return {
    exitosas: materias,
    errores: [],
    mensaje: `Se procesaron ${materias.length} materias de nivelación exitosamente`
  };
}

// Ejecutar demostración
if (typeof window !== 'undefined') {
  // En el navegador
  window.demoNivelacion = {
    materias: materiasNivelacionDemo,
    convertir: convertirMateriasNivelacion,
    mostrar: mostrarMateriasConvertidas,
    simular: simularImportacionHTML
  };
  
  console.log("Demo de nivelación cargado. Usa window.demoNivelacion para interactuar.");
} else {
  // En Node.js
  module.exports = {
    materiasNivelacionDemo,
    convertirMateriasNivelacion,
    mostrarMateriasConvertidas,
    simularImportacionHTML
  };
}

// Ejemplo de uso:
// const resultado = simularImportacionHTML();
// console.log(resultado);

import AsignaturasService from '../data/asignaturasService';

export function getPrerequisitosFaltantes(asignatura, asignaturasAprobadas) {
  if (!asignatura.prerrequisitos || asignatura.prerrequisitos.length === 0) return [];
  return asignatura.prerrequisitos.filter(pr =>
    !asignaturasAprobadas.includes(pr)
  ).map(codigo => {
    const info = AsignaturasService.getAsignaturaPorCodigo(codigo);
    return info
      ? { codigo: info.codigo, nombre: info.nombre }
      : { codigo, nombre: 'Asignatura no encontrada' };
  });
}

export function recalcularErroresMatriculas(matriculas) {
  let aprobadasHasta = [];
  
  // IMPORTANTE: Ordenar matrículas por posición antes de procesar para validar prerrequisitos correctamente
  const matriculasOrdenadas = [...matriculas].sort((a, b) => a.posicion - b.posicion);
  
  // Crear un mapa para guardar las validaciones procesadas
  const matriculasValidadas = {};
  
  matriculasOrdenadas.forEach(matricula => {
    // CORREGIDO: Primero validar cada asignatura con solo las matrículas ANTERIORES
    const matriculaConErrores = {
      ...matricula,
      asignaturas: matricula.asignaturas.map(asig => {
        const faltantes = getPrerequisitosFaltantes(asig, aprobadasHasta);
        if (faltantes.length > 0) {
          return { ...asig, error: true, faltantes };
        }
        // Limpiar error si ahora cumple los prerrequisitos
        if (asig.error || asig.faltantes) {
          const limpio = { ...asig };
          delete limpio.error;
          delete limpio.faltantes;
          return limpio;
        }
        return asig;
      })
    };
    
    // Guardar la matrícula validada usando su id como clave
    matriculasValidadas[matricula.id] = matriculaConErrores;
    
    // DESPUÉS de validar, agregar las asignaturas de esta matrícula a las aprobadas
    aprobadasHasta = [
      ...aprobadasHasta,
      ...matricula.asignaturas.map(a => a.codigo)
    ];
  });
  
  // Devolver las matrículas en el ORDEN ORIGINAL, pero con las validaciones aplicadas
  return matriculas.map(matricula => matriculasValidadas[matricula.id]);
}
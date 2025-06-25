import AsignaturasService from '../data/asignaturasService'

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
  return matriculas.map(matricula => {
    aprobadasHasta = [
      ...aprobadasHasta,
      ...matricula.asignaturas.map(a => a.codigo)
    ];
    return {
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
    }
  });
}
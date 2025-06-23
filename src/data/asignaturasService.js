// src/data/asignaturasService.js
import { processHtmlFile, validarAsignatura } from '../utils/htmlToJsonConverter.js';
import asignaturasData from './asignaturas.json';

class AsignaturasService {
  constructor() {
    this.asignaturas = asignaturasData.asignaturas;
    this.tipologias = asignaturasData.tipologias;
    this.configuracion = asignaturasData.configuracion;
  }

  // Obtener todas las asignaturas
  getTodasAsignaturas() {
    return this.asignaturas;
  }

  // Obtener asignatura por código
  getAsignaturaPorCodigo(codigo) {
    return this.asignaturas.find(asig => asig.codigo === codigo);
  }

  // Buscar asignaturas por nombre o código
  buscarAsignaturas(termino) {
    const terminoLower = termino.toLowerCase();
    return this.asignaturas.filter(asig => 
      asig.nombre.toLowerCase().includes(terminoLower) ||
      asig.codigo.toLowerCase().includes(terminoLower) ||
      asig.area_conocimiento.toLowerCase().includes(terminoLower)
    );
  }

  // Filtrar por tipología
  getAsignaturasPorTipologia(tipologia) {
    return this.asignaturas.filter(asig => asig.tipologia === tipologia);
  }

  // Filtrar por número de créditos
  getAsignaturasPorCreditos(creditos) {
    return this.asignaturas.filter(asig => asig.creditos === creditos);
  }

  // Filtrar por semestre recomendado
  getAsignaturasPorSemestre(semestre) {
    return this.asignaturas.filter(asig => asig.semestre_recomendado === semestre);
  }

  // Verificar prerrequisitos
  verificarPrerrequisitos(codigoAsignatura, asignaturasAprobadas) {
    const asignatura = this.getAsignaturaPorCodigo(codigoAsignatura);
    if (!asignatura) return { valido: false, mensaje: 'Asignatura no encontrada' };

    const prerrequisitosNoSatisfechos = asignatura.prerrequisitos.filter(
      pre => !asignaturasAprobadas.includes(pre)
    );

    if (prerrequisitosNoSatisfechos.length > 0) {
      const nombresPrereq = prerrequisitosNoSatisfechos.map(codigo => {
        const asig = this.getAsignaturaPorCodigo(codigo);
        return asig ? asig.nombre : codigo;
      });
      
      return {
        valido: false,
        mensaje: `Faltan prerrequisitos: ${nombresPrereq.join(', ')}`,
        prerrequisitos_faltantes: prerrequisitosNoSatisfechos
      };
    }

    return { valido: true, mensaje: 'Prerrequisitos satisfechos' };
  }

  // Verificar correrrequisitos
  verificarCorrerrequisitos(codigoAsignatura, asignaturasMatricula) {
    const asignatura = this.getAsignaturaPorCodigo(codigoAsignatura);
    if (!asignatura) return { valido: false, mensaje: 'Asignatura no encontrada' };

    const correrquisitosNoPresentes = asignatura.correrquisitos.filter(
      co => !asignaturasMatricula.includes(co)
    );

    if (correrquisitosNoPresentes.length > 0) {
      const nombresCorreq = correrquisitosNoPresentes.map(codigo => {
        const asig = this.getAsignaturaPorCodigo(codigo);
        return asig ? asig.nombre : codigo;
      });
      
      return {
        valido: false,
        mensaje: `Faltan correrrequisitos: ${nombresCorreq.join(', ')}`,
        correrrequisitos_faltantes: correrquisitosNoPresentes
      };
    }

    return { valido: true, mensaje: 'Correrrequisitos satisfechos' };
  }

  // Calcular créditos por tipología
  calcularCreditosPorTipologia(codigosAsignaturas) {
    const creditos = {
      fundamentacion_obligatoria: 0,
      fundamentacion_optativa: 0,
      disciplinar_obligatoria: 0,
      disciplinar_optativa: 0,
      libre_eleccion: 0,
      total: 0
    };

    codigosAsignaturas.forEach(codigo => {
      const asignatura = this.getAsignaturaPorCodigo(codigo);
      if (asignatura) {
        creditos[asignatura.tipologia] += asignatura.creditos;
        creditos.total += asignatura.creditos;
      }
    });

    return creditos;
  }

  // Obtener asignaturas disponibles (que cumplen prerrequisitos)
  getAsignaturasDisponibles(asignaturasAprobadas, asignaturasMatricula = []) {
    return this.asignaturas.filter(asignatura => {
      // No incluir asignaturas ya aprobadas o ya en matrícula
      if (asignaturasAprobadas.includes(asignatura.codigo) || 
          asignaturasMatricula.includes(asignatura.codigo)) {
        return false;
      }

      // Verificar prerrequisitos
      const prereq = this.verificarPrerrequisitos(asignatura.codigo, asignaturasAprobadas);
      return prereq.valido;
    });
  }

  // Obtener información de tipologías
  getTipologias() {
    return this.tipologias;
  }

  // Obtener configuración del programa
  getConfiguracion() {
    return this.configuracion;
  }

  // Validar matrícula completa
  validarMatricula(codigosAsignaturas, asignaturasAprobadas) {
    const errores = [];
    const advertencias = [];
    let creditosTotales = 0;

    codigosAsignaturas.forEach(codigo => {
      const asignatura = this.getAsignaturaPorCodigo(codigo);
      
      if (!asignatura) {
        errores.push(`Asignatura ${codigo} no encontrada`);
        return;
      }

      creditosTotales += asignatura.creditos;

      // Verificar prerrequisitos
      const prereq = this.verificarPrerrequisitos(codigo, asignaturasAprobadas);
      if (!prereq.valido) {
        errores.push(`${asignatura.nombre}: ${prereq.mensaje}`);
      }

      // Verificar correrrequisitos
      const correq = this.verificarCorrerrequisitos(codigo, codigosAsignaturas);
      if (!correq.valido) {
        advertencias.push(`${asignatura.nombre}: ${correq.mensaje}`);
      }
    });

    // Verificar límites de créditos
    if (creditosTotales > this.configuracion.creditos_maximos_por_semestre) {
      errores.push(`Excede el límite de créditos por semestre (${creditosTotales}/${this.configuracion.creditos_maximos_por_semestre})`);
    }

    if (creditosTotales < this.configuracion.creditos_minimos_por_semestre) {
      advertencias.push(`Por debajo del mínimo de créditos recomendado (${creditosTotales}/${this.configuracion.creditos_minimos_por_semestre})`);
    }

    return {
      valida: errores.length === 0,
      errores,
      advertencias,
      creditos_totales: creditosTotales
    };
  }

  // Agregar nueva asignatura
  agregarAsignatura(asignatura) {
    if (!validarAsignatura(asignatura)) {
      throw new Error('Asignatura inválida');
    }

    // Verificar que no exista ya
    if (this.getAsignaturaPorCodigo(asignatura.codigo)) {
      throw new Error(`Ya existe una asignatura con código ${asignatura.codigo}`);
    }

    this.asignaturas.push(asignatura);
    return asignatura;
  }

  // Agregar múltiples asignaturas
  agregarAsignaturas(asignaturas) {
    const resultados = {
      exitosas: [],
      errores: []
    };

    asignaturas.forEach(asignatura => {
      try {
        this.agregarAsignatura(asignatura);
        resultados.exitosas.push(asignatura);
      } catch (error) {
        resultados.errores.push({
          asignatura,
          error: error.message
        });
      }
    });

    return resultados;
  }

  // Importar asignaturas desde archivo HTML
  async importarDesdeHTML(file, tipologia = 'nivelacion') {
    try {
      const asignaturas = await processHtmlFile(file, tipologia);
      const resultados = this.agregarAsignaturas(asignaturas);
      
      console.log(`Importación completada: ${resultados.exitosas.length} exitosas, ${resultados.errores.length} errores`);
      
      return {
        ...resultados,
        mensaje: `Se importaron ${resultados.exitosas.length} asignaturas de ${asignaturas.length} procesadas`
      };
    } catch (error) {
      throw new Error(`Error al importar desde HTML: ${error.message}`);
    }
  }

  // Exportar asignaturas en formato JSON
  exportarAsignaturas() {
    return {
      asignaturas: this.asignaturas,
      tipologias: this.tipologias,
      configuracion: this.configuracion,
      metadata: {
        total_asignaturas: this.asignaturas.length,
        fecha_exportacion: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  // Obtener estadísticas de asignaturas
  getEstadisticas() {
    const estadisticas = {
      total: this.asignaturas.length,
      por_tipologia: {},
      por_creditos: {},
      promedio_creditos: 0
    };

    let totalCreditos = 0;

    this.asignaturas.forEach(asignatura => {
      // Por tipología
      if (!estadisticas.por_tipologia[asignatura.tipologia]) {
        estadisticas.por_tipologia[asignatura.tipologia] = 0;
      }
      estadisticas.por_tipologia[asignatura.tipologia]++;

      // Por créditos
      if (!estadisticas.por_creditos[asignatura.creditos]) {
        estadisticas.por_creditos[asignatura.creditos] = 0;
      }
      estadisticas.por_creditos[asignatura.creditos]++;

      totalCreditos += asignatura.creditos;
    });

    estadisticas.promedio_creditos = this.asignaturas.length > 0 
      ? (totalCreditos / this.asignaturas.length).toFixed(2) 
      : 0;

    return estadisticas;
  }
}

// Exportar instancia singleton
export default new AsignaturasService();

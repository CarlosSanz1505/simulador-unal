// src/data/mockData.js
import AsignaturasService from './asignaturasService.js';

// Función helper para obtener asignaturas por códigos
const getAsignaturasPorCodigos = (codigos) => {
  return codigos.map(codigo => AsignaturasService.getAsignaturaPorCodigo(codigo)).filter(Boolean);
};

export const simulacionesEjemplo = [
  {
    id: '1',
    nombre: 'Plan Principal',
    fechaCreacion: '2024-01-15',
    matriculas: [
      {
        id: 'm1',
        posicion: 1,
        asignaturas: getAsignaturasPorCodigos(['1000003-M', '1000004-M', '1000005-M'])
      },
      {
        id: 'm2', 
        posicion: 2,
        asignaturas: getAsignaturasPorCodigos(['1000006-M', '1000007-M'])
      },
      {
        id: 'm3',
        posicion: 3,
        asignaturas: getAsignaturasPorCodigos(['1000008-M', '1000009-M'])
      }
    ],
    creditos: {
      fundamentacion_obligatoria: 15,
      fundamentacion_optativa: 10,
      disciplinar_obligatoria: 10,
      disciplinar_optativa: 10,
      libreEleccion: 20,
      total: 25
    }
  },
  {
    id: '2',
    nombre: 'Plan Alternativo',
    fechaCreacion: '2024-02-10',
    matriculas: [
      {
        id: 'm4',
        posicion: 1,
        asignaturas: getAsignaturasPorCodigos(['1000003-M', '1000004-M', '1000005-M'])
      },
      {
        id: 'm5',
        posicion: 2,
        asignaturas: getAsignaturasPorCodigos(['1000002-M', '1000009-M'])
      }
    ],
    creditos: {
      fundamentacion_obligatoria: 14,
      fundamentacion_optativa: 0,
      disciplinar_obligatoria: 3,
      disciplinar_optativa: 0,
      libreEleccion: 0,
      total: 17
    }
  },
  {
    id: '3',
    nombre: 'Plan Acelerado',
    fechaCreacion: '2024-03-05',
    matriculas: [],
    creditos: {
      fundamentacion_obligatoria: 0,
      fundamentacion_optativa: 0,
      disciplinar_obligatoria: 0,
      disciplinar_optativa: 0,
      libreEleccion: 0,
      total: 0
    }
  }
];

// Función helper para obtener asignaturas usando el servicio
export const getAsignaturas = () => {
  return AsignaturasService.getTodasAsignaturas();
};

export const getAsignaturaPorCodigo = (codigo) => {
  return AsignaturasService.getAsignaturaPorCodigo(codigo);
};

// Para compatibilidad hacia atrás, exportamos también las asignaturas como antes
export const asignaturasEjemplo = AsignaturasService.getTodasAsignaturas();

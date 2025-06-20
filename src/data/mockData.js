// src/data/mockData.js
export const simulacionesEjemplo = [
  {
    id: '1',
    nombre: 'Plan Principal',
    fechaCreacion: '2024-01-15',
    matriculas: [
      {
        id: 'm1',
        posicion: 1,
        asignaturas: ['1000001', '1000002'] // IDs de asignaturas
      },
      {
        id: 'm2', 
        posicion: 2,
        asignaturas: ['1000003']
      }
    ],
    creditos: {
      fundamentacionObligatoria: 45,
      fundamentacionOptativa: 12,
      disciplinarObligatoria: 78,
      disciplinarOptativa: 15,
      libreEleccion: 6,
      total: 156
    }
  },
  {
    id: '2',
    nombre: 'Plan Alternativo',
    fechaCreacion: '2024-02-10',
    matriculas: [
      {
        id: 'm3',
        posicion: 1,
        asignaturas: ['1000001', '1000004', '1000005']
      }
    ],
    creditos: {
      fundamentacionObligatoria: 30,
      fundamentacionOptativa: 8,
      disciplinarObligatoria: 45,
      disciplinarOptativa: 10,
      libreEleccion: 3,
      total: 96
    }
  },
  {
    id: '3',
    nombre: 'Plan Acelerado',
    fechaCreacion: '2024-03-05',
    matriculas: [],
    creditos: {
      fundamentacionObligatoria: 0,
      fundamentacionOptativa: 0,
      disciplinarObligatoria: 0,
      disciplinarOptativa: 0,
      libreEleccion: 0,
      total: 0
    }
  }
];

export const asignaturasEjemplo = [
  {
    codigo: '1000001',
    nombre: 'Cálculo Diferencial',
    creditos: 4,
    tipologia: 'fundamentacion_obligatoria',
    prerrequisitos: [],
    disponible: true
  },
  {
    codigo: '1000002', 
    nombre: 'Álgebra Lineal',
    creditos: 3,
    tipologia: 'fundamentacion_obligatoria',
    prerrequisitos: [],
    disponible: true
  },
  {
    codigo: '1000003',
    nombre: 'Cálculo Integral', 
    creditos: 4,
    tipologia: 'fundamentacion_obligatoria',
    prerrequisitos: ['1000001'], // Requiere Cálculo Diferencial
    disponible: true
  },
  {
    codigo: '1000004',
    nombre: 'Introducción a la Programación',
    creditos: 3,
    tipologia: 'disciplinar_obligatoria',
    prerrequisitos: [],
    disponible: true
  },
  {
    codigo: '1000005',
    nombre: 'Matemáticas Discretas',
    creditos: 3,
    tipologia: 'fundamentacion_obligatoria',
    prerrequisitos: [],
    disponible: true
  },
  {
    codigo: '1000006',
    nombre: 'Programación Orientada a Objetos',
    creditos: 3,
    tipologia: 'disciplinar_obligatoria',
    prerrequisitos: ['1000004'],
    disponible: true
  }
];

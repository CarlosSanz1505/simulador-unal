// Constantes de colores para tipologías de asignaturas
export const TIPOLOGIA_COLORS = {
  'fundamentacion_obligatoria': { 
    border: '#f87171', // red-400
    background: '#fef2f2', // red-50
    text: '#dc2626', // red-600
    header: '#dc2626'
  },
  'fundamentacion_optativa': { 
    border: '#fb923c', // orange-400
    background: '#fff7ed', // orange-50
    text: '#ea580c', // orange-600
    header: '#ea580c'
  },
  'disciplinar_obligatoria': { 
    border: '#34d399', // emerald-400
    background: '#ecfdf5', // emerald-50
    text: '#059669', // emerald-600
    header: '#059669'
  },
  'disciplinar_optativa': { 
    border: '#60a5fa', // blue-400
    background: '#eff6ff', // blue-50
    text: '#2563eb', // blue-600
    header: '#2563eb'
  },
  'trabajo_de_grado': { 
    border: '#a78bfa', // violet-400
    background: '#f5f3ff', // violet-50
    text: '#7c3aed', // violet-600
    header: '#7c3aed'
  },
  'libre_eleccion': { 
    border: '#fbbf24', // amber-400
    background: '#fffbeb', // amber-50
    text: '#f59e0b', // amber-500
    header: '#f59e0b'
  }
}

// Función helper para obtener los colores de una tipología
export const getColoresTipologia = (tipologia) => {
  return TIPOLOGIA_COLORS[tipologia] || TIPOLOGIA_COLORS['libre_eleccion']
}

// Labels descriptivos para las tipologías
export const TIPOLOGIA_LABELS = {
  'fundamentacion_obligatoria': 'Fund. Obligatoria',
  'fundamentacion_optativa': 'Fund. Optativa',
  'disciplinar_obligatoria': 'Disciplinar Obligatoria',
  'disciplinar_optativa': 'Disciplinar Optativa',
  'trabajo_de_grado': 'Trabajo de Grado',
  'libre_eleccion': 'Libre Elección'
}

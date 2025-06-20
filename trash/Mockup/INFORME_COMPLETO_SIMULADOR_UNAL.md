# 📋 INFORME COMPLETO: Simulador UNAL - Frontend (Persona 3)

## 🎯 **CONTEXTO DEL PROYECTO**

Estás desarrollando el **frontend** del **Simulador UNAL**, una aplicación web para estudiantes de Ingeniería de Sistemas e Informática (Malla Curricular 3534) de la UNAL Medellín para organizar su plan de estudios.

**Tu rol específico:** **Persona 3 - Simulaciones y Matrículas**

---

## 📚 **DOCUMENTOS Y REQUISITOS ANALIZADOS**

### **Enunciado del Proyecto:**
- Aplicación para planificar trayecto por malla curricular
- Validación de prerrequisitos en tiempo real
- Cálculo de créditos por tipología (disciplinar obligatoria/optativa, fundamentación obligatoria/optativa, libre elección)
- Múltiples simulaciones por estudiante
- Exportar/importar simulaciones (JSON)

### **Funcionalidades del Sistema:**

#### **Para Estudiantes:**
- ✅ Crear múltiples simulaciones de plan de estudios
- ✅ Organizar asignaturas por matrículas (semestres)
- ✅ Validación automática de prerrequisitos
- ✅ Cálculo de créditos por tipología
- ✅ Drag & drop entre matrículas
- ✅ Búsqueda y filtrado de asignaturas
- ✅ Exportar/importar simulaciones (JSON)

#### **Para Administradores:**
- ✅ Gestión completa de asignaturas (CRUD)
- ✅ Carga masiva via CSV
- ✅ Definición de prerrequisitos

#### **Características Técnicas:**
- **Autenticación:** OAuth con correos @unal.edu.co únicamente
- **Responsive:** Móvil, tablet, desktop
- **Roles:** Estudiante y Administrador
- **Validaciones:** Prerrequisitos en tiempo real

### **Modelo Entidad-Relación:**
```
ESTUDIANTE (1:N) → SIMULACION (1:N) → MATRICULA (N:M) → ASIGNATURA
                                                    ↑
                                            ASIGNATURA (prerrequisitos)
```

**Entidades principales:**
- **ESTUDIANTE:** id, correo, nombre
- **SIMULACION:** id, nombre, créditos por tipología
- **MATRICULA:** id, posición (orden cronológico)
- **ASIGNATURA:** código, nombre, créditos, tipología, disponible

---

## 🎯 **TU ROL ESPECÍFICO (Persona 3)**

### **Tareas Asignadas:**
1. ✅ **Instructivo:** Mostrar modal en primera visita con pasos numerados
2. ✅ **Simulación automática:** Crear simulación vacía al primer acceso
3. ✅ **Vista "Mis Simulaciones":** Listado con cards, renombrar/eliminar
4. ✅ **Vista detallada:** Simulación con grid de columnas de matrículas
5. ✅ **Gestión matrículas:** UI para crear/eliminar con confirmación
6. ✅ **Matrícula activa:** Indicador visual (borde verde)
7. ✅ **Navegación:** Entre simulaciones y vistas

### **Dependencias:** 
- ✅ Login funcional (Persona 1)
- ✅ Datos de asignaturas disponibles (Persona 2)

---

## 🎨 **MOCKUPS ANALIZADOS**

### **1. Vista "Mis Simulaciones":**
- **Header:** Logo UNAL + título + "Cerrar sesión"
- **Botones acción:** ➕ Nueva + 📥 Importar
- **Cards simulación:** Nombre + fecha + botón eliminar (X)
- **Layout:** Grid responsive (1-3 columnas según pantalla)

### **2. Vista Simulación Detallada:**
- **Header simulación:** Nombre + ✏️ editar + 📥 descargar
- **Panel créditos:** 6 cards (Fund. Obligatoria, Fund. Optativa, Disciplinar Obligatoria, Disciplinar Optativa, Libre Elección, TOTAL)
- **Grid matrículas:** Columnas + botón "Nueva Matrícula"
- **Matrícula activa:** Borde verde para indicar selección
- **Estados:** Vacía, con asignaturas, con colores, errores prerrequisitos

### **3. Modal Instructivo:**
- **Overlay:** Fondo semi-transparente
- **Contenido:** "¡Bienvenido!" + pasos numerados + imagen ejemplo
- **Botón cerrar:** X en esquina superior derecha

### **4. Componentes Identificados:**
- Cards de simulación
- Contadores de créditos
- Columnas de matrícula
- Botones de acción
- Modales de confirmación

---

## 🛠️ **STACK TECNOLÓGICO DEFINIDO**

### **Tecnologías Principales:**
- ✅ **React + Vite** (ya configurado en repo)
- ✅ **JavaScript Vanilla** (NO TypeScript)
- ✅ **CSS Vanilla** (NO TailwindCSS - más simple para tu nivel)
- ✅ **React Router DOM** (navegación)
- ✅ **Estado local:** useState/useEffect (sin Context API complejo)

### **Repositorio:**
- **GitHub:** https://github.com/CarlosSanz1505/simulador-unal
- **IDE:** IntelliJ IDEA
- **Control versiones:** Git

### **Dependencias a Instalar:**
```bash
npm install react-router-dom
```

---

## 📁 **ESTRUCTURA DE CARPETAS RECOMENDADA**

```
src/
├── components/
│   ├── atoms/          # Elementos básicos
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   └── Modal.jsx
│   ├── molecules/      # Conjuntos con objetivo específico
│   │   ├── SimulationCard.jsx
│   │   ├── CreditCounter.jsx
│   │   ├── MatriculaColumn.jsx
│   │   └── SearchBar.jsx
│   ├── organisms/      # Conjuntos complejos (MÍNIMO 1)
│   │   ├── SimulationGrid.jsx    # ← TU ORGANISMO PRINCIPAL
│   │   ├── SimulationsList.jsx
│   │   └── InstructiveModal.jsx
│   └── templates/      # Layouts de página
│       └── PageLayout.jsx
├── pages/              # Páginas completas
│   ├── MisSimulaciones.jsx
│   └── SimulacionDetalle.jsx
├── hooks/              # Custom hooks si necesitas
├── utils/              # Funciones utilitarias
├── data/               # Datos de prueba temporales
│   └── mockData.js
└── styles/             # CSS organizados
    ├── components.css
    └── pages.css
```

### **Principios de Organización:**
- **Atoms:** Botones, inputs, badges básicos
- **Molecules:** Cards de simulación, contadores créditos
- **Organisms:** SimulationGrid (tu organismo principal con lógica compleja)
- **Pages:** Páginas completas
- **No demasiada abstracción, no muy poca**

---

## 🎨 **CONFIGURACIÓN CSS VANILLA**

### **src/index.css (Archivo principal):**
```css
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #f9fafb;
  color: #111827;
  line-height: 1.6;
}

/* Layout utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.flex {
  display: flex;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

/* Responsive */
@media (min-width: 768px) {
  .md-grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md-grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .lg-grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg-grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

/* Components */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-active {
  border: 2px solid #059669;
}

/* Buttons */
.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #059669;
  color: white;
}

.btn-primary:hover {
  background: #047857;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
}

.btn-secondary:hover {
  background: #2563eb;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* Credits */
.credit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.credit-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.credit-number {
  font-size: 24px;
  font-weight: bold;
  color: #059669;
}

.credit-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

/* Utilities */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.mt-4 { margin-top: 16px; }
.mt-6 { margin-top: 24px; }

.p-4 { padding: 16px; }
.p-6 { padding: 24px; }
.py-8 { padding-top: 32px; padding-bottom: 32px; }

.text-sm { font-size: 14px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-2xl { font-size: 24px; }

.font-bold { font-weight: bold; }
.font-semibold { font-weight: 600; }

.text-gray-600 { color: #6b7280; }
.text-gray-900 { color: #111827; }
.text-green-600 { color: #059669; }
.text-red-600 { color: #dc2626; }

.bg-gray-50 { background-color: #f9fafb; }
.bg-white { background-color: white; }

.min-h-screen { min-height: 100vh; }

.cursor-pointer { cursor: pointer; }
.transition { transition: all 0.2s; }
```

---

## 🗂️ **ESTRUCTURA DE DATOS (JavaScript)**

### **Datos de Simulación:**
```javascript
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
    matriculas: [],
    creditos: {
      fundamentacionObligatoria: 30,
      fundamentacionOptativa: 8,
      disciplinarObligatoria: 45,
      disciplinarOptativa: 10,
      libreEleccion: 3,
      total: 96
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
  }
];
```

---

## 🚀 **PLAN DE DESARROLLO PASO A PASO**

### **Fase 1: Setup Básico (30 min)**
1. ✅ Clonar repo: `git clone https://github.com/CarlosSanz1505/simulador-unal`
2. ✅ Instalar dependencias: `npm install`
3. ✅ Instalar React Router: `npm install react-router-dom`
4. ✅ Crear estructura de carpetas
5. ✅ Configurar CSS base (index.css)

### **Fase 2: Configuración Rutas (45 min)**
1. ✅ Configurar React Router en main.jsx
2. ✅ Crear App.jsx con rutas básicas
3. ✅ Crear páginas vacías (MisSimulaciones.jsx, SimulacionDetalle.jsx)
4. ✅ Probar navegación básica

### **Fase 3: Componentes Atoms (1 hora)**
1. ✅ Button.jsx - Botones reutilizables
2. ✅ Card.jsx - Cards básicas
3. ✅ Modal.jsx - Modal base
4. ✅ Badge.jsx - Para mostrar créditos

### **Fase 4: Vista "Mis Simulaciones" (2 horas)**
1. ✅ Crear datos mock (mockData.js)
2. ✅ Header con logo y navegación
3. ✅ Lista de simulaciones con cards
4. ✅ Botones crear/importar
5. ✅ Funcionalidad eliminar simulación

### **Fase 5: Modal Instructivo (1 hora)**
1. ✅ Componente InstructiveModal.jsx
2. ✅ Mostrar en primera visita
3. ✅ Pasos numerados con ejemplos
4. ✅ Cerrar y no mostrar más

### **Fase 6: Vista Simulación Detallada (3 horas)**
1. ✅ Header de simulación (nombre, editar, descargar)
2. ✅ Panel de créditos (6 cards)
3. ✅ Grid de matrículas básico
4. ✅ Botón "Nueva Matrícula"
5. ✅ Indicador visual matrícula activa

### **Fase 7: Gestión Matrículas (2 horas)**
1. ✅ Crear matrícula nueva
2. ✅ Eliminar matrícula con confirmación
3. ✅ Seleccionar matrícula activa
4. ✅ Mostrar posición/orden

### **Fase 8: Refinamiento (1 hora)**
1. ✅ Responsive design
2. ✅ Transiciones y hover effects
3. ✅ Validaciones básicas
4. ✅ Testing manual

---

## 📝 **CÓDIGO BASE PARA EMPEZAR**

### **src/main.jsx:**
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### **src/App.jsx:**
```jsx
import { Routes, Route } from 'react-router-dom'
import MisSimulaciones from './pages/MisSimulaciones'
import SimulacionDetalle from './pages/SimulacionDetalle'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<MisSimulaciones />} />
        <Route path="/simulacion/:id" element={<SimulacionDetalle />} />
      </Routes>
    </div>
  )
}

export default App
```

### **src/pages/MisSimulaciones.jsx (Estructura básica):**
```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { simulacionesEjemplo } from '../data/mockData'

function MisSimulaciones() {
  const [simulaciones, setSimulaciones] = useState(simulacionesEjemplo)

  const eliminarSimulacion = (id) => {
    if (confirm('¿Estás seguro de eliminar esta simulación?')) {
      setSimulaciones(simulaciones.filter(sim => sim.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="flex" style={{alignItems: 'center', gap: '16px'}}>
            <h1 className="text-xl font-semibold">Mis Simulaciones</h1>
          </div>
          <button className="btn">Cerrar sesión</button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container py-8">
        <div className="flex-between mb-6">
          <h2 className="text-2xl font-bold">Tus Simulaciones</h2>
          <div className="flex" style={{gap: '12px'}}>
            <button className="btn btn-primary">
              <span>➕</span>
              <span>Nueva</span>
            </button>
            <button className="btn btn-secondary">
              <span>📥</span>
              <span>Importar</span>
            </button>
          </div>
        </div>

        {/* Lista de simulaciones */}
        <div className="grid md-grid-cols-2 lg-grid-cols-3">
          {simulaciones.map((simulacion) => (
            <div key={simulacion.id} className="card">
              <div className="flex-between mb-4">
                <h3 className="text-lg font-semibold">
                  {simulacion.nombre}
                </h3>
                <button 
                  className="btn-danger"
                  onClick={() => eliminarSimulacion(simulacion.id)}
                  style={{background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer'}}
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Creada: {simulacion.fechaCreacion}
              </p>

              <div className="text-sm mb-4">
                <p>Total créditos: <span className="font-semibold">{simulacion.creditos.total}</span></p>
              </div>

              <Link 
                to={`/simulacion/${simulacion.id}`}
                className="btn btn-primary"
                style={{textDecoration: 'none', display: 'inline-block'}}
              >
                Ver simulación
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MisSimulaciones
```

---

## ⚠️ **CONSIDERACIONES DE INTEGRACIÓN CON EL EQUIPO**

### **Posibles Conflictos:**
1. **Rutas:** Definir prefijos únicos (`/mis-simulaciones`, `/simulacion/:id`)
2. **Estados compartidos:** Usuario logueado, datos de asignaturas
3. **Naming:** Prefijar componentes (`SimulationCard`, `MatriculaColumn`)
4. **CSS:** Evitar clases conflictivas

### **Puntos de Coordinación:**
- **Persona 1 (Auth):** Estado de usuario logueado, rutas protegidas
- **Persona 2 (Admin):** Estructura de datos de asignaturas
- **Persona 4 (Asignaturas):** Datos de asignaturas seleccionadas, drag & drop
- **Persona 5 (Extras):** Exportación/importación JSON

### **Contratos de Datos a Definir:**
```javascript
// Usuario (desde Persona 1)
const usuario = {
  id: string,
  email: string,
  rol: 'estudiante' | 'admin'
}

// Asignatura (desde Persona 2)  
const asignatura = {
  codigo: string,
  nombre: string,
  creditos: number,
  tipologia: string,
  prerrequisitos: string[],
  disponible: boolean
}
```

---

## 🔧 **COMANDOS GIT IMPORTANTES**

### **Workflow Recomendado:**
```bash
# Crear rama para tu trabajo
git checkout -b feature/simulaciones-matriculas

# Commits frecuentes
git add .
git commit -m "feat: implementar vista mis simulaciones"
git commit -m "feat: agregar modal instructivo"
git commit -m "feat: crear grid de matriculas"

# Push a tu rama
git push origin feature/simulaciones-matriculas

# Merge cuando esté listo
git checkout main
git merge feature/simulaciones-matriculas
```

---

## 🎯 **PRÓXIMOS PASOS INMEDIATOS**

### **Al empezar en el nuevo chat:**
1. ✅ **Clonar repo:** `git clone https://github.com/CarlosSanz1505/simulador-unal`
2. ✅ **Setup inicial:** `npm install && npm install react-router-dom`
3. ✅ **Crear estructura de carpetas** según lo definido
4. ✅ **Configurar CSS base** (copiar index.css de este informe)
5. ✅ **Crear primer componente:** Página "Mis Simulaciones"

### **Orden de Desarrollo:**
1. **Setup y configuración** (30 min)
2. **Componentes atoms básicos** (1 hora)
3. **Vista "Mis Simulaciones"** (2 horas)
4. **Modal instructivo** (1 hora)
5. **Vista simulación detallada** (3 horas)
6. **Gestión de matrículas** (2 horas)

---

## 💡 **NOTAS IMPORTANTES**

### **Para el Desarrollador:**
- **Nivel:** Básico en React/JS - enfoque en simplicidad
- **IDE:** IntelliJ IDEA - VSCode
- **Enfoque:** Funcionalidad antes que perfección
- **Testing:** Manual en navegador con datos mock

### **Decisiones Técnicas:**
- ✅ **CSS Vanilla** 
- ✅ **JavaScript** 
- ✅ **Estado local** en lugar de Context API (menos complejo)
- ✅ **Datos mock** para desarrollo independiente

### **Responsive Design:**
- **Mobile first:** Diseño base para móvil
- **Breakpoints:** 768px (tablet), 1024px (desktop)
- **Grid:** 1 columna móvil, 2-3 columnas desktop

---

## 🚀 **ESTE INFORME CONTIENE TODO LO NECESARIO PARA CONTINUAR EL DESARROLLO**

**Resumen de lo que tienes:**
- ✅ Contexto completo del proyecto
- ✅ Requisitos y mockups analizados
- ✅ Tu rol específico definido
- ✅ Stack tecnológico simplificado
- ✅ Estructura de carpetas detallada
- ✅ CSS base completo
- ✅ Código inicial para empezar
- ✅ Plan de desarrollo paso a paso
- ✅ Consideraciones de integración

**¡Listo para continuar en el nuevo chat! 🎉**

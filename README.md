# simula# 🎓 Simulador UNAL - Frontend

## 📋 Descripción

Aplicación web para estudiantes de Ingeniería de Sistemas e Informática (Malla Curricular 3534) de la UNAL Medellín para organizar y simular su plan de estudios.

**Desarrollado por:** Persona 3 - Simulaciones y Matrículas

## ✨ Funcionalidades Implementadas

### ✅ **Gestión de Simulaciones**
- Crear múltiples simulaciones de plan de estudios
- Eliminar simulaciones con confirmación
- Editar nombres de simulaciones
- Vista de listado con cards responsive

### ✅ **Gestión de Matrículas**
- Crear matrículas (semestres) dentro de cada simulación
- Eliminar matrículas con confirmación
- Indicador visual de matrícula activa (borde verde)
- Organización por posición cronológica

### ✅ **Panel de Créditos**
- Visualización de créditos por tipología:
  - Fundamentación Obligatoria
  - Fundamentación Optativa
  - Disciplinar Obligatoria
  - Disciplinar Optativa
  - Libre Elección
  - **Total**

### ✅ **Modal Instructivo**
- Se muestra automáticamente en la primera visita
- Pasos numerados explicando el uso del simulador
- Se guarda preferencia en localStorage

### ✅ **Navegación**
- React Router para navegación entre páginas
- Breadcrumbs y botones de retorno
- URLs amigables (`/simulacion/:id`)

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite
- **Styling:** CSS Vanilla (sin frameworks)
- **Routing:** React Router DOM
- **State:** useState/useEffect (local state)
- **Icons:** Emojis Unicode

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/          # Componentes básicos
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Modal.jsx
│   ├── molecules/      # Componentes con lógica específica
│   │   ├── SimulationCard.jsx
│   │   ├── CreditCounter.jsx
│   │   └── MatriculaColumn.jsx
│   └── organisms/      # Componentes complejos
│       └── InstructiveModal.jsx
├── pages/              # Páginas de la aplicación
│   ├── MisSimulaciones.jsx
│   └── SimulacionDetalle.jsx
├── data/               # Datos de ejemplo
│   └── mockData.js
└── styles/             # Estilos CSS
    └── index.css
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/CarlosSanz1505/simulador-unal

# Navegar al directorio
cd simulador-unal

# Instalar dependencias
npm install

# Instalar React Router
npm install react-router-dom

# Iniciar servidor de desarrollo
npm start
```

### URLs Disponibles
- **Inicio:** `http://localhost:5173/`
- **Simulación:** `http://localhost:5173/simulacion/:id`

## 🎨 Componentes Principales

### **SimulationCard**
Card reutilizable para mostrar información de simulaciones en la vista principal.

### **MatriculaColumn**
Componente para mostrar cada matrícula con sus asignaturas, drag & drop área y acciones.

### **InstructiveModal**
Modal que aparece en la primera visita para explicar el uso del simulador.

### **CreditCounter**
Contador individual para cada tipología de créditos.

## 📱 Responsive Design

- **Mobile:** 1 columna (Grid responsive)
- **Tablet:** 2 columnas 
- **Desktop:** 3-4 columnas
- **Breakpoints:** 768px (md), 1024px (lg)

## 🔄 Estados de la Aplicación

### **Página Principal**
- Lista de simulaciones
- Estado vacío cuando no hay simulaciones
- Modal instructivo en primera visita

### **Página de Simulación**
- Panel de créditos por tipología
- Grid de matrículas
- Matrícula activa con borde verde
- Estado vacío cuando no hay matrículas

## 🎯 Próximas Funcionalidades

- [ ] Drag & drop de asignaturas entre matrículas
- [ ] Validación de prerrequisitos en tiempo real
- [ ] Búsqueda y filtrado de asignaturas
- [ ] Exportar/importar simulaciones (JSON)
- [ ] Integración con backend para persistencia

## 👥 Integración con el Equipo

Este frontend está diseñado para integrarse con:
- **Persona 1:** Sistema de autenticación
- **Persona 2:** Gestión de asignaturas (Admin)
- **Persona 4:** Catálogo de asignaturas y drag & drop
- **Persona 5:** Exportación/importación

## 📝 Notas de Desarrollo

- Código comentado y estructura clara
- Uso de CSS vanilla para máximo control
- Componentes reutilizables siguiendo Atomic Design
- Estados locales simples (no Context API)
- Datos mock para desarrollo independiente

---

**Desarrollado para:** UNAL Medellín - Ingeniería de Sistemas e Informática  
**Curso:** Desarrollo Web 2025-1
Proyecto para organizar Plan de Estudios de la asignatura de Desarrollo Web I en la Universidad Nacional de Colombia, sede Medellín.

# Getting Started
```
npm run start
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Simulador UNAL - Frontend

## Descripción

Aplicación web para estudiantes de Ingeniería de Sistemas e Informática (Malla Curricular 3534) de la UNAL Medellín para organizar y simular su plan de estudios.


## Funcionalidades Implementadas

### **Gestión de Simulaciones**
- Crear múltiples simulaciones de plan de estudios
- Eliminar simulaciones con confirmación
- Editar nombres de simulaciones
- Vista de listado con cards responsive

### **Gestión de Matrículas**
- Crear matrículas (semestres) dentro de cada simulación
- Eliminar matrículas con confirmación
- Indicador visual de matrícula activa (borde verde)
- Organización por posición cronológica

### **Panel de Créditos**
- Visualización de créditos por tipología:
  - Fundamentación Obligatoria
  - Fundamentación Optativa
  - Disciplinar Obligatoria
  - Disciplinar Optativa
  - Libre Elección
  - **Total**

### **Modal Instructivo**
- Se muestra automáticamente en la primera visita
- Pasos numerados explicando el uso del simulador
- Se guarda preferencia en localStorage



## Estructura del Proyecto

```
src/
├── assets/             # Recursos estáticos
│   ├── images/         # Imágenes del proyecto
│   │   ├── bloques-simulacion.jpg
│   │   └── fondo-unal.jpg
│   └── iconos/         # Iconos y logos
│       ├── logo-unal.svg
│       └── sesion.png
├── components/
│   ├── atoms/          # Componentes básicos reutilizables
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── Modal.jsx
│   │   └── PrerequisitosModal.jsx
│   ├── molecules/      # Componentes con lógica específica
│   │   ├── CreditCounter.jsx
│   │   ├── MatriculaColumn.jsx
│   │   └── SimulationCard.jsx
│   └── organisms/      # Componentes complejos
│       ├── AsignaturasPanel.jsx
│       ├── Footer.jsx
│       ├── Header.jsx
│       └── InstructiveModal.jsx
├── data/               # Datos y servicios
│   ├── asignaturas.json
│   ├── asignaturasService.js
│   └── mockData.js
├── pages/              # Páginas de la aplicación
│   ├── MisSimulaciones.jsx
│   └── SimulacionDetalle.jsx
├── styles/             # Estilos con Tailwind CSS
│   └── globals.css
├── utils/              # Utilidades
│   ├── htmlToJsonConverter.js
│   └── prerequisitosValidation.js
├── App.jsx
└── main.jsx
```

## Instalación y Uso

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
git clone https://github.com/CarlosSanz1505/simulador-unal.git

# 2. Entrar al directorio
cd simulador-unal

# 3. Cambiar al branch correcto (donde están tus cambios)
git checkout feature/simulaciones-matriculas

# 4. Entrar al subdirectorio del proyecto
cd simulador-unal

# 5. Instalar dependencias
npm install

# 6. Ejecutar el proyecto
npm start
```


## Componentes Principales

### **SimulationCard**
Card reutilizable para mostrar información de simulaciones en la vista principal.

### **MatriculaColumn**
Componente para mostrar cada matrícula con sus asignaturas, drag & drop área y acciones.

### **InstructiveModal**
Modal que aparece en la primera visita para explicar el uso del simulador.

### **CreditCounter**
Contador individual para cada tipología de créditos.

## Responsive Design

- **Mobile:** 1 columna (Grid responsive)
- **Tablet:** 2 columnas 
- **Desktop:** 3-4 columnas
- **Breakpoints:** 768px (md), 1024px (lg)

## Estados de la Aplicación

### **Página Principal**
- Lista de simulaciones
- Estado vacío cuando no hay simulaciones
- Modal instructivo en primera visita

### **Página de Simulación**
- Panel de créditos por tipología
- Grid de matrículas
- Matrícula activa con borde verde
- Estado vacío cuando no hay matrículas


## Integración con el Equipo

Este frontend está diseñado para integrarse con:
- **Persona 1:** Sistema de autenticación
- **Persona 2:** Gestión de asignaturas (Admin)
- **Persona 4:** Catálogo de asignaturas y drag & drop
- **Persona 5:** Exportación/importación

## Stack Tecnológico

- **Frontend:** React 19.1.0 + Vite 6.3.5
- **Estilos:** Tailwind CSS 3.4.16 con clases personalizadas
- **Routing:** React Router DOM 7.6.2
- **Utilidades:** clsx, tailwind-merge
- **Arquitectura:** Atomic Design Pattern

## Notas de Desarrollo

- Código comentado y estructura clara
- **Tailwind CSS** con configuración personalizada para colores UNAL
- Componentes reutilizables siguiendo Atomic Design
- Estados locales simples (no Context API)
- Datos mock para desarrollo independiente
- Diseño responsive mobile-first

---

**Desarrollado para:** UNAL Medellín - Ingeniería de Sistemas e Informática  
**Curso:** Desarrollo Web 2025-1

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Git

### Pasos para ejecutar el proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/CarlosSanz1505/simulador-unal.git
   cd simulador-unal
   ```

2. **Cambiar al branch de desarrollo**
   ```bash
   git checkout feature/simulaciones-matriculas
   ```

3. **Navegar al directorio del proyecto**
   ```bash
   cd simulador-unal
   ```

4. **Instalar dependencias**
   ```bash
   npm install
   ```

5. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

6. **Abrir en el navegador**
   - La aplicación se abrirá automáticamente en `http://localhost:5173/misimulacion/`
   - Si no se abre automáticamente, navega manualmente a esa URL

### Comandos adicionales

- **Build para producción:**
  ```bash
  npm run build
  ```

- **Vista previa del build:**
  ```bash
  npm run preview
  ```

- **Linting:**
  ```bash
  npm run lint
  ```

### Solución de problemas comunes

- **Error de dependencias:** Eliminar `node_modules` y `package-lock.json`, luego ejecutar `npm install`
- **Puerto ocupado:** Vite automáticamente usará el siguiente puerto disponible
- **Problemas de permisos:** Ejecutar con `sudo` en sistemas Unix/Linux si es necesario

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

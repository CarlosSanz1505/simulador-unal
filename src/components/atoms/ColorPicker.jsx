import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function ColorPicker({ isOpen, onClose, onColorSelect, currentColor, anchorElement }) {
  const [selectedColor, setSelectedColor] = useState(currentColor || '#57844A')
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const pickerRef = useRef(null)

  // Colores predefinidos para asignaturas
  const predefinedColors = [
    '#57844A', // Verde UNAL (default)
    '#dc2626', // Rojo
    '#ea580c', // Naranja
    '#059669', // Verde esmeralda
    '#2563eb', // Azul
    '#7c3aed', // Violeta
    '#f59e0b', // Amarillo
    '#ec4899', // Rosa
    '#6b7280', // Gris
    '#10b981', // Verde lima
    '#3b82f6', // Azul cielo
    '#8b5cf6', // Púrpura
  ]

  // Actualizar el color seleccionado cuando cambie currentColor
  useEffect(() => {
    if (currentColor) {
      setSelectedColor(currentColor)
    }
  }, [currentColor])

  // Calcular posición cuando se abra el picker
  useEffect(() => {
    if (isOpen && anchorElement) {
      const rect = anchorElement.getBoundingClientRect()
      const pickerWidth = 220
      const pickerHeight = 180
      
      let top = rect.bottom + 5
      let left = rect.left
      
      // Ajustar si se sale por la derecha
      if (left + pickerWidth > window.innerWidth) {
        left = window.innerWidth - pickerWidth - 10
      }
      
      // Ajustar si se sale por la izquierda
      if (left < 10) {
        left = 10
      }
      
      // Ajustar si se sale por abajo
      if (top + pickerHeight > window.innerHeight) {
        top = rect.top - pickerHeight - 5
      }
      
      setPosition({ top, left })
    }
  }, [isOpen, anchorElement])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleColorClick = (color) => {
    setSelectedColor(color)
    onColorSelect(color)
    onClose()
  }

  if (!isOpen) return null

  const pickerContent = (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Color picker panel */}
      <div 
        ref={pickerRef}
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '220px'
        }}
      >
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Seleccionar color</h4>
        
        {/* Grid de colores predefinidos */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                selectedColor === color 
                  ? 'border-gray-600 shadow-md' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={`Seleccionar color ${color}`}
            />
          ))}
        </div>

        {/* Preview del color seleccionado */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <div 
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs text-gray-600 font-mono">{selectedColor}</span>
        </div>
      </div>
    </>
  )

  return createPortal(pickerContent, document.body)
}

export default ColorPicker

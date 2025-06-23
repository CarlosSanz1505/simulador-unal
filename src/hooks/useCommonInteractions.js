import { useCallback, useState } from 'react'

/**
 * Hook personalizado para manejar la edición inline de nombres
 * @param {string} initialValue - Valor inicial del nombre
 * @param {function} onSave - Función a llamar cuando se guarda el valor
 * @returns {object} - Objeto con estado y funciones para manejar la edición
 */
export const useInlineEdit = (initialValue, onSave) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)

  const startEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const saveEdit = useCallback(() => {
    if (value.trim() && onSave) {
      onSave(value.trim())
    }
    setIsEditing(false)
  }, [value, onSave])

  const cancelEdit = useCallback(() => {
    setValue(initialValue)
    setIsEditing(false)
  }, [initialValue])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }, [saveEdit, cancelEdit])

  return {
    isEditing,
    value,
    setValue,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyPress
  }
}

/**
 * Hook para manejar drag and drop
 * @returns {object} - Estado y funciones para drag and drop
 */
export const useDragAndDrop = () => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e, onDrop) => {
    e.preventDefault()
    setIsDragOver(false)
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data && onDrop) {
        onDrop(data)
      }
    } catch (error) {
      console.error('Error al procesar el drop:', error)
    }
  }, [])

  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}

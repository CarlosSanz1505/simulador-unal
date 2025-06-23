import iconoCancelar from '../../assets/iconos/cancelar.svg'

function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
          <button 
            className="ml-auto text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none transition-colors"
            onClick={onClose}
          >
            <img src={iconoCancelar} alt="Cerrar" className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

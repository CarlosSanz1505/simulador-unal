function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button 
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>
        
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}
        
        {children}
      </div>
    </div>
  )
}

export default Modal

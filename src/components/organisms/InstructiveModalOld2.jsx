import { useState, useEffect } from 'react'

function InstructiveModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Mostrar siempre después de iniciar sesión
    setShowModal(true)
  }, [])

  const handleClose = () => {
    setShowModal(false)
  }

  const handleContinue = () => {
    handleClose()
  }

  if (!showModal) return null

  return (
    <div className="instructive-modal-overlay">
      <div className="instructive-modal-content">
        <button 
          className="instructive-modal-close"
          onClick={handleClose}
        >
          ✕
        </button>
        
        <h2 className="instructive-title">¿Cómo usar el simulador UNAL?</h2>
        
        <div className="instructive-content">
          <p style={{marginBottom: '20px'}}>
            Una simulación vacía aparecerá de forma predeterminada al iniciar sesión. Si se desea:
          </p>

          <div className="instructive-step">
            <div className="instructive-step-number">1</div>
            <div className="instructive-step-content">
              Agregar una nueva simulación se debe dar clic en la barra desplegable de simulaciones 
              en la parte superior y darle al botón de nueva simulación
            </div>
          </div>

          <div className="instructive-step">
            <div className="instructive-step-number">2</div>
            <div className="instructive-step-content">
              Agrega las matrículas que necesites al darle clic en el rectángulo verde con el ícono "+"
            </div>
          </div>

          <div className="instructive-step">
            <div className="instructive-step-number">3</div>
            <div className="instructive-step-content">
              <strong>Agrega una asignatura:</strong>
              <div className="instructive-substep">• Selecciona la matrícula</div>
              <div className="instructive-substep">• Busca asignaturas por nombre, código o filtra por tipología/créditos</div>
              <div className="instructive-substep">• Marca las que desees</div>
              <div className="instructive-substep">• Verifica prerrequisitos: Si una asignatura no cumple con sus prerrequisitos, el sistema te mostrará una alerta</div>
            </div>
          </div>

          <div className="instructive-step">
            <div className="instructive-step-number">4</div>
            <div className="instructive-step-content">
              <strong>Organiza tu plan:</strong>
              <div className="instructive-substep">• Arrastra asignaturas entre matrículas</div>
              <div className="instructive-substep">• Elimina asignaturas si ya no las deseas en la matrícula</div>
            </div>
          </div>

          <div className="instructive-step">
            <div className="instructive-step-number">5</div>
            <div className="instructive-step-content">
              <strong>Carga o descarga tu simulación:</strong>
              <div className="instructive-substep">• Usa las opciones de descarga y carga ubicados al lado del nombre, y en la lista</div>
            </div>
          </div>


          <button 
            className="instructive-continue-btn"
            onClick={handleContinue}
          >
            Continuar a la simulación →
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstructiveModal

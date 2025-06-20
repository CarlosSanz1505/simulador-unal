import { useEffect, useState } from 'react'

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
        {/* Header */}
        <div className="instructive-modal-header">
          <div className="instructive-header-title">
            <img 
              src="/images/logo-unal.svg" 
              alt="Logo UNAL" 
              className="instructive-logo"
            />
            Mis Simulaciones
          </div>
          <button 
            className="instructive-close-btn"
            onClick={handleClose}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Contenido */}
        <div className="instructive-content">
          <h2 className="instructive-title">¿Cómo usar el simulador UNAL?</h2>
          
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
              <img 
                src="/images/bloques-simulacion.jpg" 
                alt="Ejemplo de bloques de simulación" 
                className="instructive-example-image"
              />
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

          <div className="instructive-note">
            <strong>Nota:</strong> Estas instrucciones son justamente lo que debe hacer el programa. 
            Por ahora nos vamos a centrar en estos puntos básicos para comenzar.
          </div>

          <button 
            className="instructive-continue-btn"
            onClick={handleContinue}
          >
            Continuar a la simulación →
          </button>
        </div>

        {/* Footer */}
        <div className="instructive-modal-footer">
          @2025 Universidad Nacional de Colombia
        </div>
      </div>
    </div>
  )
}

export default InstructiveModal

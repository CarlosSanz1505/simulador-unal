import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import iconoAyuda from '../../assets/iconos/ayuda.svg'
import logoUnal from '../../assets/iconos/logo-unal.svg'
import iconoSesion from '../../assets/iconos/sesion.png'
import InstructiveModal from './InstructiveModal'

function Header() {
  const [showInstructive, setShowInstructive] = useState(false)
  const location = useLocation()
  
  // Verificar si estamos en la página de Mis Simulaciones
  const isInMisSimulaciones = location.pathname === '/simulaciones/' || location.pathname === '/simulaciones'

  const handleOpenInstructive = () => {
    setShowInstructive(true)
  }

  const handleCloseInstructive = () => {
    setShowInstructive(false)
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="instructive-header-title">
            <img 
              src={logoUnal} 
              alt="Logo UNAL" 
              className="instructive-logo"
            />
            {!isInMisSimulaciones && (
              <Link to="/misimulacion/" className="header-title-link">
                Mis Simulaciones
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botón de instructivo */}
            <button 
              onClick={handleOpenInstructive}
              className="flex items-center gap-2 px-3 py-2 bg-unal-green-100 hover:bg-unal-green-200 text-unal-green-700 rounded-lg transition-colors border border-unal-green-300"
              title="Instructivo - Cómo usar el simulador"
            >
              <img 
                src={iconoAyuda} 
                alt="Instructivo" 
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Instructivo</span>
            </button>

            {/* Botón de cerrar sesión */}
            <button className="instructive-close-btn">
              <span>Cerrar sesión</span>
              <img 
                src={iconoSesion} 
                alt="Sesión" 
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Modal de instructivo */}
      <InstructiveModal 
        isOpen={showInstructive} 
        onClose={handleCloseInstructive}
      />
    </>
  )
}

export default Header

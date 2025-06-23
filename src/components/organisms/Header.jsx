import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import iconoAyuda from '../../assets/iconos/ayuda.svg'
import iconoCerrarSesion from '../../assets/iconos/cerrar-sesion.svg'
import logoUnal from '../../assets/iconos/logo-unal.svg'
import InstructiveModal from './InstructiveModal'

function Header() {
  const [showInstructive, setShowInstructive] = useState(false)
  const location = useLocation()
  
  // Verificar si estamos en la página de Mis Simulaciones
  const isInMisSimulaciones = location.pathname === '/misimulacion/' || location.pathname === '/misimulacion'

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
              <Link 
                to="/misimulacion/" 
                className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 bg-unal-green-100 hover:bg-unal-green-200 text-unal-green-700 rounded-lg transition-colors border border-unal-green-300 text-xs sm:text-sm font-medium whitespace-nowrap"
                title="Ir a Mis Simulaciones"
              >
                Mis Simulaciones
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Botón de instructivo */}
            <button 
              onClick={handleOpenInstructive}
              className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 bg-unal-green-100 hover:bg-unal-green-200 text-unal-green-700 rounded-lg transition-colors border border-unal-green-300 text-xs sm:text-sm"
              title="Instructivo - Cómo usar el simulador"
            >
              <img 
                src={iconoAyuda} 
                alt="Instructivo" 
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <span className="font-medium whitespace-nowrap">Instructivo</span>
            </button>

            {/* Botón de cerrar sesión */}
            <button className="instructive-close-btn">
              <span className="text-xs sm:text-sm">Cerrar sesión</span>
              <img 
                src={iconoCerrarSesion} 
                alt="Cerrar sesión" 
                className="w-4 h-4 sm:w-5 sm:h-5"
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

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import iconoAyuda from '../../assets/iconos/ayuda.svg'
import logoUnal from '../../assets/iconos/logo-unal.svg'
import iconoSesion from '../../assets/iconos/sesion.png'
import iconoVolver from '../../assets/iconos/volver.svg'
import InstructiveModal from './InstructiveModal'

function Header() {
  const [showInstructive, setShowInstructive] = useState(false)
  const location = useLocation()
  
  // Verificar si estamos en la página de Mis Simulaciones
  const isInMisSimulaciones = location.pathname === '/simulaciones';
  const isAdmin = location.pathname === '/admin/asignaturas';

  const handleOpenInstructive = () => {
    setShowInstructive(true)
  }

  const handleCloseInstructive = () => {
    setShowInstructive(false)
  }

  return (
    <>
      <header className="header">
        <div className="header-content max-w-[5000px] mx-auto sm:px-10 h-[54px] flex justify-between items-center">
          <div className={`instructive-header-title sm:gap-[12px] ${(isInMisSimulaciones) ? 'ml-[10px] sm:ml-0' : ''}`}>
            <img 
              src={logoUnal} 
              alt="Logo UNAL" 
              className="instructive-logo order-2"
            />
            {(!isInMisSimulaciones && !isAdmin) && (
              <Link to="/simulaciones" className="header-title-link order-1 sm:order-2">
                <span className="hidden sm:inline">Mis Simulaciones</span>
                <img src={iconoVolver} className="sm:hidden w-[30px]" />
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4 pr-[10px] sm:pr-0">
            {/* Botón de instructivo
                sólo visible para estudiante */}
            {!isAdmin && <button 
              onClick={handleOpenInstructive}
              className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-unal-green-100 hover:bg-unal-green-200 text-unal-green-700 rounded-lg transition-colors border border-unal-green-300"
              title="Instructivo - Cómo usar el simulador"
            >
              <img 
                src={iconoAyuda} 
                alt="Instructivo" 
                className="w-5 h-5"
              />
              <span className="text-sm font-medium hidden sm:inline">Instructivo</span>
            </button>}

            {/* Botón de cerrar sesión */}
            <button className="instructive-close-btn" onClick={() => {window.location.href = '/';}}>
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

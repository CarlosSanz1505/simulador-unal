import { Link } from 'react-router-dom'
import logoUnal from '../../assets/iconos/logo-unal.svg'
import iconoSesion from '../../assets/iconos/sesion.png'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="instructive-header-title">
          <img 
            src={logoUnal} 
            alt="Logo UNAL" 
            className="instructive-logo"
          />
          <Link to="/" className="header-title-link">
            Mis Simulaciones
          </Link>
        </div>
        <button className="instructive-close-btn">
          <span>Cerrar sesión</span>
          <img 
            src={iconoSesion} 
            alt="Sesión" 
            className="w-5 h-5"
          />
        </button>
      </div>
    </header>
  )
}

export default Header

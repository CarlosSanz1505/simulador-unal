import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="instructive-header-title">
          <img 
            src="/images/logo-unal.svg" 
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
            src="/iconos/sesion.png" 
            alt="Sesión" 
            style={{width: '20px', height: '20px'}}
          />
        </button>
      </div>
    </header>
  )
}

export default Header

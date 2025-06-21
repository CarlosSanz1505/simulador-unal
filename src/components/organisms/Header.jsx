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
        <nav className="header-nav">
          <Link to="/admin/asignaturas" className="nav-link">
            ⚙️ Administrar
          </Link>
          <button className="instructive-close-btn">
            <span>Cerrar sesión</span>
            <img 
              src="/iconos/sesion.png" 
              alt="Sesión" 
              style={{width: '20px', height: '20px'}}
            />
          </button>
        </nav>
      </div>

      <style jsx>{`
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 8px 15px;
          border-radius: 5px;
          transition: background-color 0.3s;
          font-size: 0.9rem;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .header-nav {
            gap: 10px;
          }

          .nav-link {
            padding: 6px 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </header>
  )
}

export default Header

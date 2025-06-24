import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/organisms/Footer'
import Header from './components/organisms/Header'
import InstructiveModal from './components/organisms/InstructiveModal'
import MisSimulaciones from './pages/MisSimulaciones'
import SimulacionDetalle from './pages/SimulacionDetalle'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen">
      {(window.location.href !== 'http://localhost:5173/') ? <Header /> : null}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/simulaciones" element={<MisSimulaciones />} />
          {/* <Route path="/" element={<Navigate to="/misimulacion/" replace />} /> */}
          <Route path="/simulaciones/:id" element={<SimulacionDetalle />} />
        </Routes>
      </div>
      <Footer />
      <InstructiveModal />
    </div>
  )
}

export default App

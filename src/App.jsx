import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/organisms/Footer'
import Header from './components/organisms/Header'
import InstructiveModal from './components/organisms/InstructiveModal'
import MisSimulaciones from './pages/MisSimulaciones'
import SimulacionDetalle from './pages/SimulacionDetalle'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/misimulacion/" replace />} />
          <Route path="/misimulacion/" element={<MisSimulaciones />} />
          <Route path="/simulacion/:id" element={<SimulacionDetalle />} />
        </Routes>
      </div>
      <Footer />
      <InstructiveModal />
    </div>
  )
}

export default App

import { Route, Routes } from 'react-router-dom'
import Footer from './components/organisms/Footer'
import Header from './components/organisms/Header'
import InstructiveModal from './components/organisms/InstructiveModal'
import AdministrarAsignaturas from './pages/AdministrarAsignaturas'
import MisSimulaciones from './pages/MisSimulaciones'
import SimulacionDetalle from './pages/SimulacionDetalle'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MisSimulaciones />} />
          <Route path="/simulacion/:id" element={<SimulacionDetalle />} />
          <Route path="/admin/asignaturas" element={<AdministrarAsignaturas />} />
        </Routes>
      </div>
      <Footer />
      <InstructiveModal />
    </div>
  )
}

export default App

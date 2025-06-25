import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/organisms/Footer'
import Header from './components/organisms/Header'
import InstructiveModal from './components/organisms/InstructiveModal'
import MisSimulaciones from './pages/MisSimulaciones'
import SimulacionDetalle from './pages/SimulacionDetalle'
import AsignaturasAdmin from './pages/admin/Asignaturas'
import Login from './pages/Login'

function App() {
  return (
    <>
      {(window.location.href !== 'http://localhost:5173/') ? <Header /> : null}
      <div className="app-container pt-[54px] w-full pb-[43.2px] min-h-screen flex">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/asignaturas" element={<AsignaturasAdmin />} />
          <Route path="/simulaciones" element={<MisSimulaciones />} />
          <Route path="/simulaciones/:id" element={<SimulacionDetalle />} />
        </Routes>
      </div>
      <Footer />
      <InstructiveModal />
    </>
  )
}

export default App;

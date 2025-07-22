import { Route, Routes } from 'react-router-dom'
import Footer from './components/organisms/Footer'
import Header from './components/organisms/Header'
import InstructiveModal from './components/organisms/InstructiveModal'
import ProtectedRoute from './components/organisms/ProtectedRoute'
import AsignaturasAdmin from './pages/admin/Asignaturas'
import Login from './pages/Login'
import MisSimulaciones from './pages/MisSimulaciones'
import SimulacionDetalle from './pages/SimulacionDetalle'

function App() {
  return (
    <>
      {(window.location.href !== 'http://localhost:5173/') ? <Header /> : null}
      <div className="app-container pt-[54px] w-full pb-[43.2px] min-h-screen flex">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/asignaturas" element={
            <ProtectedRoute role="admin">
              <AsignaturasAdmin />
            </ProtectedRoute>
          } />
          <Route path="/simulaciones" element={
            <ProtectedRoute role="estudiante">
              <MisSimulaciones />
            </ProtectedRoute>
          } />
          <Route path="/simulaciones/:id" element={<SimulacionDetalle />} />
        </Routes>
      </div>
      <Footer />
      <InstructiveModal />
    </>
  )
}

export default App;

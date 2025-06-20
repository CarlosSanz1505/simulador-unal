import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AsignaturasAdmin from './pages/admin/Asignaturas.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/asignaturas" element={<AsignaturasAdmin />} />
        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;

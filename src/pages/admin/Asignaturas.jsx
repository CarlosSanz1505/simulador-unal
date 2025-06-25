import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Papa from "papaparse";
import { FaPen, FaTimes, FaPlus, FaFilter } from "react-icons/fa";
import "./AsignaturasAdmin.css";

export default function AsignaturasAdmin() {

  const [asignaturas, setAsignaturas] = useState(() => {
    const saved = localStorage.getItem("asignaturas");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    nombre: "",
    codigo: "",
    creditos: "",
    tipologia: ""
  });
  const [prerrequisitosSeleccionados, setPrerrequisitosSeleccionados] =
    useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEnEdicion, setIdEnEdicion] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idPendienteEliminar, setIdPendienteEliminar] = useState(null);

  const [avanceReq, setAvanceReq] = useState(false);
  const [prereqTipologia, setPrereqTipologia] = useState("");
  const [prereqPorcentaje, setPrereqPorcentaje] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const importRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("asignaturas", JSON.stringify(asignaturas));
  }, [asignaturas]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleChange = (e) =>
    setNuevaAsignatura({
      ...nuevaAsignatura,
      [e.target.name]: e.target.value
    });

  const abrirModalForm = (editar = false, asignatura = null) => {
    if (editar && asignatura) {
      setNuevaAsignatura({
        nombre: asignatura.nombre,
        codigo: asignatura.codigo,
        creditos: asignatura.creditos,
        tipologia: asignatura.tipologia
      });
      setPrerrequisitosSeleccionados(
        asignatura.prerrequisitos.map((c) => ({ value: c, label: c }))
      );
      setModoEdicion(true);
      setIdEnEdicion(asignatura.id);
    } else {
      setNuevaAsignatura({
        nombre: "",
        codigo: "",
        creditos: "",
        tipologia: ""
      });
      setPrerrequisitosSeleccionados([]);
      setModoEdicion(false);
      setIdEnEdicion(null);
      setAvanceReq(false);
      setPrereqTipologia("");
      setPrereqPorcentaje("");
    }
    setShowFormModal(true);
  };

  const handleAgregar = (e) => {
    if (e && e.preventDefault) e.preventDefault(); 

    const payload = {
      ...nuevaAsignatura,
      prerrequisitos: prerrequisitosSeleccionados.map((p) => p.value),
      avance: avanceReq,
      avanceTipologia: prereqTipologia,
      avancePorcentaje: prereqPorcentaje
    };

    setAsignaturas((prev) => {
      if (modoEdicion) {
        return prev.map((a) =>
          a.id === idEnEdicion ? { ...payload, id: idEnEdicion } : a
        );
      }
      return [...prev, { ...payload, id: crypto.randomUUID() }];
    });

    setShowFormModal(false);
    setShowPrereqModal(false);
  };

  const confirmarEliminar = (id) => {
    setIdPendienteEliminar(id);
    setShowDeleteModal(true);
  };

  const ejecutarEliminar = () => {
    setAsignaturas((prev) => prev.filter((a) => a.id !== idPendienteEliminar));
    setShowDeleteModal(false);
  };

  const handleImportCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const nuevas = data.map((r) => ({
          id: crypto.randomUUID(),
          nombre: r.nombre,
          codigo: r.codigo,
          creditos: r.creditos,
          tipologia: r.tipologia,
          prerrequisitos: r.prerrequisitos
            ? r.prerrequisitos.split(",").map((x) => x.trim())
            : [],
          avance: r.avance === "true",
          avanceTipologia: r.avanceTipologia,
          avancePorcentaje: r.avancePorcentaje
        }));
        setAsignaturas((prev) => [...prev, ...nuevas]);
      }
    });
  };

  const opcionesPrerrequisitos = asignaturas.map((a) => ({
    value: a.codigo,
    label: `${a.nombre} (${a.codigo})`
  }));


  const filteredAsignaturas = asignaturas.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAsignaturas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAsignaturas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="awa-container h-[80vh] m-auto">
      <div className="awa-header">
        <h1 className="awa-title">Gestión de Asignaturas</h1>
        <div className="awa-actions-header">
          <button className="awa-btn-new" onClick={() => abrirModalForm(false)}>
            <FaPlus size={16} color="#fff" /> Nueva Asignatura
          </button>
          <button
            className="awa-btn-import"
            onClick={() => importRef.current.click()}
          >
            <FaPlus size={16} /> Importar
          </button>
          <input
            ref={importRef}
            type="file"
            accept=",.csv"
            onChange={handleImportCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="awa-search">
        <input
          className="awa-input-search"
          placeholder="Buscar Asignatura"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="awa-list pt-0 pl-0 pr-[4px] pb-[4px]">
        {currentItems.map((a) => (
          <div key={a.id} className="awa-card">
            <div>
              <strong>{a.nombre}</strong>
              <br />
              <small>({a.codigo})</small>
            </div>
            <div className="awa-card-tipologia">{a.tipologia}</div>
            <div>{a.creditos} créditos</div>
            <div>{a.prerrequisitos.length ? a.prerrequisitos.join(", ") : "—"}</div>
            <div className="awa-card-actions">
              <button
                className="awa-action-edit"
                onClick={() => abrirModalForm(true, a)}
              >
                <FaPen size={16} />
              </button>
              <button
                className="awa-action-delete"
                onClick={() => confirmarEliminar(a.id)}
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="awa-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`awa-page-btn ${currentPage === num ? "active" : ""}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {showFormModal && (
        <div className="awa-modal-overlay">
          <div className="awa-modal-box large">
            <button
              className="awa-modal-close"
              onClick={() => setShowFormModal(false)}
            >
              <FaTimes size={20} color="#333" />
            </button>

            <h2>{modoEdicion ? "Editar Asignatura" : "Agregar Asignatura"}</h2>

            <form className="awa-modal-body" onSubmit={handleAgregar}>
              <label>Nombre</label>
              <input
                required
                name="nombre"
                value={nuevaAsignatura.nombre}
                onChange={handleChange}
                placeholder="Escriba aquí..."
              />

              <label>Código</label>
              <input
                required
                name="codigo"
                value={nuevaAsignatura.codigo}
                onChange={handleChange}
                placeholder="Escriba aquí..."
              />

              <label>Tipología</label>
              <select
                required
                name="tipologia"
                value={nuevaAsignatura.tipologia}
                onChange={handleChange}
              >
                <option value="">Seleccione...</option>
                <option>Fund. Obligatoria</option>
                <option>Fund. Optativa</option>
                <option>Disc. Obligatoria</option>
                <option>Disc. Optativa</option>
                <option>Libre Elección</option>
              </select>

              <label>Créditos</label>
              <input
                required
                name="creditos"
                type="number"
                min="0"
                step="1"
                value={nuevaAsignatura.creditos}
                onChange={handleChange}
                placeholder="Escriba aquí..."
              />

              <button
                type="button"
                className="awa-btn-prereq-toggle"
                onClick={() => setShowPrereqModal(true)}
              >
                <FaPlus size={16} color="#4a7c38" /> Prerrequisitos
              </button>

              <button type="submit" className="awa-btn-confirm">
                Confirmar Asignatura
              </button>
            </form>
          </div>
        </div>
      )}

      {showPrereqModal && (
        <div className="awa-modal-overlay">
          <div className="awa-modal-box small">
            <button
              className="awa-modal-close"
              onClick={() => setShowPrereqModal(false)}
            >
              <FaTimes size={20} color="#333" />
            </button>
            <h2>Prerrequisitos</h2>

            <Select
              isMulti
              options={opcionesPrerrequisitos}
              value={prerrequisitosSeleccionados}
              onChange={setPrerrequisitosSeleccionados}
              placeholder="Buscar Asignatura"
              className="awa-select"
              controlShouldRenderValue={false}
            />

            <div className="awa-prereq-list">
              {prerrequisitosSeleccionados.map((item) => (
                <div key={item.value} className="awa-prereq-card">
                  <span>{item.label}</span>
                  <button
                    onClick={() =>
                      setPrerrequisitosSeleccionados((old) =>
                        old.filter((p) => p.value !== item.value)
                      )
                    }
                    className="awa-action-delete"
                  >
                    <FaTimes size={14} color="currentColor" />
                  </button>
                </div>
              ))}
            </div>

            <label className="awa-prereq-advance-label">
              <input
                type="checkbox"
                checked={avanceReq}
                onChange={() => setAvanceReq(!avanceReq)}
              />{" "}
              Porcentaje de avance mínimo requerido
            </label>

            {avanceReq && (
              <div className="awa-prereq-advance-options">
                <select
                  value={prereqTipologia}
                  onChange={(e) => setPrereqTipologia(e.target.value)}
                >
                  <option value="">Tipología...</option>
                  <option>Fundamentación</option>
                  <option>Disciplinar</option>
                  <option>General</option>
                </select>
                <input
                  type="number"
                  min="0" max="100"
                  placeholder="porcentaje"
                  value={prereqPorcentaje}
                  onChange={(e) => setPrereqPorcentaje(e.target.value)}
                />
              </div>
            )}

            <div className="awa-modal-actions">
              <button
                onClick={() => setShowPrereqModal(false)}
                className="awa-btn-cancel"
              >
                Cancelar
              </button>
              <button onClick={handleAgregar} className="awa-btn-confirm">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="awa-modal-overlay">
          <div className="awa-modal-box small">
            <h2>¿Eliminar esta asignatura?</h2>
            <p>Esta acción no se puede deshacer.</p>

            <div className="awa-modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="awa-btn-cancel"
              >
                Cancelar
              </button>
              <button onClick={ejecutarEliminar} className="awa-btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

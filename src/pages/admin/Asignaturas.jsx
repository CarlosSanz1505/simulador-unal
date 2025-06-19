import { useState, useEffect } from "react";
import Select from "react-select";
import Papa from "papaparse";

export default function AsignaturasAdmin() {
  const [asignaturas, setAsignaturas] = useState(() => {
    const guardadas = localStorage.getItem("asignaturas");
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    nombre: "",
    codigo: "",
    creditos: "",
    tipologia: "",
  });

  const [prerrequisitosSeleccionados, setPrerrequisitosSeleccionados] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEnEdicion, setIdEnEdicion] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idPendienteEliminar, setIdPendienteEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem("asignaturas", JSON.stringify(asignaturas));
  }, [asignaturas]);

  const handleChange = (e) => {
    setNuevaAsignatura({ ...nuevaAsignatura, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    if (modoEdicion) {
      setAsignaturas(
        asignaturas.map((a) =>
          a.id === idEnEdicion
            ? {
                ...nuevaAsignatura,
                id: idEnEdicion,
                prerrequisitos: prerrequisitosSeleccionados.map((p) => p.value),
              }
            : a
        )
      );
      setModoEdicion(false);
      setIdEnEdicion(null);
    } else {
      setAsignaturas([
        ...asignaturas,
        {
          ...nuevaAsignatura,
          id: crypto.randomUUID(),
          prerrequisitos: prerrequisitosSeleccionados.map((p) => p.value),
        },
      ]);
    }
    setNuevaAsignatura({ nombre: "", codigo: "", creditos: "", tipologia: "" });
    setPrerrequisitosSeleccionados([]);
  };

  const confirmarEliminar = (id) => {
    setMostrarModal(true);
    setIdPendienteEliminar(id);
  };
  
  const ejecutarEliminar = () => {
    setAsignaturas(asignaturas.filter((a) => a.id !== idPendienteEliminar));
    setMostrarModal(false);
    setIdPendienteEliminar(null);
  };

  const handleEditar = (asignatura) => {
    setNuevaAsignatura({
      nombre: asignatura.nombre,
      codigo: asignatura.codigo,
      creditos: asignatura.creditos,
      tipologia: asignatura.tipologia,
    });
    setPrerrequisitosSeleccionados(
      asignatura.prerrequisitos?.map((codigo) => {
        const match = asignaturas.find((a) => a.codigo === codigo);
        return match
          ? { value: codigo, label: `${match.nombre} (${codigo})` }
          : { value: codigo, label: codigo };
      }) || []
    );
    setModoEdicion(true);
    setIdEnEdicion(asignatura.id);
  };

  const opcionesPrerrequisitos = asignaturas.map((a) => ({
    value: a.codigo,
    label: `${a.nombre} (${a.codigo})`,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Asignaturas</h1>

      <div className="mb-6 space-y-2">
        <input
          name="nombre"
          value={nuevaAsignatura.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-2 w-full"
        />
        <input
          name="codigo"
          value={nuevaAsignatura.codigo}
          onChange={handleChange}
          placeholder="Código"
          className="border p-2 w-full"
        />
        <input
          name="creditos"
          value={nuevaAsignatura.creditos}
          onChange={handleChange}
          placeholder="Créditos"
          type="number"
          className="border p-2 w-full"
        />
        <input
          name="tipologia"
          value={nuevaAsignatura.tipologia}
          onChange={handleChange}
          placeholder="Tipología"
          className="border p-2 w-full"
        />
        <Select
          isMulti
          options={opcionesPrerrequisitos}
          value={prerrequisitosSeleccionados}
          onChange={setPrerrequisitosSeleccionados}
          placeholder="Selecciona prerrequisitos"
        />
        <button
          onClick={handleAgregar}
          className={`px-4 py-2 rounded text-white ${
            modoEdicion ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {modoEdicion ? "Guardar cambios" : "Agregar asignatura"}
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              complete: function (results) {
                const nuevas = results.data.map((row) => ({
                  id: crypto.randomUUID(),
                  nombre: row.nombre,
                  codigo: row.codigo,
                  creditos: row.creditos,
                  tipologia: row.tipologia,
                  prerrequisitos: row.prerrequisitos
                    ? row.prerrequisitos.split(",").map((p) => p.trim())
                    : [],
                }));
                setAsignaturas([...asignaturas, ...nuevas]);
              },
            });
          }}
          className="border p-2 w-full"
        />
      </div>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Código</th>
            <th className="p-2 border">Créditos</th>
            <th className="p-2 border">Tipología</th>
            <th className="p-2 border">Prerrequisitos</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.nombre}</td>
              <td className="border p-2">{a.codigo}</td>
              <td className="border p-2">{a.creditos}</td>
              <td className="border p-2">{a.tipologia}</td>
              <td className="border p-2">
                {a.prerrequisitos?.length > 0 ? a.prerrequisitos.join(", ") : "—"}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEditar(a)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmarEliminar(a.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">¿Eliminar esta asignatura?</h2>
            <p className="mb-6 text-sm text-gray-600">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarEliminar}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

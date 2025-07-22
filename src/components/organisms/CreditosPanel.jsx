import { useEffect, useState } from "react";
import CreditCounter from "../molecules/CreditCounter";

const CreditosPanel = ({ simulacion }) => {
  // Límites máximos para cada tipología
  const limites = {
    fundamentacion_obligatoria: 27,
    fundamentacion_optativa: 16,
    disciplinar_obligatoria: 57,
    disciplinar_optativa: 22,
    libre_eleccion: 32,
    trabajo_de_grado: 6
  }

  const creditos = {
    fundamentacionObligatoria: 0,
    fundamentacionOptativa: 0,
    disciplinarObligatoria: 0,
    disciplinarOptativa: 0,
    libreEleccion: 0,
    trabajoGrado: 0,
    total: 0
  }

  const [open, setOpen] = useState(window.innerWidth >= 640); // open by default on desktop

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setOpen(false);
      else setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calcular créditos basándose en las asignaturas de todas las matrículas
  if (simulacion && simulacion.matriculas) {
    simulacion.matriculas.forEach(matricula => {
      matricula.asignaturas.forEach(asignatura => {
        const creditosAsignatura = parseInt(asignatura.creditos) || 0
        
        // Normalizar tipología para manejo consistente
        const tipologiaNormalizada = asignatura.tipologia?.toLowerCase().replace(/\s+/g, '_');
        
      switch (tipologiaNormalizada) {
        case 'fundamentacion_obligatoria':
        case 'fundamentación_obligatoria':
          creditos.fundamentacionObligatoria += creditosAsignatura
          break
        case 'fundamentacion_optativa':
        case 'fundamentación_optativa':
          creditos.fundamentacionOptativa += creditosAsignatura
          break
        case 'disciplinar_obligatoria':
          creditos.disciplinarObligatoria += creditosAsignatura
          break
        case 'disciplinar_optativa':
          creditos.disciplinarOptativa += creditosAsignatura
          break
        case 'libre_eleccion':
        case 'libre_elección':
          creditos.libreEleccion += creditosAsignatura
          break
        case 'trabajo_de_grado':
          creditos.trabajoGrado += creditosAsignatura
          break
        default:
          console.warn('CreditosPanel - Tipología no reconocida:', asignatura.tipologia);
      }
    })
  })
  }

  // Calcular total aplicando límites máximos para cada tipología
  creditos.total = 
    Math.min(creditos.fundamentacionObligatoria, limites.fundamentacion_obligatoria) +
    Math.min(creditos.fundamentacionOptativa, limites.fundamentacion_optativa) +
    Math.min(creditos.disciplinarObligatoria, limites.disciplinar_obligatoria) +
    Math.min(creditos.disciplinarOptativa, limites.disciplinar_optativa) +
    Math.min(creditos.libreEleccion, limites.libre_eleccion) +
    Math.min(creditos.trabajoGrado, limites.trabajo_de_grado)

  return (
    <div className="px-6 pt-4 bg-white">
      {/* Accordion header for mobile */}
      <button
        className="w-full flex items-center justify-between sm:hidden py-3 font-semibold text-lg focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="creditos-panel-content"
      >
        Créditos Acumulados
        <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      {/* Always show title on desktop */}
      <h3 className="text-lg font-semibold mb-4 hidden sm:block">Créditos Acumulados</h3>
      {/* Accordion content */}
      <div
        id="creditos-panel-content"
        className={`credit-grid transition-all duration-300 overflow-hidden ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } sm:max-h-none sm:opacity-100`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <CreditCounter
          label="Fundamentación Obligatoria"
          value={creditos.fundamentacionObligatoria}
          total={27}
          tipologia="fundamentacion_obligatoria"
        />
        <CreditCounter
          label="Fundamentación Optativa"
          value={creditos.fundamentacionOptativa}
          total={16}
          tipologia="fundamentacion_optativa"
        />
        <CreditCounter
          label="Disciplinar Obligatoria"
          value={creditos.disciplinarObligatoria}
          total={57}
          tipologia="disciplinar_obligatoria"
        />
        <CreditCounter
          label="Disciplinar Optativa"
          value={creditos.disciplinarOptativa}
          total={22}
          tipologia="disciplinar_optativa"
        />
        <CreditCounter
          label="Libre Elección"
          value={creditos.libreEleccion}
          total={32}
          tipologia="libre_eleccion"
        />
        <CreditCounter
          label="Trabajo de Grado"
          value={creditos.trabajoGrado || 0}
          total={6}
          tipologia="trabajo_grado"
        />
        <CreditCounter
          label="TOTAL"
          value={creditos.total}
          total={160}
          isTotal={true}
        />
        {/* Mensaje especial de graduación */}
        {creditos.total >= 160 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 border-2 border-yellow-300 rounded-xl p-3 shadow-lg">
                <div className="text-xs text-unal-green-500 font-medium text-center mb-1 flex items-center justify-center gap-1">
                  ¡Felicitaciones, te graduaste!
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Has completado exitosamente todos los créditos académicos de la
                  <span className="font-semibold text-green-700"> Universidad Nacional de Colombia</span>,
                  la mejor universidad del país.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditosPanel;
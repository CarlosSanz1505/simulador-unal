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

  // Calcular créditos basándose en las asignaturas de todas las matrículas
  simulacion.matriculas.forEach(matricula => {
    matricula.asignaturas.forEach(asignatura => {
      const creditosAsignatura = parseInt(asignatura.creditos) || 0
      
      switch (asignatura.tipologia) {
        case 'fundamentacion_obligatoria':
          creditos.fundamentacionObligatoria += creditosAsignatura
          break
        case 'fundamentacion_optativa':
          creditos.fundamentacionOptativa += creditosAsignatura
          break
        case 'disciplinar_obligatoria':
          creditos.disciplinarObligatoria += creditosAsignatura
          break
        case 'disciplinar_optativa':
          creditos.disciplinarOptativa += creditosAsignatura
          break
        case 'libre_eleccion':
          creditos.libreEleccion += creditosAsignatura
          break
        case 'trabajo_de_grado':
          creditos.trabajoGrado += creditosAsignatura
          break
      }
    })
  })

  // Calcular total aplicando límites máximos para cada tipología
  creditos.total = 
    Math.min(creditos.fundamentacionObligatoria, limites.fundamentacion_obligatoria) +
    Math.min(creditos.fundamentacionOptativa, limites.fundamentacion_optativa) +
    Math.min(creditos.disciplinarObligatoria, limites.disciplinar_obligatoria) +
    Math.min(creditos.disciplinarOptativa, limites.disciplinar_optativa) +
    Math.min(creditos.libreEleccion, limites.libre_eleccion) +
    Math.min(creditos.trabajoGrado, limites.trabajo_de_grado)

  return (
    <div className="px-6 py-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">Créditos Acumulados</h3>
      <div className="credit-grid">
        <CreditCounter 
          label="Fund. Obligatoria" 
          value={creditos.fundamentacionObligatoria}
          total={27}
          tipologia="fundamentacion_obligatoria"
        />
        <CreditCounter 
          label="Fund. Optativa" 
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
      </div>
      
      {/* Mensaje especial de graduación */}
      {creditos.total >= 160 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4 font-bold text-green-600">
                ¡GRADUADO!
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-3">
                ¡Felicitaciones, te graduaste!
              </h2>
              <p className="text-lg text-gray-700 mb-2 leading-relaxed">
                Has completado exitosamente todos los créditos académicos de la 
                <span className="font-semibold text-green-700"> Universidad Nacional de Colombia</span>, 
                la mejor universidad del país
              </p>
              <p className="text-base text-gray-600 font-medium">
                ¡Muchos éxitos en tu vida profesional y laboral!
              </p>
              <div className="mt-4 text-xl font-semibold text-green-700">
                ¡Éxito en tu futuro profesional!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditosPanel;
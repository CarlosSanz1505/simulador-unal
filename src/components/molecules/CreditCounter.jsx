function CreditCounter({ label, value, total, isTotal = false }) {
  const percentage = total ? (value / total) * 100 : 0
  const isCompleted = value >= total && total > 0
  const creditosValidos = Math.min(value, total) // Solo contar hasta el límite
  
  return (
    <div className={`rounded-lg p-4 shadow-sm border transition-all duration-300 ${
      isTotal 
        ? 'border-unal-green-500 bg-unal-green-50' 
        : isCompleted 
        ? 'border-unal-green-300 bg-unal-green-50' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Mensaje de celebración cuando se completa */}
      {isCompleted && !isTotal && (
        <div className="text-xs text-unal-green-500 font-medium text-center mb-2 flex items-center justify-center gap-1">
          ¡Ya cumpliste con todos los créditos de este componente!
        </div>
      )}
      
      <div className={`font-bold text-center mb-2`}>
        {isTotal ? value : creditosValidos}
        {total && <span className="text-sm text-gray-500">/{total}</span>}
        {isCompleted && !isTotal && value > total && (
          <span className="text-xs text-gray-400 ml-1">({value} total)</span>
        )}
      </div>
      
      <div className="text-xs text-center text-gray-600 mb-3">
        {label}
      </div>
      
      {/* Barra de progreso */}
      {total && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 bg-unal-green-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-center text-gray-500">
            {Math.round(percentage)}% completado
          </div>
        </div>
      )}
    </div>
  )
}

export default CreditCounter

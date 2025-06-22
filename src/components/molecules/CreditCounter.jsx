function CreditCounter({ label, value, total, isTotal = false }) {
  const percentage = total ? (value / total) * 100 : 0

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${isTotal ? 'border-unal-green-500 bg-unal-green-50' : 'border-gray-200'}`}>
      <div className={`font-bold text-center mb-2 ${isTotal ? 'text-2xl text-unal-green-500' : 'text-lg text-gray-800'}`}>
        {value}
        {total && <span className="text-sm text-gray-500">/{total}</span>}
      </div>
      <div className="text-xs text-center text-gray-600 mb-2">
        {label}
      </div>
      {total && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isTotal ? 'bg-unal-green-500' : 'bg-unal-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default CreditCounter

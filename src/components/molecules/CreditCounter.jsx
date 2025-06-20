function CreditCounter({ label, value, isTotal = false }) {
  return (
    <div className="credit-card">
      <div className={`credit-number ${isTotal ? 'text-2xl' : ''}`}>
        {value}
      </div>
      <div className="credit-label">
        {label}
      </div>
    </div>
  )
}

export default CreditCounter

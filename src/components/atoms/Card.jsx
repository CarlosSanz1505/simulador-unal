function Card({ children, className = '', active = false, ...props }) {
  const baseClasses = 'card'
  const activeClass = active ? 'card-active' : ''
  const finalClasses = `${baseClasses} ${activeClass} ${className}`

  return (
    <div className={finalClasses} {...props}>
      {children}
    </div>
  )
}

export default Card

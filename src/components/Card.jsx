const Card = ({ title, description, credits, disabled, error }) => {
  return (
    <div className={`rounded-lg border
      shadow p-6 flex align-center justify-between items-center mb-3
      ${disabled && !error ? 'opacity-50 bg-gray-300 border-slate-900 cursor-not-allowed' 
        : error ? 'border-red-500 bg-red-100' : 'bg-white border-lime-700'}`}>
      <div className="flex flex-col h-full">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-gray-600 uppercase">{description}</p>
      </div>
      <span className="text-2xl font-bold text-gray-800">
        {credits}
      </span>
    </div>
  );
}
export default Card;
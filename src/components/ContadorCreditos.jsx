const ContadorCreditos = ({ creditos, tipologia }) => {
  return (
    <div className="shadow-lg rounded-lg p-4 mb-6 border border-lime-700 flex flex-col items-center justify-center">
      <h2 className="text-center font-semibold">{tipologia}</h2>
      <span className="text-xl font-bold">{creditos}</span>
    </div>
  );
}
export default ContadorCreditos;
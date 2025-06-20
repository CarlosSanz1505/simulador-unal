import Header from '../components/Header';

const Home = () => {
  return (
    <>
      <Header></Header>
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a la aplicación de gestión de asignaturas</h1>
      <p className="mb-4">Esta es la página principal. Desde aquí puedes navegar a las diferentes secciones de la aplicación.</p>
      <p className="mb-4">Utiliza el menú de navegación para acceder a las funcionalidades de administración de asignaturas.</p>
      </div>
    </>
  );
};

export default Home;
import Card from '../components/Card';
import ContadorCreditos from '../components/ContadorCreditos';
import Container from '../components/Container';
import Content from '../components/Content';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className="min-h-screen min-w-screen">
      <Header></Header>
      <Content>
        <Container>
          {/* Temporal */}
          <h1 className="text-2xl font-bold mb-4">Bienvenido a la aplicación de gestión de asignaturas</h1>
          <Container className="bg-white shadow-md/20 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Créditos acumulados</h2>
            <hr className="border-gray-300 mb-4" />
            <div className="flex gap-2">
              <ContadorCreditos creditos={3} tipologia="Fund. Obligatoria"/>
              <ContadorCreditos creditos={3} tipologia="Fund. Obligatoria"/>
              <ContadorCreditos creditos={3} tipologia="Fund. Obligatoria"/>
              <ContadorCreditos creditos={3} tipologia="Fund. Obligatoria"/>
              <ContadorCreditos creditos={3} tipologia="Fund. Obligatoria"/>
              <ContadorCreditos creditos={3} tipologia="Fund. Obligatoria"/>
            </div>
          </Container>
          <Card title="Cálculo Diferencial" description="fund. obligatoria" credits="3"></Card>
          <Card title="Cálculo Diferencial" description="fund. obligatoria" credits="3" disabled></Card>
          <Card title="Cálculo Diferencial" description="fund. obligatoria" credits="3" error></Card>
        </Container>
      </Content>
    </div>
  );
};

export default Home;
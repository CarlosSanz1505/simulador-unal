import logo from '../assets/images/logo-unal.png';

function Login() {
    return (
        <div className="login">
            <main 
            className="bg-white flex flex-col w-[90%] sm:min-w-[450px] sm:w-2/5 px-[50px] pt-[40px] pb-[100px] items-center min-h-full 
            m-auto relative sm:absolute top-0 sm:right-0">
                <img src={logo} width="200" className="m-[60px]" alt="Logo UNAL" title="Logo UNAL" />
                <h2 className="font-bold text-3xl mb-[30px] text-center">
                    ¡Bienvenido/a al <span className="text-emerald-700">Simulador UNAL</span>!</h2>
                <p className="text-justify my-2">
                    Aquí podrás organizar tu plan de estudio para el programa de 
                    Ingeniería de sistemas (Malla Curricular 3534) de la Universidad 
                    Nacional de Colombia, Sede Medellín.
                </p>
                <p className="text-justify my-2">
                    Con ayuda de este sitio web, podrás verificar fácilmente características 
                    importantes de tu plan, como los <b>créditos</b> que cubres por <b>categoría</b>,
                    o el cumplimiento de <b>prerrequisitos</b>.
                </p>
                <button className="sign-in m-[40px] shadow-md shadow-black/20 scale-110 rounded-[3px]"></button>
            </main>
        </div>
    );
};

export default Login;
function Login() {
    return (
        <div className="login flex justify-end">
            <main className="bg-white flex flex-col w-2/5 px-[50px] pt-[160px] items-center h-full absolute top-0 right-0">
                <h2 className="font-bold text-3xl m-[30px]">¡Bienvenido/a!</h2>
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
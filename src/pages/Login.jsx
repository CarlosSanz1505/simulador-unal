import React from 'react';

const GOOGLE_CLIENT_ID = '62094170016-ohbgt13m3tum4upbk7ql3r3mj9fpf5qs.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:5173/simulacion'; // Cambia esto según tu entorno

const getGoogleOAuthURL = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        access_type: 'online',
        response_type: 'token',
        prompt: 'consent',
        scope: [
            'openid',
            'profile',
            'email'
        ].join(' '),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
};

const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = getGoogleOAuthURL();
    };

    return (
        <div className="flex" style={{
            justifyContent: 'flex-end',
            height: '100vh'
        }}>
            <main className="bg-white flex flex-col w-2/5 p-20 items-center">
                <h2 className="font-bold text-3xl m-10">¡Bienvenido/a!</h2>
                <p>Texto introductorio</p>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        padding: '10px 20px',
                        background: '#4285F4',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    Iniciar sesión con Google
                </button>
            </main>
        </div>
    );
};

export default Login;
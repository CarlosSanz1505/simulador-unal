import React from 'react';

const GOOGLE_CLIENT_ID = 'TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:5731'; // Cambia esto según tu entorno

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
            <main className="bg-white" style={{
                width: '40%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '5rem'
            }}>
                <h2>¡Bienvenido!</h2>
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
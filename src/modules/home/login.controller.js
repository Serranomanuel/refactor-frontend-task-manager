import { LoginView } from './login.view.js';
import { navigateTo } from '../../routes/router.js'; 

export const initLogin = (container) => {
    container.innerHTML = LoginView;

    const btnToRegister = document.querySelector('#btn-to-register');
    const btnForgot     = document.querySelector('#btn-forgot');
    const loginForm     = document.querySelector('#login-form');

    btnToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/register');
    });

    btnForgot?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/forgot-password');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Obtener los datos del formulario
        const userDocument = loginForm.querySelector('#documento').value.trim();
        const password     = loginForm.querySelector('#password').value.trim();

        const btnSubmit = loginForm.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Ingresando...';

        try {
            // 2. PETICIÓN AL BACKEND REAL
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    document: userDocument, 
                    password: password 
                })
            });

            // Parseamos la respuesta del backend
            const data = await response.json();

            // Si el backend responde con un error (ej. 401 Unauthorized o 404 Not Found)
            if (!response.ok) {
                console.error("Respuesta de error del backend:", data); // Esto nos dirá exactamente por qué falló
                alert(data.message || 'Credenciales inválidas o no autorizadas');
                return;
            }

            // 3. Guardar tokens. 
            // Utilizamos '?' por si el backend devuelve directamente { accessToken: "..." } en lugar de { data: { accessToken: "..." } }
            const accessToken = data.data?.accessToken || data.accessToken;
            const refreshToken = data.data?.refreshToken || data.refreshToken;
            const user = data.data?.user || data.user;

            if (!accessToken) {
                console.error("El backend no devolvió un token válido:", data);
                alert("Error de estructura en el token del backend.");
                return;
            }

            sessionStorage.setItem('accessToken', accessToken);
            if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
            sessionStorage.setItem('user', JSON.stringify(user));

            // 4. Extraer roles para la redirección
            let roles = [];
            if (Array.isArray(user.roles)) {
                roles = user.roles.map(r => r.name.toLowerCase());
            } else if (user.role) {
                roles = [user.role.toLowerCase()];
            }

            // 5. Redirigir según el rol
            if (roles.includes('administrador') || roles.includes('admin')) {
                navigateTo('/admin');
            } else if (roles.includes('evaluador') || roles.includes('maestro')) {
                navigateTo('/maestro');
            } else if (roles.includes('aprendiz') || roles.includes('estudiante')) {
                navigateTo('/estudiante');
            } else {
                console.warn("Usuario sin rol reconocido:", user);
                alert('No tienes un rol asignado válido para ingresar.');
            }

        } catch (error) {
            // Si entra aquí, es porque el backend está apagado, la URL está mal o hay problemas de CORS
            console.error('Error crítico de conexión:', error);
            alert('No se pudo conectar con el servidor. Verifica que tu backend real esté encendido.');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Entrar';
        }
    });
};
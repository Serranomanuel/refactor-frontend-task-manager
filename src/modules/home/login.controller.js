import { LoginView } from './login.view.js';

export const initLogin = (container, navigateToRegister, navigateToAdmin, navigateToMaestro, navigateToEstudiante, navigateToForgot) => {
    container.innerHTML = LoginView;

    const btnToRegister = document.querySelector('#btn-to-register');
    const btnForgot     = document.querySelector('#btn-forgot');
    const loginForm     = document.querySelector('#login-form');

    btnToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToRegister();
    });

    btnForgot?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToForgot();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

    const userDocument = loginForm.querySelector('#documento').value.trim();
    const password     = loginForm.querySelector('#password').value.trim();

        // Deshabilitar el botón mientras se hace la petición
        const btnSubmit = loginForm.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Ingresando...';

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document: userDocument, password })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Credenciales inválidas');
                return;
            }

            // Guardar tokens y datos del usuario en sessionStorage
            // Con JWT: el accessToken se enviará en cada petición protegida
            // como header: Authorization: Bearer <accessToken>
            sessionStorage.setItem('accessToken',  data.data.accessToken);
            sessionStorage.setItem('refreshToken', data.data.refreshToken);
            sessionStorage.setItem('user',         JSON.stringify(data.data.user));

            // Navegar según el rol del usuario
            // Los roles vienen como array desde el backend: user.roles
            const roles = data.data.user.roles.map(r => r.name.toLowerCase());

            if (roles.includes('administrador')) {
                navigateToAdmin();
            } else if (roles.includes('evaluador')) {
                navigateToMaestro();
            } else if (roles.includes('aprendiz')) {
                navigateToEstudiante();
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('No se pudo conectar con el servidor. Verifique su conexión.');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Entrar';
        }
    });
};
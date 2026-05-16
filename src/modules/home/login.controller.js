import { LoginView } from './login.view.js';
import { navigateTo } from '../../routes/router.js';
import { login } from '../../backend/auth.js';
import { showNotification } from '../../utils/notifications.js';

export const initLogin = (container) => {
    container.innerHTML = LoginView;

    // SELECTORES DEL DOM
    const btnToRegister = document.querySelector('#btn-to-register');
    const btnForgot = document.querySelector('#btn-forgot');
    const loginForm = document.querySelector('#login-form');

    // Evento: Crear un nuevo registro
    btnToRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/register');
    });

    // Evento: Recuperar contraseña
    btnForgot?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/forgot-password');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Obtener los datos del formulario
        const userDocument = loginForm.querySelector('#documento').value.trim();
        const password = loginForm.querySelector('#password').value.trim();

        const btnSubmit = loginForm.querySelector('button[type="submit"]');

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Ingresando...';

        try {
            // Definir cuerpo de la solicitud
            const userData = {
                document: userDocument,
                password: password
            };

            // Enviar login al backend
            const response = await login(userData);

            // En caso de error o credenciales invalidas
            if (!response.success) {
                const confirm = (response.message || 'Credenciales inválidas o no autorizadas');
                showNotification(confirm, "error");

                return;
            };


            // Guardar tokens y datos del usuario en sessionStorage 
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const user = response.data.user;

            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);
            sessionStorage.setItem('user', JSON.stringify(user));

            // Redirigir a la vista inicial
            navigateTo('/admin');

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
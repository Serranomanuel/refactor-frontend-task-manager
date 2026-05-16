import { LoginView } from './login.view.js';
import { navigateTo } from '../../routes/router.js';
import { showToast } from '../../utils/toast.js';

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

        const userDocument = loginForm.querySelector('#documento').value.trim();
        const password     = loginForm.querySelector('#password').value.trim();

        const btnSubmit = loginForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Ingresando...';

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ document: userDocument, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message || 'Credenciales inválidas o no autorizadas', 'error');
                return;
            }

            const accessToken  = data.data?.accessToken  || data.accessToken;
            const refreshToken = data.data?.refreshToken || data.refreshToken;
            const user         = data.data?.user         || data.user;

            if (!accessToken) {
                showToast('Error de estructura en la respuesta del servidor.', 'error');
                return;
            }

            sessionStorage.setItem('accessToken', accessToken);
            if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
            sessionStorage.setItem('user', JSON.stringify(user));

            let rolNombre = '';

            // Fuente 1: roles RBAC (primer rol encontrado)
            if (Array.isArray(user.roles) && user.roles.length > 0) {
                rolNombre = user.roles[0].name.toLowerCase().trim();
            }

            // Fuente 2: campo role legacy como fallback
            if (!rolNombre && user.role) {
                rolNombre = user.role.toLowerCase().trim();
            }

            // Mapa de roles a rutas (incluye variantes en español e inglés)
            if (['administrador', 'admin'].includes(rolNombre)) {
                navigateTo('/admin');
            } else if (['evaluador', 'maestro', 'teacher'].includes(rolNombre)) {
                navigateTo('/maestro');
            } else if (['aprendiz', 'estudiante', 'student', 'user'].includes(rolNombre)) {
                navigateTo('/estudiante');
            } else {
                showToast(
                    'Tu cuenta no tiene un rol válido asignado. Contacta al administrador.',
                    'warning',
                    6000
                );
            }

        } catch (error) {
            console.error('Error crítico de conexión:', error);
            showToast('No se pudo conectar con el servidor. Verifica que el backend esté encendido.', 'error', 6000);
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Entrar';
        }
    });
};
import { ForgotPasswordView } from './forgot-password.view.js';

/**
 * @module forgot-password.controller
 * @description Controlador de la vista "¿Olvidaste tu contraseña?".
 *
 * Responsabilidades:
 *  1. Renderizar la vista en el contenedor principal.
 *  2. Escuchar el submit del formulario y llamar al backend.
 *  3. Mostrar el mensaje de respuesta (éxito o error).
 *  4. Manejar el botón de volver al login.
 */

/** URL base del backend. Lee la variable de entorno de Vite o usa localhost por defecto. */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Inicializa la pantalla de recuperación de contraseña.
 *
 * @param {HTMLElement} container      - Elemento del DOM donde se renderiza la vista (#app).
 * @param {Function}    navigateToLogin - Función de navegación para volver al login.
 */
export const initForgotPassword = (container, navigateToLogin) => {
    // Inyectar el HTML de la vista en el contenedor
    container.innerHTML = ForgotPasswordView;

    // Capturar elementos del DOM
    const form      = document.querySelector('#forgot-form');
    const msgBox    = document.querySelector('#forgot-msg');
    const submitBtn = document.querySelector('#btn-forgot-submit');

    // Botón "← Volver al inicio de sesión"
    document.querySelector('#btn-back-login').addEventListener('click', (e) => {
        e.preventDefault();
        navigateToLogin();
    });

    /**
     * Muestra un mensaje de feedback debajo del formulario.
     * @param {string}  text    - Texto del mensaje a mostrar.
     * @param {boolean} isError - Si es true aplica estilos de error (rojo), si no de éxito (verde).
     */
    const showMsg = (text, isError = false) => {
        msgBox.textContent        = text;
        msgBox.style.display      = 'block';
        msgBox.style.background   = isError ? '#f8d7da' : '#d4edda';
        msgBox.style.color        = isError ? '#721c24' : '#155724';
        msgBox.style.border       = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
    };

    /**
     * Maneja el envío del formulario.
     * Llama a POST /api/auth/forgot-password con el email ingresado.
     * El backend siempre responde con el mismo mensaje genérico
     * (no revela si el email está registrado o no).
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgBox.style.display  = 'none';

        // Deshabilitar botón mientras se procesa la petición
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Enviando...';

        const email = document.querySelector('#forgot-email').value.trim();

        try {
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email }),
            });

            const data = await res.json();

            // Mostrar el mensaje del backend (siempre genérico por seguridad)
            showMsg(data.message);
            form.reset();

        } catch {
            // Error de red: el servidor no está disponible
            showMsg('No se pudo conectar con el servidor.', true);
        } finally {
            // Rehabilitar el botón independientemente del resultado
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Enviar enlace';
        }
    });
};
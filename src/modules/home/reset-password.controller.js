import { ResetPasswordView } from './reset-password.view.js';

/**
 * @module reset-password.controller
 * @description Controlador de la vista "Nueva contraseña".
 *
 * Responsabilidades:
 *  1. Renderizar la vista en el contenedor principal.
 *  2. Leer el token de recuperación desde la URL.
 *  3. Validar que las contraseñas cumplan los requisitos y coincidan.
 *  4. Llamar al backend con el token y la nueva contraseña.
 *  5. Redirigir al login si el cambio fue exitoso.
 */

/** URL base del backend. Lee la variable de entorno de Vite o usa localhost por defecto. */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Inicializa la pantalla de restablecimiento de contraseña.
 *
 * @param {HTMLElement} container       - Elemento del DOM donde se renderiza la vista (#app).
 * @param {Function}    navigateToLogin - Función de navegación para ir al login tras el éxito.
 */
export const initResetPassword = (container, navigateToLogin) => {
    // Inyectar el HTML de la vista en el contenedor
    container.innerHTML = ResetPasswordView;

    // Capturar elementos del DOM
    const form      = document.querySelector('#reset-form');
    const msgBox    = document.querySelector('#reset-msg');
    const submitBtn = document.querySelector('#btn-reset-submit');

    /**
     * Muestra un mensaje de feedback debajo del formulario.
     * Debe definirse ANTES de cualquier llamada, incluyendo la validación del token.
     * @param {string}  text    - Texto del mensaje a mostrar.
     * @param {boolean} isError - Si es true aplica estilos de error (rojo), si no de éxito (verde).
     */
    const showMsg = (text, isError = false) => {
        msgBox.textContent      = text;
        msgBox.style.display    = 'block';
        msgBox.style.background = isError ? '#f8d7da' : '#d4edda';
        msgBox.style.color      = isError ? '#721c24' : '#155724';
        msgBox.style.border     = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
    };

    /**
     * Extraer el token desde el hash de la URL.
     * La URL tiene el formato: /#/reset-password?token=xxxxxx
     * Se divide el hash por '?' y se parsean los parámetros con URLSearchParams.
     */
    const token = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('token');

    // Si no hay token en la URL, bloquear el formulario inmediatamente
    if (!token) {
        showMsg('Enlace inválido. Solicita uno nuevo.', true);
        submitBtn.disabled = true;
    }

    /**
     * Maneja el envío del formulario.
     * Valida los campos en el frontend antes de llamar al backend,
     * evitando peticiones innecesarias con datos inválidos.
     *
     * Llama a POST /api/auth/reset-password con { token, newPassword }.
     * Si el backend responde con éxito, redirige al login tras 2 segundos.
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgBox.style.display = 'none';

        const newPassword     = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        // Validación 1: longitud mínima de 8 caracteres
        if (newPassword.length < 8) {
            showMsg('La contraseña debe tener al menos 8 caracteres.', true);
            return;
        }

        // Validación 2: ambas contraseñas deben coincidir
        if (newPassword !== confirmPassword) {
            showMsg('Las contraseñas no coinciden.', true);
            return;
        }

        // Deshabilitar botón mientras se procesa la petición
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Guardando...';

        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            // Si el backend rechaza el token (expirado o ya usado)
            if (!res.ok) {
                showMsg(data.message ?? 'Error al restablecer la contraseña.', true);
                return;
            }

            // Éxito: mostrar mensaje y redirigir al login después de 2 segundos
            showMsg('¡Contraseña actualizada! Redirigiendo...');
            setTimeout(() => navigateToLogin(), 2000);

        } catch {
            // Error de red: el servidor no está disponible
            showMsg('No se pudo conectar con el servidor.', true);
        } finally {
            // Rehabilitar el botón independientemente del resultado
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Cambiar contraseña';
        }
    });
};
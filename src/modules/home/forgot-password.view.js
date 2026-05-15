/**
 * @module forgot-password.view
 * @description Plantilla HTML de la vista "¿Olvidaste tu contraseña?".
 *
 * Renderiza un formulario con un campo de email.
 * El usuario ingresa su correo y el controlador se encarga
 * de llamar al backend para enviar el enlace de recuperación.
 *
 * Elementos del DOM que usa el controlador:
 *  - #forgot-form       : formulario principal
 *  - #forgot-email      : input del correo electrónico
 *  - #forgot-msg        : div para mostrar mensajes de éxito o error
 *  - #btn-forgot-submit : botón de envío (se deshabilita mientras carga)
 *  - #btn-back-login    : botón para volver al login
 */
export const ForgotPasswordView = `
<div class="auth-card">
    <h2>¿Olvidaste tu contraseña?</h2>
    <p style="color:#555; font-size:0.9rem; margin-bottom:1.5rem;">
    Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
    </p>
    <form id="forgot-form">
    <div class="input-group">
        <label for="forgot-email">Correo electrónico</label>
        <input type="email" id="forgot-email" placeholder="correo@ejemplo.com" required>
    </div>

    <!-- Div de mensaje: oculto por defecto, se muestra tras el submit -->
    <div id="forgot-msg" style="display:none; padding:0.8rem; border-radius:6px;
        margin-bottom:1rem; font-size:0.875rem;"></div>

    <button type="submit" id="btn-forgot-submit" class="btn-primary">Enviar enlace</button>
    </form>
    <div class="auth-options">
    <p><button id="btn-back-login" class="btn-link">← Volver al inicio de sesión</button></p>
    </div>
</div>
`;
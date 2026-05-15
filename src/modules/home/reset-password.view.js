/**
 * @module reset-password.view
 * @description Plantilla HTML de la vista "Nueva contraseña".
 *
 * El usuario llega a esta pantalla desde el enlace recibido en su email.
 * La URL contiene el token de recuperación como parámetro:
 *   /#/reset-password?token=xxxxxx
 *
 * El controlador lee ese token de la URL y lo envía al backend
 * junto con la nueva contraseña ingresada.
 *
 * Elementos del DOM que usa el controlador:
 *  - #reset-form         : formulario principal
 *  - #new-password       : input de la nueva contraseña
 *  - #confirm-password   : input para confirmar la contraseña
 *  - #reset-msg          : div para mostrar mensajes de éxito o error
 *  - #btn-reset-submit   : botón de envío (se deshabilita mientras carga)
 */
export const ResetPasswordView = `
<div class="auth-card">
    <h2>Nueva contraseña</h2>
    <p style="color:#555; font-size:0.9rem; margin-bottom:1.5rem;">
    Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
    </p>
    <form id="reset-form">
    <div class="input-group">
        <label for="new-password">Nueva contraseña</label>
        <input type="password" id="new-password" placeholder="Mínimo 8 caracteres" required>
    </div>
    <div class="input-group">
        <label for="confirm-password">Confirmar contraseña</label>
        <input type="password" id="confirm-password" placeholder="Repite la contraseña" required>
    </div>

    <!-- Div de mensaje: oculto por defecto, se muestra tras el submit -->
    <div id="reset-msg" style="display:none; padding:0.8rem; border-radius:6px;
        margin-bottom:1rem; font-size:0.875rem;"></div>

    <button type="submit" id="btn-reset-submit" class="btn-primary">Cambiar contraseña</button>
    </form>
</div>
`;
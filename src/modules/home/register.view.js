export const RegisterView = `
  <div class="auth-card">
    <h2>Crear Cuenta</h2>
    <form id="register-form">
      <div class="input-group">
        <label for="fullname">Nombre Completo</label>
        <input type="text" id="fullname" placeholder="Ej: Juan Pérez" required>
      </div>
      <div class="input-group">
        <label for="reg-documento">Documento</label>
        <input type="text" id="reg-documento" placeholder="Número de identidad" required>
      </div>
      <div class="input-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" placeholder="correo@escuela.com" required>
      </div>
      <div class="input-group">
        <label for="reg-password">Contraseña</label>
        <input type="password" id="reg-password" placeholder="Cree una contraseña" required>
      </div>
      <button type="submit" class="btn-primary">Registrarse</button>
    </form>
    <div class="auth-options">
      <p>¿Ya estás registrado? <button id="btn-to-login" class="btn-link">Iniciar sesión</button></p>
    </div>
  </div>
`;
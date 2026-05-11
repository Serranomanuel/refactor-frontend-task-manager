export const LoginView = `
  <div class="auth-card">
    <h2>Iniciar Sesión</h2>
    <form id="login-form">
      <div class="input-group">
        <label for="documento">Documento</label>
        <input type="text" id="documento" placeholder="Ingrese su documento" required>
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn-primary">Entrar</button>
    </form>
    <div class="auth-options">
      <a href="#" id="btn-forgot">¿Olvidaste tu contraseña?</a>
      <hr>
      <p>¿No tienes cuenta? <button id="btn-to-register" class="btn-link">Registrarse</button></p>
    </div>
  </div>
`;
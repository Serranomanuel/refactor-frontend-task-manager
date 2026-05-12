import { LoginView } from './login.view.js';

export const initLogin = (container, navigateToRegister, navigateToAdmin, navigateToMaestro, navigateToEstudiante) => {
  // 1. Renderizar la vista
  container.innerHTML = LoginView;

  // 2. Capturar elementos del DOM
  const btnToRegister = document.querySelector('#btn-to-register');
  const loginForm = document.querySelector('#login-form');

  // 3. Evento para ir a Registro
  if (btnToRegister) {
    btnToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToRegister(); 
    });
  }
  loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const doc = document.querySelector('#documento').value.toLowerCase().trim();

        if (doc === 'admin') navigateToAdmin();
        else if (doc === 'maestro') navigateToMaestro();
        else if (doc === 'estudiante') navigateToEstudiante();
        else alert('Usuario no válido');
    });

  // 4. Lógica de Inicio de Sesión
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Evita que la página recargue
      
      const documentoInput = document.querySelector('#documento').value.toLowerCase().trim();
      const passwordInput = document.querySelector('#password').value; // Aún no la validamos en el frontend mockeado

      // Simulación de Autenticación y Autorización por Roles
      if (documentoInput === 'admin') {
        console.log('Ingresando como Administrador...');
        navigateToAdmin();
      } 
      else if (documentoInput === 'maestro') {
        console.log('Ingresando como Maestro...');
        navigateToMaestro();
      } 
      else if (documentoInput === 'estudiante') {
        console.log('Ingresando como Estudiante...');
        navigateToEstudiante();
      } 
      else {
        // Mensaje de error temporal si no coincide
        alert('Usuario no reconocido. Para pruebas, ingresa "admin", "maestro" o "estudiante" en el campo de Documento.');
      }
    });
  }
};
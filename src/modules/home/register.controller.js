import { RegisterView } from './register.js';
import { isValidName, isValidDocument, isValidEmail, isValidPassword } from '../utils/validators.js';

export const initRegister = (container, navigateToLogin) => {
  container.innerHTML = RegisterView;

  const btnToLogin = document.querySelector('#btn-to-login');
  const registerForm = document.querySelector('#register-form');

  if (btnToLogin) {
    btnToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToLogin();
    });
  }

  // --- Función auxiliar para mostrar/ocultar errores ---
  const showError = (inputId, message) => {
    const input = document.querySelector(`#${inputId}`);
    const existingError = input.nextElementSibling;
    
    // Si ya hay un mensaje de error, lo removemos para actualizarlo
    if (existingError && existingError.classList.contains('error-message')) {
      existingError.remove();
    }
    
    input.classList.add('input-error');
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.textContent = message;
    input.insertAdjacentElement('afterend', errorSpan);
  };

  const clearErrors = () => {
    document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
  };

  // --- Lógica del formulario con validaciones ---
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(); // Limpiamos errores previos antes de validar

      let isValid = true;

      // 1. Obtener valores
      const name = document.querySelector('#fullname').value;
      const doc = document.querySelector('#reg-documento').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#reg-password').value;

      // 2. Ejecutar validaciones independientes
      if (!isValidName(name)) {
        showError('fullname', 'Ingrese un nombre válido (solo letras, mín. 3 caracteres).');
        isValid = false;
      }

      if (!isValidDocument(doc)) {
        showError('reg-documento', 'El documento debe contener entre 6 y 10 números.');
        isValid = false;
      }

      if (!isValidEmail(email)) {
        showError('email', 'Ingrese un correo electrónico válido.');
        isValid = false;
      }

      if (!isValidPassword(password)) {
        showError('reg-password', 'La contraseña debe tener al menos 6 caracteres.');
        isValid = false;
      }

      // 3. Evaluar resultado final
      if (isValid) {
        console.log('Validación exitosa. Datos listos para guardar:', { name, doc, email, password });
        alert('Registro exitoso (Simulado). Ahora puedes iniciar sesión.');
        navigateToLogin(); // Redirigimos al usuario al login
      } else {
        console.log('Errores en el formulario. Corrija los campos marcados en rojo.');
      }
    });
  }
};
import { RegisterView } from './register.view.js';
import { isValidName, isValidDocument, isValidEmail, isValidPassword } from '../../utils/validator.js';
import { UserRepository } from '../../repositories/UserRepository.js';

export const initRegister = (container, navigateToLogin) => {
  container.innerHTML = RegisterView;

  const btnToLogin = document.querySelector('#btn-to-login');
  const registerForm = document.querySelector('#register-form');

  if (btnToLogin) {
    btnToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#/login'
      return
    });
  }

  const showError = (inputId, message) => {
    const input = document.querySelector(`#${inputId}`);
    const existingError = input.nextElementSibling;
    
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

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors(); 

      let isValid = true;

      const name = document.querySelector('#fullname').value;
      const doc = document.querySelector('#reg-documento').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#reg-password').value;

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

      if (isValid) {
        const userData = {
          name: name,
          document: doc, 
          email: email,
          password: password,
          role: 'Estudiante' 
        };

        try {
          await UserRepository.create(userData);
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          
          if (navigateToLogin) {
            navigateToLogin();
          } else {
            window.location.hash = '#/login';
          }
          
        } catch (error) {
          console.error('Error guardando en la base de datos:', error);
          alert('Hubo un error al conectar con el servidor. Inténtalo más tarde.');
        }

      } else {
        console.log('Errores en el formulario. Corrija los campos marcados en rojo.');
      }
    });
  }
};
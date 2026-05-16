import { RegisterView } from './register.view.js';
import { navigateTo } from '../../routes/router.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const initRegister = (container, navigateToLogin) => {
  container.innerHTML = RegisterView;

  const btnToLogin   = document.querySelector('#btn-to-login');
  const registerForm = document.querySelector('#register-form');

  btnToLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/login');
  });

  // Utilidades de validación visual 

  const showError = (inputId, message) => {
    const input = document.querySelector(`#${inputId}`);
    const existing = input.nextElementSibling;
    if (existing?.classList.contains('error-message')) existing.remove();
    input.classList.add('input-error');
    const span = document.createElement('span');
    span.className = 'error-message';
    span.textContent = message;
    input.insertAdjacentElement('afterend', span);
  };

  const clearErrors = () => {
    document.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(m => m.remove());
  };

  // Validaciones alineadas con los esquemas Zod del backend 

  // Nombre: solo letras y espacios, entre 3 y 100 caracteres
  const isValidName = (name) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,100}$/.test(name.trim());

  // Documento: solo números, no inicia en 0, entre 5 y 20 dígitos (igual que auth.schema.js)
  const isValidDocument = (doc) => /^[1-9][0-9]{4,19}$/.test(doc);

  // Email: formato estándar
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Contraseña: mínimo 8, máximo 80 (igual que auth.schema.js del backend)
  const isValidPassword = (pw) => pw.length >= 8 && pw.length <= 80;

  // Submit

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name     = document.querySelector('#fullname').value.trim();
    const doc      = document.querySelector('#reg-documento').value.trim();
    const email    = document.querySelector('#email').value.trim();
    const password = document.querySelector('#reg-password').value;

    let isValid = true;

    if (!isValidName(name)) {
      showError('fullname', 'Ingrese un nombre válido (solo letras, entre 3 y 100 caracteres).');
      isValid = false;
    }

    if (!isValidDocument(doc)) {
      showError('reg-documento', 'El documento debe tener entre 5 y 20 dígitos y no puede iniciar en 0.');
      isValid = false;
    }

    if (!isValidEmail(email)) {
      showError('email', 'Ingrese un correo electrónico válido.');
      isValid = false;
    }

    if (!isValidPassword(password)) {
      showError('reg-password', 'La contraseña debe tener entre 8 y 80 caracteres.');
      isValid = false;
    }

    if (!isValid) return;

    const btnSubmit = registerForm.querySelector('button[type="submit"]');
    btnSubmit.disabled     = true;
    btnSubmit.textContent  = 'Registrando...';

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, document: doc, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el backend devuelve errores de campo, mostrarlos individualmente
        if (Array.isArray(data.errors)) {
          data.errors.forEach(err => {
            if (err.field === 'document') showError('reg-documento', err.message);
            else if (err.field === 'email') showError('email', err.message);
            else if (err.field === 'name') showError('fullname', err.message);
            else if (err.field === 'password') showError('reg-password', err.message);
          });
        } else {
          alert(data.message || 'Error al registrar el usuario.');
        }
        return;
      }

      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigateToLogin ? navigateToLogin() : navigateTo('/login');

    } catch (error) {
      console.error('Error de conexión en registro:', error);
      alert('No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
    } finally {
      btnSubmit.disabled    = false;
      btnSubmit.textContent = 'Registrarse';
    }
  });
};
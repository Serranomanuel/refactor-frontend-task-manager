// src/utils/validators.js

// Valida que el documento tenga solo números y entre 6 y 10 dígitos
export const isValidDocument = (doc) => {
  const regex = /^[0-9]{6,10}$/;
  return regex.test(doc);
};

// Valida el formato estándar de un correo electrónico
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valida que la contraseña tenga al menos 6 caracteres
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Valida que un texto (como un nombre) no esté vacío y tenga solo letras y espacios
export const isValidName = (name) => {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
  return regex.test(name.trim());
};
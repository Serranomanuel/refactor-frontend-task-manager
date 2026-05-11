import { UsersView } from './admin.users.js';

export const initUsersModule = (container) => {
  // Renderizar la vista
  container.innerHTML = UsersView;

  // Capturar elementos de la tabla y botón
  const tableBody = document.querySelector('#users-table-body');
  const btnCreateUser = document.querySelector('#btn-create-user');
  
  // Capturar elementos del Modal
  const userModal = document.querySelector('#user-modal');
  const btnCancelModal = document.querySelector('#btn-cancel-modal');
  const userForm = document.querySelector('#user-form');
  const modalTitle = document.querySelector('#modal-title');

  // Arreglo simulado de usuarios (ahora le haremos .push)
  const mockUsers = [
    { doc: '123456', nombre: 'Juan Pérez', email: 'juan@escuela.com', rol: 'Administrador' },
    { doc: '654321', nombre: 'María Gómez', email: 'maria@escuela.com', rol: 'Maestro' },
    { doc: '987654', nombre: 'Carlos López', email: 'carlos@escuela.com', rol: 'Estudiante' }
  ];

  // Función para inyectar los usuarios en la tabla
  const renderUsers = (users) => {
    tableBody.innerHTML = ''; // Limpiamos la tabla antes de reescribirla
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.doc}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td><span class="badge badge-${user.rol.toLowerCase()}">${user.rol}</span></td>
        <td>
          <button class="btn-action edit" data-doc="${user.doc}">Editar</button>
          <button class="btn-action delete" data-doc="${user.doc}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  };

  // Carga inicial
  renderUsers(mockUsers);

  // --- Funciones del Modal ---
  const openModal = (title = 'Crear Usuario') => {
    modalTitle.textContent = title;
    userModal.classList.remove('hidden');
  };

  const closeModal = () => {
    userModal.classList.add('hidden');
    userForm.reset(); // Limpia los campos del formulario
  };

  // Asignar eventos de apertura y cierre
  btnCreateUser.addEventListener('click', () => openModal('Crear Usuario'));
  btnCancelModal.addEventListener('click', closeModal);
  
  // --- Lógica Principal: Guardar Usuario ---
  userForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // 1. Obtener los valores ingresados
    const docInput = document.querySelector('#user-doc').value;
    const nameInput = document.querySelector('#user-name').value;
    const emailInput = document.querySelector('#user-email').value;
    const roleInput = document.querySelector('#user-role').value;

    // 2. Crear el objeto con la estructura de nuestros usuarios
    const newUser = {
      doc: docInput,
      nombre: nameInput,
      email: emailInput,
      rol: roleInput
    };

    // 3. Añadirlo a nuestra "base de datos" simulada
    mockUsers.push(newUser);

    // 4. Volver a renderizar la tabla con los datos actualizados
    renderUsers(mockUsers);

    // 5. Cerrar la ventana emergente
    closeModal();
  });
};
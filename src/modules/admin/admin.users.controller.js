import { UsersView } from './admin.users.js';
import { UserRepository } from '../../repositories/UserRepository.js';

export const initUsersModule = async (container) => {
  // 1. Inyectamos la vista limpia en el contenedor principal
  container.innerHTML = UsersView();

  // 2. Capturamos los elementos del DOM que vamos a usar
  const tableBody = document.querySelector('#users-table-body');
  const btnCreateUser = document.querySelector('#btn-create-user');
  const modal = document.querySelector('#user-modal');
  const userForm = document.querySelector('#user-form');
  const btnCancelModal = document.querySelector('#btn-cancel-modal');
  const modalTitle = document.querySelector('#modal-title');

  // Variable para saber si estamos editando o creando
  let editingUserId = null;

  // 3. Función para cargar y mostrar los usuarios desde la API
  const loadUsers = async () => {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando usuarios...</td></tr>';
    
    try {
      const users = await UserRepository.getAll();
      tableBody.innerHTML = ''; // Limpiamos el mensaje de carga
      
      if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay usuarios registrados.</td></tr>';
        return;
      }

      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.document || user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn-edit btn-secondary" data-id="${user.id}">Editar</button>
            <button class="btn-delete btn-danger" data-id="${user.id}">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error al conectar con el servidor.</td></tr>';
    }
  };

  // 4. Lógica para manejar el Modal
  const openModal = (isEdit = false) => {
    modalTitle.textContent = isEdit ? 'Editar Usuario' : 'Crear Usuario';
    modal.classList.remove('hidden');
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    userForm.reset(); // Limpiamos los inputs del formulario
    editingUserId = null; // Reiniciamos el estado
  };

  btnCreateUser.addEventListener('click', () => openModal(false));
  btnCancelModal.addEventListener('click', closeModal);

  // 5. Manejar el envío del formulario (Crear o Editar)
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Recolectamos los datos del componente del formulario
    const userData = {
      document: document.querySelector('#user-doc').value,
      name: document.querySelector('#user-name').value,
      email: document.querySelector('#user-email').value,
      role: document.querySelector('#user-role').value
    };

    try {
      if (editingUserId) {
        // Modo Edición: Usamos el método update
        await UserRepository.update(editingUserId, userData);
        alert('Usuario actualizado exitosamente');
      } else {
        // Modo Creación: Usamos el método create
        await UserRepository.create(userData);
        alert('Usuario creado exitosamente');
      }
      
      closeModal();
      await loadUsers(); // Recargamos la tabla para ver los cambios
    } catch (error) {
      console.error("Error guardando el usuario:", error);
      alert('Hubo un error al guardar los datos.');
    }
  });

  // 6. Delegación de eventos para los botones Editar y Eliminar de la tabla
  tableBody.addEventListener('click', async (e) => {
    const target = e.target;
    
    // Si el clic no fue en un botón con data-id, ignoramos
    const id = target.getAttribute('data-id');
    if (!id) return;

    // Acción: ELIMINAR
    if (target.classList.contains('btn-delete')) {
      const confirmar = confirm('¿Estás seguro de que deseas eliminar este usuario?');
      if (confirmar) {
        try {
          await UserRepository.delete(id);
          await loadUsers(); // Refrescamos la tabla
        } catch (error) {
          console.error("Error eliminando:", error);
          alert('Error al eliminar el usuario.');
        }
      }
    }

    // Acción: EDITAR
    if (target.classList.contains('btn-edit')) {
      try {
        // Obtenemos los datos frescos desde el servidor usando getById
        const user = await UserRepository.getById(id);
        
        // Rellenamos el componente del formulario
        document.querySelector('#user-doc').value = user.document || user.id;
        document.querySelector('#user-name').value = user.name;
        document.querySelector('#user-email').value = user.email;
        document.querySelector('#user-role').value = user.role;
        
        editingUserId = id; // Guardamos la referencia de qué usuario estamos editando
        openModal(true); // Abrimos el modal en modo edición
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
        alert('Error al cargar los datos del usuario.');
      }
    }
  });

  // 7. Carga inicial
  await loadUsers();
};        
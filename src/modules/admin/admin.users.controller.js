import { UsersView } from './admin.users.js';
import { navigateTo } from '../../routes/router.js';

// Con backend: se reemplaza por fetch GET /api/usuarios
// Campos: name, email, document, role (password_hash solo se envía al crear)
const mockUsers = [
    { document: '123456', name: 'Juan Pérez',   email: 'juan@escuela.com',   role: 'Administrador' },
    { document: '654321', name: 'María Gómez',  email: 'maria@escuela.com',  role: 'Maestro' },
    { document: '987654', name: 'Carlos López', email: 'carlos@escuela.com', role: 'Estudiante' }
];

export const initUsersModule = (container) => {
  container.innerHTML = UsersView;

  const tableBody      = document.querySelector('#users-table-body');
  const btnCreateUser  = document.querySelector('#btn-create-user');
  const userModal      = document.querySelector('#user-modal');
  const btnCancelModal = document.querySelector('#btn-cancel-modal');
  const userForm       = document.querySelector('#user-form');
  const modalTitle     = document.querySelector('#modal-title');

  // Modal helpers 
  const openModal = (title = 'Crear Usuario') => {
    modalTitle.textContent = title;
    userModal.classList.remove('hidden');
  };

  const closeModal = () => {
    userModal.classList.add('hidden');
    userForm.reset();
    userForm.removeAttribute('data-editing-document');
    navigateTo('/admin/usuarios');
  };

  // Render 
  const renderUsers = () => {
    tableBody.innerHTML = '';
    mockUsers.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.document}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
        <td>
          <button class="btn-action edit btn-edit-user"     data-document="${user.document}">Editar</button>
          <button class="btn-action delete btn-delete-user" data-document="${user.document}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
    attachTableEvents();
  };

  // Eventos de la tabla
  const attachTableEvents = () => {

    // ELIMINAR
    // Con backend: DELETE /api/usuarios/:document
    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userDoc = e.target.dataset.document;
        const index = mockUsers.findIndex(u => u.document === userDoc);
        if (index !== -1) {
          mockUsers.splice(index, 1);
          renderUsers();
        }
      });
    });

    // EDITAR
    // Con backend: GET /api/usuarios/:document para precargar el formulario
    document.querySelectorAll('.btn-edit-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userDoc = e.target.dataset.document;
        const user = mockUsers.find(u => u.document === userDoc);

        navigateTo(`/admin/usuarios/${userDoc}`);

        document.querySelector('#user-doc').value   = user.document;
        document.querySelector('#user-name').value  = user.name;
        document.querySelector('#user-email').value = user.email;
        document.querySelector('#user-role').value  = user.role;

        userForm.setAttribute('data-editing-document', userDoc);
        openModal(`Editar Usuario — ${user.name}`);
      });
    });
  };

  // Crear 
  btnCreateUser.addEventListener('click', () => {
    navigateTo('/admin/usuarios/nuevo');
    openModal('Crear Usuario');
  });

  btnCancelModal.addEventListener('click', closeModal);

  // Guardar (Crear o Editar)
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const documentInput = document.querySelector('#user-doc').value;
    const nameInput     = document.querySelector('#user-name').value;
    const emailInput    = document.querySelector('#user-email').value;
    const roleInput     = document.querySelector('#user-role').value;
    const editingDoc    = userForm.getAttribute('data-editing-document');

    if (editingDoc) {
      // EDITAR — Con backend: PUT /api/usuarios/:document
      // Body: { name, email, role }
      const index = mockUsers.findIndex(u => u.document === editingDoc);
      if (index !== -1) {
        mockUsers[index] = { document: documentInput, name: nameInput, email: emailInput, role: roleInput };
      }
    } else {
      // CREAR — Con backend: POST /api/usuarios
      // Body: { name, email, document, password_hash, role }
      mockUsers.push({ document: documentInput, name: nameInput, email: emailInput, role: roleInput });
    }

    renderUsers();
    closeModal();
  });

  // Carga inicial
  renderUsers();
};
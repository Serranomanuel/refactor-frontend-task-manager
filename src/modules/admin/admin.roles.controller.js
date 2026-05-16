import { RolesView } from './admin.roles.js';

export const initRolesModule = (container) => {
  container.innerHTML = RolesView;

  const tableBody = document.querySelector('#roles-table-body');
  const btnCreateRole = document.querySelector('#btn-create-role');
  
  // Elementos de Modales
  const roleModal = document.querySelector('#role-modal');
  const roleForm = document.querySelector('#role-form');
  const btnCancelRole = document.querySelector('#btn-cancel-role');
  
  const permissionsModal = document.querySelector('#permissions-modal');
  const permissionsForm = document.querySelector('#permissions-form');
  const btnCancelPermissions = document.querySelector('#btn-cancel-permissions');
  const permissionsList = document.querySelector('#permissions-list');
  const currentRoleNameSpan = document.querySelector('#current-role-name');

  // Permisos inmutables del sistema
  const systemPermissions = [
    'Crear Tareas', 'Editar Tareas', 'Eliminar Tareas', 'Asignar Tareas',
    'Crear Usuarios', 'Editar Usuarios', 'Eliminar Usuarios',
    'Asignar Roles', 'Calificar Trabajos'
  ];

  // Datos simulados de Roles
  const mockRoles = [
    { id: 1, nombre: 'Administrador', permisos: ['Crear Usuarios', 'Eliminar Usuarios', 'Asignar Roles'] },
    { id: 2, nombre: 'Maestro', permisos: ['Crear Tareas', 'Asignar Tareas', 'Calificar Trabajos'] },
    { id: 3, nombre: 'Estudiante', permisos: [] }
  ];

  let currentEditingRoleId = null;

  // Renderizar la tabla
  const renderRoles = () => {
    tableBody.innerHTML = ''; 
    mockRoles.forEach(role => {
      const tr = document.createElement('tr');
      const permisosHtml = role.permisos.length > 0 
        ? role.permisos.map(p => `<span class="badge" style="background:#e2e8f0; color:#333; margin: 2px;">${p}</span>`).join('')
        : '<span style="color:#999; font-size:0.85rem;">Sin permisos especiales</span>';

      tr.innerHTML = `
        <td><strong>${role.nombre}</strong></td>
        <td><div style="display: flex; flex-wrap: wrap; gap: 4px;">${permisosHtml}</div></td>
        <td>
          <button class="btn-action edit btn-manage-perms" data-id="${role.id}">Permisos</button>
          <button class="btn-action delete btn-delete-role" data-id="${role.id}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    attachTableEvents();
  };

  // Eventos para botones dentro de la tabla generada
  const attachTableEvents = () => {
    document.querySelectorAll('.btn-manage-perms').forEach(btn => {
      btn.addEventListener('click', (e) => openPermissionsModal(Number(e.target.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete-role').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        const index = mockRoles.findIndex(r => r.id === id);
        if(index !== -1) {
          mockRoles.splice(index, 1);
          renderRoles();
        }
      });
    });
  };

  renderRoles();

  // --- Lógica Modal Crear Rol ---
  btnCreateRole.addEventListener('click', () => roleModal.classList.remove('hidden'));
  btnCancelRole.addEventListener('click', () => {
    roleModal.classList.add('hidden');
    roleForm.reset();
  });

  roleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRole = {
      id: Date.now(),
      nombre: document.querySelector('#role-name').value,
      permisos: []
    };
    mockRoles.push(newRole);
    renderRoles();
    roleModal.classList.add('hidden');
    roleForm.reset();
  });

  // --- Lógica Modal Permisos ---
  const openPermissionsModal = (roleId) => {
    currentEditingRoleId = roleId;
    const role = mockRoles.find(r => r.id === roleId);
    currentRoleNameSpan.textContent = role.nombre;
    
    // Generar checkboxes dinámicamente basados en los permisos del sistema
    permissionsList.innerHTML = systemPermissions.map(perm => {
      const isChecked = role.permisos.includes(perm) ? 'checked' : '';
      return `
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
          <input type="checkbox" value="${perm}" ${isChecked}>
          ${perm}
        </label>
      `;
    }).join('');

    permissionsModal.classList.remove('hidden');
  };

  btnCancelPermissions.addEventListener('click', () => {
    permissionsModal.classList.add('hidden');
    currentEditingRoleId = null;
  });

  permissionsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentEditingRoleId) {
      const roleIndex = mockRoles.findIndex(r => r.id === currentEditingRoleId);
      // Recolectar todos los checkboxes seleccionados
      const selectedCheckboxes = permissionsList.querySelectorAll('input[type="checkbox"]:checked');
      const newPermissions = Array.from(selectedCheckboxes).map(cb => cb.value);
      
      // Actualizar el rol y recargar
      mockRoles[roleIndex].permisos = newPermissions;
      renderRoles();
      permissionsModal.classList.add('hidden');
    }
  });
};
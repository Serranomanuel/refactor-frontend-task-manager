import { UsersView } from './users.view.js';
import { showToast, showConfirm } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken') || sessionStorage.getItem('token')}`,
});

export const initUsersModule = async (container, userPermissions = []) => {
    container.innerHTML = UsersView();

    const tableBody      = document.querySelector('#users-table-body');
    const btnCreateUser  = document.querySelector('#btn-create-user');
    const titleEl        = document.querySelector('#users-title');
    const modal          = document.querySelector('#user-modal');
    const userForm       = document.querySelector('#user-form');
    const btnCancelModal = document.querySelector('#btn-cancel-modal');
    const modalTitle     = document.querySelector('#modal-title');
    const rolesGroup     = document.querySelector('#roles-group');

    const canCreate = userPermissions.includes('Crear Usuarios');
    const canEdit   = userPermissions.includes('Editar Usuarios');
    const canDelete = userPermissions.includes('Eliminar Usuarios');

    if (canCreate) btnCreateUser.style.display = 'block';
    if (!canCreate && !canEdit) {
        titleEl.textContent = 'Estudiantes';
        if (rolesGroup) rolesGroup.style.display = 'none';
    }

    let editingUserId = null;
    let localUsers = [];

    const loadRbacRoles = async (selectedRoleIds = []) => {
        const rbacList = document.querySelector('#rbac-roles-list');
        if (!rbacList) return;

        rbacList.innerHTML = '<span style="color:#666;">Cargando roles...</span>';
        try {
            const res  = await fetch(`${API_URL}/api/roles`, { headers: getHeaders() });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Error al obtener roles');

            const roles = json.data ?? [];
            if (!roles.length) {
                rbacList.innerHTML = '<span style="color:#999;">No hay roles disponibles.</span>';
                return;
            }

            rbacList.innerHTML = roles.map(role => `
                <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; cursor:pointer;">
                    <input type="checkbox" class="rbac-role-checkbox" value="${role.id}" ${selectedRoleIds.includes(role.id) ? 'checked' : ''}>
                    ${role.name}
                </label>
            `).join('');
        } catch (err) {
            rbacList.innerHTML = '<span style="color:red;">Error al cargar roles.</span>';
            console.error(err);
        }
    };

    const getSelectedRoleIds = () =>
        Array.from(document.querySelectorAll('.rbac-role-checkbox:checked')).map(cb => Number(cb.value));

    const loadUsers = async () => {
        if (!tableBody) return;
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Cargando usuarios...</td></tr>';

        try {
            const endpoint = (!canCreate && !canEdit) ? `${API_URL}/users/students` : `${API_URL}/users`;
            const resUsers = await fetch(endpoint, { headers: getHeaders() });
            
            if (resUsers.status === 401) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red; padding:2rem;">Sesión inválida o sin permisos.</td></tr>';
                return;
            }

            const jsonUsers = await resUsers.json();
            if (!resUsers.ok) throw new Error(jsonUsers.message || 'Error al obtener usuarios');

            const users = jsonUsers.data ?? jsonUsers ?? [];
            localUsers = users;

            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No hay usuarios registrados.</td></tr>';
                return;
            }

            tableBody.innerHTML = '';

            for (const user of users) {
                let rolesDisplay = 'Usuario';
                let badgeClass = 'badge-user';

                try {
                    const rolesRes = await fetch(`${API_URL}/users/${user.id}/roles`, { headers: getHeaders() });
                    if (rolesRes.ok) {
                        const rolesJson = await rolesRes.json();
                        const roles = rolesJson.data ?? rolesJson ?? [];
                        if (roles.length > 0) {
                            rolesDisplay = roles.map(r => r.name).join(', ');
                            const firstRole = roles[0].name.toLowerCase().replace(/\s+/g, '-');
                            badgeClass = `badge-${firstRole}`;
                        }
                    }
                } catch (err) {}

                const tr = document.createElement('tr');
                let actions = '';
                if (canEdit) actions += `<button class="btn-action edit btn-edit" data-id="${user.id}">Editar</button>`;
                if (canDelete) actions += `<button class="btn-action delete btn-delete" data-id="${user.id}">Eliminar</button>`;

                tr.innerHTML = `
                    <td>${user.document || ''}</td>
                    <td>${user.name || ''}</td>
                    <td>${user.email || ''}</td>
                    <td><span class="badge ${badgeClass}">${rolesDisplay}</span></td>
                    <td>${actions}</td>
                `;
                tableBody.appendChild(tr);
            }
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red; padding:2rem;">Error al conectar con el servidor.</td></tr>';
        }
    };

    const openModal = async (isEdit = false, selectedRoleIds = []) => {
        if (!modal || !modalTitle) return;
        modalTitle.textContent = isEdit ? 'Editar Usuario' : 'Crear Usuario';
        
        const passwordInput = document.querySelector('#user-password');
        if (passwordInput) {
            if (isEdit) {
                passwordInput.removeAttribute('required');
                passwordInput.placeholder = 'Dejar vacío para no cambiar';
            } else {
                passwordInput.setAttribute('required', 'true');
                passwordInput.placeholder = '';
            }
        }

        if (canCreate || canEdit) await loadRbacRoles(selectedRoleIds);
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
        if (userForm) userForm.reset();
        editingUserId = null;
    };

    if (btnCreateUser) btnCreateUser.addEventListener('click', () => openModal(false));
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userData = {
                document: document.querySelector('#user-doc')?.value.trim() ?? '',
                name:     document.querySelector('#user-name')?.value.trim() ?? '',
                email:    document.querySelector('#user-email')?.value.trim() ?? '',
            };

            const passwordInput = document.querySelector('#user-password');
            const password = passwordInput ? passwordInput.value : '';
            if (password) userData.password = password;

            const selectedRoleIds = (canCreate || canEdit) ? getSelectedRoleIds() : [];

            const btnSubmit = userForm.querySelector('button[type="submit"]');
            if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = 'Guardando...'; }

            try {
                let userId = editingUserId;

                if (editingUserId) {
                    const res = await fetch(`${API_URL}/users/${editingUserId}`, {
                        method:  'PATCH', headers: getHeaders(), body: JSON.stringify(userData),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.message || 'Error al actualizar');
                } else {
                    const res = await fetch(`${API_URL}/users`, {
                        method:  'POST', headers: getHeaders(), body: JSON.stringify(userData),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.message || 'Error al crear');
                    userId = json.data?.id ?? json.id;
                }

                if (userId && selectedRoleIds.length > 0) {
                    await fetch(`${API_URL}/api/userRoles/assign`, {
                        method:  'POST', headers: getHeaders(),
                        body:    JSON.stringify({ userId: String(userId), roleIds: selectedRoleIds.map(String) }),
                    });
                }

                showToast(editingUserId ? 'Usuario actualizado.' : 'Usuario creado.', 'success');
                closeModal();
                await loadUsers();
            } catch (err) {
                showToast(err.message || 'Error al guardar.', 'error');
            } finally {
                if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = 'Guardar'; }
            }
        });
    }

    if (tableBody) {
        tableBody.addEventListener('click', async (e) => {
            const target = e.target.closest('[data-id]');
            if (!target) return;
            const id = target.getAttribute('data-id');

            if (target.classList.contains('btn-delete')) {
                const confirmed = await showConfirm('¿Eliminar este usuario?');
                if (!confirmed) return;
                try {
                    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: getHeaders() });
                    showToast('Usuario eliminado.', 'success');
                    await loadUsers();
                } catch (err) { showToast('Error al eliminar.', 'error'); }
            }

            if (target.classList.contains('btn-edit')) {
                try {
                    const user = localUsers.find(u => String(u.id) === String(id));
                    if (!user) throw new Error('No se encontraron datos locales');

                    let currentRoleIds = [];
                    try {
                        const rolesRes = await fetch(`${API_URL}/users/${id}/roles`, { headers: getHeaders() });
                        if (rolesRes.ok) {
                            const rolesJson = await rolesRes.json();
                            const rolesData = rolesJson.data ?? rolesJson ?? [];
                            currentRoleIds = rolesData.map(r => r.id);
                        }
                    } catch (roleErr) { console.warn('Roles no legibles.'); }

                    document.querySelector('#user-doc').value   = user.document ?? '';
                    document.querySelector('#user-name').value  = user.name ?? '';
                    document.querySelector('#user-email').value = user.email ?? '';

                    editingUserId = id;
                    await openModal(true, currentRoleIds);
                } catch (err) {
                    showToast('Error al abrir edición.', 'error');
                }
            }
        });
    }

    await loadUsers();
};
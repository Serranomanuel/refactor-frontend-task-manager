import { UsersView } from './admin.users.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import { showToast, showConfirm } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
});

export const initUsersModule = async (container) => {
    container.innerHTML = UsersView();

    const tableBody      = document.querySelector('#users-table-body');
    const btnCreateUser  = document.querySelector('#btn-create-user');
    const modal          = document.querySelector('#user-modal');
    const userForm       = document.querySelector('#user-form');
    const btnCancelModal = document.querySelector('#btn-cancel-modal');
    const modalTitle     = document.querySelector('#modal-title');

    let editingUserId = null;

    // Cargar roles RBAC como checkboxes
    const loadRbacRoles = async (selectedRoleIds = []) => {
        const rbacList = document.querySelector('#rbac-roles-list');
        rbacList.innerHTML = 'Cargando roles...';
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
                <label style="display:flex; align-items:center; gap:0.5rem;
                    margin-bottom:0.4rem; cursor:pointer;">
                    <input
                        type="checkbox"
                        class="rbac-role-checkbox"
                        value="${role.id}"
                        ${selectedRoleIds.includes(role.id) ? 'checked' : ''}
                    >
                    ${role.name}
                </label>
            `).join('');
        } catch (err) {
            rbacList.innerHTML = '<span style="color:red;">Error al cargar roles.</span>';
            console.error(err);
        }
    };

    const getSelectedRoleIds = () =>
        Array.from(document.querySelectorAll('.rbac-role-checkbox:checked'))
            .map(cb => Number(cb.value));

    // Renderizar tabla 
    const loadUsers = async () => {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Cargando usuarios...</td></tr>';
        try {
            const users = await UserRepository.getAll();
            if (!users || users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No hay usuarios registrados.</td></tr>';
                return;
            }

            tableBody.innerHTML = '';

            // CORRECCIÓN CRÍTICA: Para cada usuario, consultar sus roles RBAC reales
            for (const user of users) {
                let rolesDisplay = 'Sin rol';
                let badgeClass = 'badge-user';

                try {
                    const rolesRes = await fetch(`${API_URL}/api/users/${user.id}/roles`, { headers: getHeaders() });
                    const rolesJson = await rolesRes.json();
                    const roles = rolesJson.data ?? [];

                    if (roles.length > 0) {
                        rolesDisplay = roles.map(r => r.name).join(', ');
                        // Usar el primer rol para el color del badge
                        const firstRole = roles[0].name.toLowerCase().replace(/\s+/g, '-');
                        badgeClass = `badge-${firstRole}`;
                    }
                } catch (err) {
                    console.warn(`Error cargando roles para usuario ${user.id}:`, err);
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.document}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${badgeClass}">${rolesDisplay}</span></td>
                    <td>
                        <button class="btn-action edit btn-edit" data-id="${user.id}">Editar</button>
                        <button class="btn-action delete btn-delete" data-id="${user.id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red; padding:2rem;">Error al conectar con el servidor.</td></tr>';
        }
    };

    // Modal 
    const openModal = async (isEdit = false, selectedRoleIds = []) => {
        modalTitle.textContent = isEdit ? 'Editar Usuario' : 'Crear Usuario';

        const passwordInput = document.querySelector('#user-password');
        if (isEdit) {
            passwordInput.removeAttribute('required');
            passwordInput.placeholder = 'Dejar vacío para no cambiar';
        } else {
            passwordInput.setAttribute('required', 'true');
            passwordInput.placeholder = '';
        }

        await loadRbacRoles(selectedRoleIds);
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        userForm.reset();
        editingUserId = null;
    };

    btnCreateUser.addEventListener('click', () => openModal(false));
    btnCancelModal.addEventListener('click', closeModal);

    // Submit 
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            document: document.querySelector('#user-doc').value.trim(),
            name:     document.querySelector('#user-name').value.trim(),
            email:    document.querySelector('#user-email').value.trim(),
        };

        const password = document.querySelector('#user-password').value;
        if (password) userData.password = password;

        const selectedRoleIds = getSelectedRoleIds();

        const btnSubmit = userForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            let userId = editingUserId;

            if (editingUserId) {
                const res = await fetch(`${API_URL}/api/users/${editingUserId}`, {
                    method:  'PATCH',
                    headers: getHeaders(),
                    body:    JSON.stringify(userData),
                });
                const json = await res.json();

                if (!res.ok) {
                    const msgs = Array.isArray(json.errors)
                        ? json.errors.map(err => `${err.field ? err.field + ': ' : ''}${err.message ?? err}`).join('\n')
                        : json.message;
                    showToast('Error al actualizar: ' + msgs, 'error', 6000);
                    return;
                }
            } else {
                const res  = await fetch(`${API_URL}/api/users`, {
                    method:  'POST',
                    headers: getHeaders(),
                    body:    JSON.stringify(userData),
                });
                const json = await res.json();

                if (!res.ok) {
                    const msgs = Array.isArray(json.errors)
                        ? json.errors.map(err => `${err.field ? err.field + ': ' : ''}${err.message ?? err}`).join('\n')
                        : json.message;
                    showToast('Error al crear el usuario:\n' + msgs, 'error', 7000);
                    return;
                }

                userId = json.data?.id ?? json.data?.[0]?.id;
            }

            // Sincronizar roles RBAC
            if (userId) {
                const roleRes = await fetch(`${API_URL}/api/userRoles/assign`, {
                    method:  'POST',
                    headers: getHeaders(),
                    body:    JSON.stringify({
                        userId:  String(userId),
                        roleIds: selectedRoleIds.map(String),
                    }),
                });
                if (!roleRes.ok) {
                    const roleJson = await roleRes.json();
                    showToast('Usuario guardado pero error asignando roles: ' + roleJson.message, 'warning', 5000);
                }
            }

            showToast(
                editingUserId ? 'Usuario actualizado exitosamente.' : 'Usuario creado exitosamente.',
                'success'
            );
            closeModal();
            await loadUsers();

        } catch (err) {
            console.error('Error guardando el usuario:', err);
            showToast('Hubo un error al guardar los datos. Revisa la consola.', 'error');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Guardar';
        }
    });

    // Delegación de eventos en la tabla 
    tableBody.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!id) return;

        // ELIMINAR
        if (e.target.classList.contains('btn-delete')) {
            const confirmed = await showConfirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
            if (!confirmed) return;
            try {
                await UserRepository.delete(id);
                showToast('Usuario eliminado correctamente.', 'success');
                await loadUsers();
            } catch (err) {
                console.error('Error eliminando:', err);
                showToast('Error al eliminar el usuario.', 'error');
            }
        }

        // EDITAR
        if (e.target.classList.contains('btn-edit')) {
            try {
                const user = await UserRepository.getById(id);

                // Obtener roles RBAC actuales
                const rolesRes  = await fetch(`${API_URL}/api/users/${id}/roles`, { headers: getHeaders() });
                const rolesJson = await rolesRes.json();
                const currentRoleIds = (rolesJson.data || []).map(r => r.id);

                // Rellenar formulario
                document.querySelector('#user-doc').value   = user.document;
                document.querySelector('#user-name').value  = user.name;
                document.querySelector('#user-email').value = user.email;

                editingUserId = id;
                await openModal(true, currentRoleIds);

            } catch (err) {
                console.error('Error obteniendo datos del usuario:', err);
                showToast('Error al cargar los datos del usuario.', 'error');
            }
        }
    });

    // Carga inicial
    await loadUsers();
};
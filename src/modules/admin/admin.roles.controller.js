import { RolesView } from './admin.roles.js';
import { showToast, showConfirm } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
});

export const initRolesModule = async (container) => {
    container.innerHTML = RolesView;

    const tableBody           = document.querySelector('#roles-table-body');
    const btnCreateRole       = document.querySelector('#btn-create-role');
    const roleModal           = document.querySelector('#role-modal');
    const roleForm            = document.querySelector('#role-form');
    const btnCancelRole       = document.querySelector('#btn-cancel-role');
    const permissionsModal    = document.querySelector('#permissions-modal');
    const permissionsForm     = document.querySelector('#permissions-form');
    const btnCancelPermissions = document.querySelector('#btn-cancel-permissions');
    const permissionsList     = document.querySelector('#permissions-list');
    const currentRoleNameSpan = document.querySelector('#current-role-name');

    let currentEditingRoleId = null;

    // Cargar y renderizar roles 
    const loadRoles = async () => {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:2rem;">Cargando roles...</td></tr>';
        try {
            const res  = await fetch(`${API_URL}/api/roles`, { headers: getHeaders() });
            const json = await res.json();
            const roles = json.data ?? [];

            if (roles.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:2rem;">No hay roles registrados.</td></tr>';
                return;
            }

            tableBody.innerHTML = '';
            roles.forEach(role => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${role.name}</strong></td>
                    <td style="color:#555; font-size:0.9rem;">${role.description ?? '—'}</td>
                    <td>
                        <button class="btn-action edit btn-manage-perms" data-id="${role.id}" data-name="${role.name}">Permisos</button>
                        <button class="btn-action delete btn-delete-role" data-id="${role.id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            attachTableEvents();
        } catch (error) {
            console.error('Error cargando roles:', error);
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red; padding:2rem;">Error al conectar con el servidor.</td></tr>';
        }
    };

    const attachTableEvents = () => {
        // Gestionar permisos
        document.querySelectorAll('.btn-manage-perms').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openPermissionsModal(
                    Number(e.target.dataset.id),
                    e.target.dataset.name
                );
            });
        });

        // Eliminar rol
        document.querySelectorAll('.btn-delete-role').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await showConfirm('¿Eliminar este rol? Se quitará de todos los usuarios que lo tengan.');
                if (!confirmed) return;
                try {
                    const res = await fetch(`${API_URL}/api/roles/${e.target.dataset.id}`, {
                        method: 'DELETE',
                        headers: getHeaders()
                    });
                    if (!res.ok) throw new Error();
                    showToast('Rol eliminado correctamente.', 'success');
                    await loadRoles();
                } catch {
                    showToast('Error al eliminar el rol.', 'error');
                }
            });
        });
    };

    // Modal crear rol
    btnCreateRole.addEventListener('click', () => roleModal.classList.remove('hidden'));
    btnCancelRole.addEventListener('click', () => {
        roleModal.classList.add('hidden');
        roleForm.reset();
    });

    roleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name:        document.querySelector('#role-name').value.trim(),
            description: document.querySelector('#role-description').value.trim(),
        };

        const btnSubmit = roleForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            const res  = await fetch(`${API_URL}/api/roles`, {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) {
                showToast(json.message ?? 'Error al crear el rol.', 'error');
                return;
            }
            showToast('Rol creado exitosamente.', 'success');
            roleModal.classList.add('hidden');
            roleForm.reset();
            await loadRoles();
        } catch {
            showToast('Error de conexión al crear el rol.', 'error');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Guardar Rol';
        }
    });

    // Modal permisos
    const openPermissionsModal = async (roleId, roleName) => {
        currentEditingRoleId      = roleId;
        currentRoleNameSpan.textContent = roleName;
        permissionsList.innerHTML = 'Cargando permisos...';
        permissionsModal.classList.remove('hidden');

        try {
            const [allRes, roleRes] = await Promise.all([
                fetch(`${API_URL}/api/permissions`,         { headers: getHeaders() }),
                fetch(`${API_URL}/api/roles/${roleId}/permissions`, { headers: getHeaders() }),
            ]);

            const allJson  = await allRes.json();
            const roleJson = await roleRes.json();

            const allPerms      = allJson.data  ?? [];
            const assignedIds   = new Set((roleJson.data ?? []).map(p => p.id));

            permissionsList.innerHTML = allPerms.map(perm => `
                <label>
                    <input
                        type="checkbox"
                        class="perm-checkbox"
                        value="${perm.id}"
                        ${assignedIds.has(perm.id) ? 'checked' : ''}
                    >
                    <span class="checkbox-label-text">
                        <strong>${perm.name}</strong>
                        <span>(${perm.code})</span>
                    </span>
                </label>
            `).join('');
        } catch {
            permissionsList.innerHTML = '<span style="color:red; padding:0.5rem;">Error al cargar permisos.</span>';
        }
    };

    btnCancelPermissions.addEventListener('click', () => {
        permissionsModal.classList.add('hidden');
        currentEditingRoleId = null;
    });

    permissionsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentEditingRoleId) return;

        const permissionIds = Array.from(
            document.querySelectorAll('.perm-checkbox:checked')
        ).map(cb => Number(cb.value));

        const btnSubmit = permissionsForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            const res = await fetch(`${API_URL}/api/roles/${currentEditingRoleId}/permissions`, {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify({ permissionIds }),
            });
            if (!res.ok) throw new Error();
            showToast('Permisos actualizados exitosamente.', 'success');
            permissionsModal.classList.add('hidden');
            currentEditingRoleId = null;
        } catch {
            showToast('Error al guardar los permisos.', 'error');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Guardar Permisos';
        }
    });

    await loadRoles();
};
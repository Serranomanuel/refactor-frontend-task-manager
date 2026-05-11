export const RolesView = `
  <div class="module-header">
    <h3>Gestión de Roles y Permisos</h3>
    <button id="btn-create-role" class="btn-primary" style="width: auto; padding: 0.5rem 1rem;">+ Nuevo Rol</button>
  </div>
  
  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Nombre del Rol</th>
          <th>Permisos Asignados</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="roles-table-body">
        </tbody>
    </table>
  </div>

  <div id="role-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2>Crear Nuevo Rol</h2>
      <form id="role-form">
        <div class="input-group">
          <label for="role-name">Nombre del Rol</label>
          <input type="text" id="role-name" placeholder="Ej: Coordinador" required>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-role" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Rol</button>
        </div>
      </form>
    </div>
  </div>

  <div id="permissions-modal" class="modal hidden">
    <div class="modal-content auth-card" style="max-width: 500px;">
      <h2>Gestionar Permisos: <span id="current-role-name"></span></h2>
      <p style="font-size: 0.85rem; color: #555; text-align: left; margin-bottom: 1rem;">
        Seleccione los permisos que desea asignar a este rol. Los permisos del sistema no pueden ser creados ni eliminados, solo asignados.
      </p>
      <form id="permissions-form" style="text-align: left;">
        <div id="permissions-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
          </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-permissions" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Permisos</button>
        </div>
      </form>
    </div>
  </div>
`;
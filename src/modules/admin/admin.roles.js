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
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="roles-table-body"></tbody>
    </table>
  </div>

  <!-- Modal: Crear rol -->
  <div id="role-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2>Crear Nuevo Rol</h2>
      <form id="role-form">
        <div class="input-group">
          <label for="role-name">Nombre del Rol</label>
          <input type="text" id="role-name" placeholder="Ej: Coordinador" required minlength="3" maxlength="50">
        </div>
        <div class="input-group">
          <label for="role-description">Descripción</label>
          <textarea id="role-description" placeholder="Describe las responsabilidades del rol" required maxlength="255" rows="2" style="resize: vertical; font-family: inherit;"></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-role" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Rol</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Gestionar permisos -->
  <div id="permissions-modal" class="modal hidden">
    <div class="modal-content auth-card" style="max-width: 600px;">
      <h2>Gestionar Permisos: <span id="current-role-name"></span></h2>
      <p style="font-size:0.85rem; color:#555; text-align:left; margin-bottom:1rem;">
        Selecciona los permisos que deseas asignar a este rol.
        Los cambios reemplazan por completo los permisos actuales.
      </p>
      <form id="permissions-form" style="text-align:left;">
        <div id="permissions-list" class="checkbox-grid" style="max-height: 400px;"></div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-permissions" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Permisos</button>
        </div>
      </form>
    </div>
  </div>
`;
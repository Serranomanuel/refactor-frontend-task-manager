export const UsersView = () => `
  <div class="module-header">
    <h3 id="users-title">Usuarios</h3>
    <button id="btn-create-user" class="btn-primary" style="width: auto; padding: 0.5rem 1rem; display: none;">+ Nuevo Usuario</button>
  </div>
  
  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Documento</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="users-table-body"></tbody>
    </table>
  </div>

  <div id="user-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2 id="modal-title">Crear Usuario</h2>
      <form id="user-form">
        <div class="input-group">
          <label for="user-doc">Documento</label>
          <input type="text" id="user-doc" required>
        </div>
        <div class="input-group">
          <label for="user-name">Nombre Completo</label>
          <input type="text" id="user-name" required>
        </div>
        <div class="input-group">
          <label for="user-email">Correo Electrónico</label>
          <input type="email" id="user-email" required>
        </div>
        <div class="input-group">
          <label for="user-password">Contraseña</label>
          <input type="password" id="user-password" placeholder="">
        </div>
        <div class="input-group" id="roles-group">
          <label>Roles del Sistema</label>
          <div id="rbac-roles-list" style="margin-top: 0.5rem; max-height: 150px; overflow-y: auto;">
            <span style="color:#999;">Cargando roles...</span>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-modal" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
`;
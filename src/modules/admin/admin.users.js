export const UsersView = `
  <div class="module-header">
    <h3>Gestión de Usuarios</h3>
    <button id="btn-create-user" class="btn-primary" style="width: auto; padding: 0.5rem 1rem;">+ Nuevo Usuario</button>
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
      <tbody id="users-table-body">
        </tbody>
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
          <label for="user-email">Email</label>
          <input type="email" id="user-email" required>
        </div>
        <div class="input-group">
          <label for="user-role">Rol</label>
          <select id="user-role" class="form-select" required>
            <option value="Maestro">Maestro</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-modal" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
`;
export const userForm = () => {
  return `
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
        <label for="user-password">Contraseña</label>
        <input type="password" id="user-password" required>
      </div>
      <div class="input-group">
        <label>Roles del Sistema (RBAC)</label>
        <div id="rbac-roles-list" class="checkbox-grid" style="max-height: 200px; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem; background: #fafafa;">
          <span style="color:#999; font-size:0.9rem; padding:0.5rem;">Cargando roles...</span>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" id="btn-cancel-modal" class="btn-secondary">Cancelar</button>
        <button type="submit" class="btn-primary">Guardar</button>
      </div>
    </form>
  `;
};
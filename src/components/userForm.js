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
  `;
};
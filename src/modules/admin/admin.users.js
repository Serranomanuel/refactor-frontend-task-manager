// Importamos el componente que acabamos de crear
import { userForm } from '../../components/userForm.js';

export const UsersView = () => {
  return `
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
        
        ${userForm()} 
        
      </div>
    </div>
  `;
};
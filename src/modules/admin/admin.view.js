export const AdminView = `
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h3>Panel Admin</h3>
      <nav class="admin-nav">
        <button id="nav-users" class="nav-btn active">Gestión de Usuarios</button>
        <button id="nav-tasks" class="nav-btn">Gestión de Tareas</button>
        <button id="nav-roles" class="nav-btn">Roles y Permisos</button>
      </nav>
      <button id="btn-logout" class="btn-logout">Cerrar Sesión</button>
    </aside>
    <main class="admin-content">
      <header class="admin-header">
        <h2>Bienvenido, Administrador</h2>
      </header>
      <div id="admin-module-content" class="module-container">
        </div>
    </main>
  </div>
`;
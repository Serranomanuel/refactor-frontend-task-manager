export const MaestroView = `
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h3>Portal Docente</h3>
      <nav class="admin-nav">
        <button id="nav-maestro-tasks" class="nav-btn active">Mis Tareas</button>
        <button id="nav-maestro-students" class="nav-btn">Estudiantes y Calificaciones</button>
      </nav>
      <button id="btn-logout-maestro" class="btn-logout">Cerrar Sesión</button>
    </aside>
    <main class="admin-content">
      <header class="admin-header">
        <h2>Bienvenido, Maestro</h2>
      </header>
      <div id="maestro-module-content" class="module-container">
        </div>
    </main>
  </div>
`;
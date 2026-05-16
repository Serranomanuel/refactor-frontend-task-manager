export const DashboardView = `
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h3>Panel</h3>
      <nav class="admin-nav" id="dynamic-nav">
        <!-- Los botones se generan aquí automáticamente -->
      </nav>
      <button id="btn-logout" class="btn-logout">Cerrar Sesión</button>
    </aside>
    <main class="admin-content">
      <header class="admin-header">
        <h2 id="welcome-title">Bienvenido</h2>
      </header>
      <div id="dashboard-content" class="module-container"></div>
    </main>
  </div>
`;
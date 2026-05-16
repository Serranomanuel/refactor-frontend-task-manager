import { DashboardView } from './dashboard.view.js';
import { initUsersModule } from '../users/users.controller.js';   // ← cambió de admin.users.controller.js
import { initTasksModule } from '../tasks/tasks.controller.js';     // ← cambió de admin.tasks.controller.js
import { navigateTo } from '../../routes/router.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${sessionStorage.getItem('accessToken') || sessionStorage.getItem('token')}`,
});

// Solo 4 secciones, sin "roles"
const SECTIONS = [
  { id: 'usuarios',    label: 'Gestión de Usuarios',           permisos: ['Crear Usuarios', 'Editar Usuarios', 'Eliminar Usuarios'] },
  { id: 'estudiantes', label: 'Estudiantes y Calificaciones',  permisos: ['Calificar Trabajos'] },
  { id: 'tareas',      label: 'Tareas',                        permisos: ['Crear Tareas', 'Editar Tareas', 'Eliminar Tareas', 'Asignar Tareas', 'Calificar Trabajos'] },
  { id: 'mis-tareas',  label: 'Mis Tareas',                    permisos: [] }
];

// ... (imports arriba igual) ...

export const initDashboard = async (container, navigateToLogin, seccion = null) => {
  const token = sessionStorage.getItem('accessToken') || sessionStorage.getItem('token');
  if (!token) { navigateToLogin(); return; }

  container.innerHTML = DashboardView;

  const contentArea    = document.querySelector('#dashboard-content');
  const navContainer   = document.querySelector('#dynamic-nav');
  const welcomeTitle   = document.querySelector('#welcome-title');
  const btnLogout      = document.querySelector('#btn-logout');

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  welcomeTitle.textContent = `Bienvenido, ${user.name || 'Usuario'}`;

  // ═══ OBTENER PERMISOS DESDE EL USUARIO GUARDADO EN LOGIN ═══
  let userPermissions = [];
  
  // Intentar extraer permisos del objeto user del login
  if (user.permissions && Array.isArray(user.permissions)) {
    // Si el backend devuelve permissions directamente en el login
    userPermissions = user.permissions.map(p => typeof p === 'string' ? p : p.name);
  } else if (user.roles && Array.isArray(user.roles)) {
    // Si devuelve roles con permissions anidados
    user.roles.forEach(role => {
      const perms = role.permissions || role.Permissions || [];
      perms.forEach(p => {
        const name = typeof p === 'string' ? p : (p.name || '');
        if (name) userPermissions.push(name);
      });
    });
  }

  // Si no hay permisos, usar roles como fallback para decidir
  const userRoles = user.roles?.map(r => typeof r === 'string' ? r.toLowerCase() : r.name?.toLowerCase()) || [];
  
  // Fallback por roles si no hay permisos explícitos
  if (userPermissions.length === 0) {
    if (userRoles.includes('administrador') || userRoles.includes('admin')) {
      userPermissions = ['Crear Usuarios', 'Editar Usuarios', 'Eliminar Usuarios', 'Crear Tareas', 'Editar Tareas', 'Eliminar Tareas', 'Asignar Tareas', 'Calificar Trabajos'];
    } else if (userRoles.includes('maestro') || userRoles.includes('evaluador')) {
      userPermissions = ['Crear Tareas', 'Asignar Tareas', 'Calificar Trabajos'];
    } else {
      userPermissions = []; // Estudiante: solo ve "Mis Tareas"
    }
  }

  console.log('[Dashboard] Permisos detectados:', userPermissions);
  console.log('[Dashboard] Roles detectados:', userRoles);


  const availableSections = SECTIONS.filter(sec =>
    sec.permisos.length === 0 || sec.permisos.some(p => userPermissions.includes(p))
  );

  if (availableSections.length === 0) {
    contentArea.innerHTML = '<p style="padding:2rem; text-align:center;">No tienes permisos asignados.</p>';
    return;
  }

  navContainer.innerHTML = '';
  availableSections.forEach((sec, index) => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn' + (index === 0 ? ' active' : '');
    btn.textContent = sec.label;
    btn.dataset.section = sec.id;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadSection(sec.id, userPermissions);
    });
    navContainer.appendChild(btn);
  });

  btnLogout.addEventListener('click', () => navigateToLogin());

  const initialSection = seccion && availableSections.find(s => s.id === seccion)
    ? seccion
    : availableSections[0]?.id;

  if (initialSection) {
    const activeBtn = navContainer.querySelector(`[data-section="${initialSection}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    loadSection(initialSection, userPermissions);
  }

  // Simplificado: solo 2 módulos, el permiso decide qué ven
  function loadSection(sectionId, perms) {
    contentArea.innerHTML = '';
    try {
      if (sectionId === 'usuarios' || sectionId === 'estudiantes') {
        initUsersModule(contentArea, perms);
      } else {
        initTasksModule(contentArea, perms);
      }
    } catch (err) {
      console.error(err);
      contentArea.innerHTML = '<p>Error al cargar módulo.</p>';
    }
  }
};
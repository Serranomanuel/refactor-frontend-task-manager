import { createRepository } from './baseRepository.js';

// Conecta con /api/tasks del backend
export const TaskRepository = createRepository('tasks');
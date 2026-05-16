import { createRepository } from './baseRepository.js';

// El texto 'users' (o 'usuarios', dependiendo de cómo se llame en tu backend/json-server) 
// se unirá a la URL base que pusimos en BaseRepository.js
export const UserRepository = createRepository('users');
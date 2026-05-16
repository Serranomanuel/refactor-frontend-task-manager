export const createRepository = (resource) => {
  // Ajusta la URL base si tu backend real ahora usa /api (ej. http://localhost:3000/api)
  const baseUrl = 'http://localhost:3000/api'; 
  const endpoint = `${baseUrl}/${resource}`;

  // Función auxiliar para obtener los headers con el token
  const getHeaders = () => {
    const token = sessionStorage.getItem('accessToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Agregamos el token si existe
    }
    return headers;
  };

  return {
    getAll: async () => {
      const response = await fetch(endpoint, { headers: getHeaders() });
      if (!response.ok) throw new Error(`Error en GET: ${response.status}`);
      const json = await response.json();
      return json.data;
    },
    getById: async (id) => {
    const response = await fetch(`${endpoint}/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`Error en GET by ID: ${response.status}`);
    const json = await response.json();
    return Array.isArray(json.data) ? json.data[0] : json.data;
    },
    create: async (data) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Error en POST: ${response.status}`);
      const json = await response.json();
      return json.data;
    },
    update: async (id, data) => {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Error en PUT: ${response.status}`);
      const json = await response.json();
      return json.data;
    },
    delete: async (id) => {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error(`Error en DELETE: ${response.status}`);
      const json = await response.json();
      return json.data;
    }
  };
};
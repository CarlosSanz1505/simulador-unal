const API_URL = 'http://localhost:4000/api/simulaciones';

export async function getSimulaciones(userId) {
  try {
    console.log('Realizando petición GET a:', API_URL, 'con userId:', userId);
    const res = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId, 
      },
    });
    
    console.log('Respuesta del servidor:', res.status, res.statusText);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error en getSimulaciones:', error);
    throw error;
  }
}

export async function getSimulacion(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error en getSimulacion:', error);
    throw error;
  }
}

export async function createSimulacion(data) {
  try {
    console.log('Creando simulación:', data);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const result = await res.json();
    console.log('Simulación creada:', result);
    return result;
  } catch (error) {
    console.error('Error en createSimulacion:', error);
    throw error;
  }
}

export async function updateSimulacion(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error en updateSimulacion:', error);
    throw error;
  }
}

export async function deleteSimulacion(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  } catch (error) {
    console.error('Error en deleteSimulacion:', error);
    throw error;
  }
}
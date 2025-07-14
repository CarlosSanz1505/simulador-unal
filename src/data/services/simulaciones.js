const API_URL = 'http://localhost:4000/api/simulaciones';

export async function getSimulaciones() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getSimulacion(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createSimulacion(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSimulacion(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSimulacion(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
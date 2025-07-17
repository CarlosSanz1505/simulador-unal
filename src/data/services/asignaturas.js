const API_URL = 'http://localhost:4000/api/asignaturas';

export async function getAsignaturas() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getAsignatura(codigo) {
  const res = await fetch(`${API_URL}/${codigo}`);
  return res.json();
}

export async function getAsignaturasPorTipologia(tipologia) {
  const res = await fetch(`${API_URL}/tipologia/${tipologia}`);
  return res.json();
}

export async function buscarAsignaturas(termino) {
  const res = await fetch(`${API_URL}/search/${termino}`);
  return res.json();
}

export async function getTipologias() {
  const res = await fetch('http://localhost:4000/api/tipologias');
  return res.json();
}

export async function getConfiguracion() {
  const res = await fetch('http://localhost:4000/api/configuracion');
  return res.json();
}
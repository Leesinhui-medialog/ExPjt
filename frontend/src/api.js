const BASE = '/api';

export async function fetchBoardList(page = 0, size = 10) {
  const res = await fetch(`${BASE}/board/list?page=${page}&size=${size}`);
  return res.json();
}

export async function fetchBoard(idx) {
  const res = await fetch(`${BASE}/board/${idx}`);
  return res.json();
}

export async function createBoard(formData) {
  const res = await fetch(`${BASE}/board`, { method: 'POST', body: formData });
  return res.json();
}

export async function updateBoard(idx, formData) {
  const res = await fetch(`${BASE}/board/${idx}`, { method: 'PUT', body: formData });
  return res.json();
}

export async function deleteBoard(idx) {
  const res = await fetch(`${BASE}/board/${idx}`, { method: 'DELETE' });
  return res.json();
}

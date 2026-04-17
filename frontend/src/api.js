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

// 골프장 전체 목록 조회
export async function fetchGolfCourses() {
  const res = await fetch(`${BASE}/golf-courses`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 골프장 키워드 검색
export async function searchGolfCourses(keyword) {
  const res = await fetch(`${BASE}/golf-courses/search?keyword=${encodeURIComponent(keyword)}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 역지오코딩 (위도·경도 → 주소 변환)
export async function reverseGeocode(lat, lng) {
  const res = await fetch(`${BASE}/location/reverse-geocode?lat=${lat}&lng=${lng}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7500/api';

// export async function apiFetch(path, options = {}) {
//   const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
//   const opts = {
//     // Don't override existing options users pass
//     method: options.method || 'GET',
//     headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
//     credentials: 'include', // IMPORTANT for httpOnly cookies
//     body: options.body,
//   };
//   const res = await fetch(url, opts);
//   return res;
// }

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7500';
const BASE = RAW_BASE.replace(/\/+$/, ''); // strip trailing slash once
const API_PREFIX = '/api';

function buildUrl(path) {
  if (path.startsWith('http')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  // If caller accidentally passes "/api/..." prevent double "/api/api"
  const normalizedPath = p.startsWith('/api/') ? p.slice(4) : p;
  return `${BASE}${API_PREFIX}${normalizedPath}`;
}

export async function apiFetch(path, options = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',  // IMPORTANT for cookie auth
    body: options.body,
  });
  return res;
}


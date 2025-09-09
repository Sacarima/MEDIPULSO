import { apiFetch } from './apiClient';

export async function fetchSession() {
  const res = await apiFetch('/auth/session');  
  if (!res.ok) {
    const data = await safeJson(res);
    const err = new Error(data?.message || 'Unauthorized');
    err.status = res.status;
    err.code = data?.code;
    throw err;
  }
  return res.json();
}

export async function postLogout() {
  const res = await apiFetch('/auth/logout');   
  try { return await res.json(); } catch { return { success: res.ok }; }
}

async function safeJson(res) { try { return await res.json(); } catch { return null; } }

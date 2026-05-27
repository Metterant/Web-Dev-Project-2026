import { apiFetch } from './apiClient';

export async function getCurrentUser() {
  try {
    const res = await apiFetch('/api/auth/me');
    if (!res.ok) return null;
    const payload = await res.json();
    return payload.user || null;
  } catch (e) {
    return null;
  }
}

export async function logout() {
  try {
    const res = await apiFetch('/api/auth/logout', { method: 'POST' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

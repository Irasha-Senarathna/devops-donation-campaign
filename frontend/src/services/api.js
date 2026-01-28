// api.js - helper for API calls with auth
export function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

// Auth endpoints
export const AuthAPI = {
  me: () => apiFetch('/api/auth/me'),
  login: (payload) => apiFetch('/api/auth/login', { method: 'POST', body: payload }),
  register: (payload) => apiFetch('/api/auth/register', { method: 'POST', body: payload }),
};

// Campaign endpoints
export const CampaignAPI = {
  list: () => apiFetch('/api/campaigns'),
  create: (payload) => apiFetch('/api/campaigns', { method: 'POST', body: payload }),
  update: (id, payload) => apiFetch(`/api/campaigns/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiFetch(`/api/campaigns/${id}`, { method: 'DELETE' }),
  donate: (id, amount) => apiFetch(`/api/campaigns/${id}/donate`, { method: 'POST', body: { amount } }),
};

// Helper to get logged-in user ID from token
export function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id;
  } catch {
    return null;
  }
}

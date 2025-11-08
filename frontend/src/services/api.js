// Simple API helper with auth token support
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

// Items endpoints
export const ItemsAPI = {
	list: () => apiFetch('/api/items'),
	create: (payload) => apiFetch('/api/items', { method: 'POST', body: payload }),
	update: (id, payload) => apiFetch(`/api/items/${id}`, { method: 'PUT', body: payload }),
	remove: (id) => apiFetch(`/api/items/${id}`, { method: 'DELETE' }),
};

// Auth helpers (optional usage)
export const AuthAPI = {
	me: () => apiFetch('/api/auth/me'),
	login: (payload) => apiFetch('/api/auth/login', { method: 'POST', body: payload }),
	register: (payload) => apiFetch('/api/auth/register', { method: 'POST', body: payload }),
};


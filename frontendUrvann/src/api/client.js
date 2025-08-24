const BASE_URL = import.meta.env.VITE_API_URL

export async function api(path, { method = "GET", token, body } = {}) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
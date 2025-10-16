// Lấy base từ env, bỏ dấu "/" ở cuối nếu có
export const API_BASE = (
import.meta.env.VITE_API_BASE_URL ||
import.meta.env.VITE_API_URL ||
"http://localhost:5000"
).replace(/\/$/, "");

export async function api(path, { method = "GET", body, withCred = true, headers = {} } = {}) {
const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
const res = await fetch(url, {
    method,
    credentials: withCred ? "include" : "same-origin",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
});
const data = await res.json().catch(() => ({}));
if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
return data;
}
    
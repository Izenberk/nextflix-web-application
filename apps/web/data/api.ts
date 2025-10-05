const ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
// default to '/api/v1' if you use Nest global prefix + versioning; set to '' if you don't
const BASE_PATH_RAW = process.env.NEXT_PUBLIC_API_BASE_PATH ?? '/api/v1';
const BASE_PATH = BASE_PATH_RAW
  ? `/${BASE_PATH_RAW.replace(/^\/+/, '').replace(/\/+$/, '')}`
  : '';
const BASE = `${ORIGIN}${BASE_PATH}`;

function joinUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(joinUrl(path), { ...init, cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

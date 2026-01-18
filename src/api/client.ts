export const API_BASE_URL = "http://localhost:3000";

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Greška prilikom poziva API-ja");
  }

  return res.json();
}

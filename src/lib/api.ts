const BASE_URL = "https://inventory-backend-d.vercel.app/api/v1";

interface FetchOptions extends RequestInit {
  data?: any;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  if (options.data && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.data);
  }

  // Get token from local storage if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMessage = "API error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Not JSON
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (e) {
    return {} as T;
  }
}

export const API_ORIGIN = (
  import.meta.env.VITE_API_ORIGIN || "https://api.dungewar.com"
).replace(/\/$/, "");

export const apiUrl = (path: string): string =>
  `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

export const websocketUrl = (path: string): string => {
  const url = new URL(apiUrl(path));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

export async function postJson<TBody>(path: string, body: TBody): Promise<Response> {
  return fetch(apiUrl(path), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

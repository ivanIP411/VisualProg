const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}
export function setAccessToken(t: string) {
  localStorage.setItem(ACCESS_KEY, t);
}
export function clearAccessToken() {
  localStorage.removeItem(ACCESS_KEY);
}
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}
export function setRefreshToken(t: string) {
  localStorage.setItem(REFRESH_KEY, t);
}
export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_KEY);
}
export function clearTokens() {
  clearAccessToken();
  clearRefreshToken();
}
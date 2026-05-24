import { setAccessToken, clearTokens, getAccessToken, setRefreshToken, getRefreshToken } from './token';

type User = { id: string; name: string; email: string; pass: string };

const keyUser = 'app_users';

function loadUsers(): User[] {
  const raw = localStorage.getItem(keyUser);
  return raw ? JSON.parse(raw) : [];
}
function saveUsers(users: User[]) {
  localStorage.setItem(keyUser, JSON.stringify(users));
}
export function getCurrentUserSync(): { id: string } | null {
  const t = getAccessToken();
  if (!t) return null;
  try {
    const d = JSON.parse(atob(t));
    if (d.exp < Date.now()) return null;
    return { id: d.userId };
  } catch { return null; }
}
export async function getUser() {
  const t = getAccessToken();
  if (!t) return null;
  try {
    const d = JSON.parse(atob(t));
    if (d.exp < Date.now()) return null;
    const users = loadUsers();
    const user = users.find(u => u.id === d.userId);
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  } catch { return null; }
}
export async function register(name: string, email: string, pass: string) {
  await new Promise(r => setTimeout(r, 500));
  const users = loadUsers();
  if (users.find(u => u.email === email)) throw new Error('Email уже существует');
  const id = Date.now().toString();
  const newUser = { id, name, email, pass };
  users.push(newUser);
  saveUsers(users);
  const acc = btoa(JSON.stringify({ userId: id, exp: Date.now() + 15 * 60000 }));
  const ref = btoa(JSON.stringify({ userId: id, exp: Date.now() + 7 * 86400000 }));
  setAccessToken(acc);
  setRefreshToken(ref);
  return { id, name, email };
}
export async function login(email: string, pass: string) {
  await new Promise(r => setTimeout(r, 500));
  const users = loadUsers();
  const u = users.find(u => u.email === email && u.pass === pass);
  if (!u) throw new Error('Неверный email или пароль');
  const acc = btoa(JSON.stringify({ userId: u.id, exp: Date.now() + 15 * 60000 }));
  const ref = btoa(JSON.stringify({ userId: u.id, exp: Date.now() + 7 * 86400000 }));
  setAccessToken(acc);
  setRefreshToken(ref);
  return { id: u.id, name: u.name, email };
}
export async function logout() {
  clearTokens();
}
export async function refresh() {
  const ref = getRefreshToken();
  if (!ref) throw new Error('no refresh');
  const d = JSON.parse(atob(ref));
  if (d.exp < Date.now()) throw new Error('refresh expired');
  const newAcc = btoa(JSON.stringify({ userId: d.userId, exp: Date.now() + 15 * 60000 }));
  setAccessToken(newAcc);
}
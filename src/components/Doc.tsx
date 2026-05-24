import type { Document } from "../types";
import { getCurrentUserSync } from "../auth/auth";

const KEY = 'spreadsheets';

function loadAll(): Document[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveAll(docs: Document[]) {
  localStorage.setItem(KEY, JSON.stringify(docs));
}
export function getDocs(): Document[] {
  const user = getCurrentUserSync();
  if (!user) return [];
  const all = loadAll();
  return all.filter(d => d.userId === user.id);
}
export function getDoc(id: string): Document | undefined {
  const user = getCurrentUserSync();
  if (!user) return undefined;
  const all = loadAll();
  const doc = all.find(d => d.id === id);
  if (!doc || doc.userId !== user.id) return undefined;
  return doc;
}
export function addDoc(doc: Document): void {
  const user = getCurrentUserSync();
  if (!user) return;
  const all = loadAll();
  const newDoc = { ...doc, userId: user.id };
  all.push(newDoc);
  saveAll(all);
}
export function updateDoc(doc: Document): void {
  const user = getCurrentUserSync();
  if (!user) return;
  const all = loadAll();
  const idx = all.findIndex(d => d.id === doc.id);
  if (idx !== -1 && all[idx].userId === user.id) {
    all[idx] = { ...doc, userId: user.id };
    saveAll(all);
  }
}
export function deleteDoc(id: string): void {
  const user = getCurrentUserSync();
  if (!user) return;
  const all = loadAll();
  const filtered = all.filter(d => d.id !== id || d.userId !== user.id);
  if (filtered.length !== all.length) saveAll(filtered);
}
export function duplicateDoc(id: string): Document | undefined {
  const user = getCurrentUserSync();
  if (!user) return undefined;
  const all = loadAll();
  const orig = all.find(d => d.id === id && d.userId === user.id);
  if (!orig) return undefined;
  const copy: Document = {
    ...orig,
    id: Date.now().toString(),
    name: orig.name + ' (копия)',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: user.id,
  };
  all.push(copy);
  saveAll(all);
  return copy;
}
import type { Document } from "../types";

const KEY = 'spreadsheets';
function load(): Document[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
function save(docs: Document[]) {
  localStorage.setItem(KEY, JSON.stringify(docs));
}
export function getDocs(): Document[] {
  return load();
}
export function getDoc(id: string): Document | undefined {
  return load().find(d => d.id === id);
}
export function addDoc(doc: Document): void {
  const docs = load();
  docs.push(doc);
  save(docs);
}
export function updateDoc(doc: Document): void {
  const docs = load();
  const idx = docs.findIndex(d => d.id === doc.id);
  if (idx !== -1) docs[idx] = doc;
  else docs.push(doc);
  save(docs);
}
export function deleteDoc(id: string): void {
  const docs = load().filter(d => d.id !== id);
  save(docs);
}
export function duplicateDoc(id: string): Document {
  const orig = getDoc(id)!;
  const copy: Document = {
    ...orig,
    id: Date.now().toString(),
    name: orig.name + ' (копия)',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  addDoc(copy);
  return copy;
}
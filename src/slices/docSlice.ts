import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, getDoc, updateDoc, addDoc, deleteDoc, duplicateDoc } from '../components/Doc';
import type { Document } from '../types';
import type { RootState } from '../app/store';

type DocsState = {
  list: Document[];
  curId: string | null;
};
const init: DocsState = { list: [], curId: null };
export const fetchDocs = createAsyncThunk('docs/fetch', async () => getDocs());
export const fetchDoc = createAsyncThunk('docs/fetchOne', async (id: string) => getDoc(id)!);
export const saveDoc = createAsyncThunk('docs/save', async (_, { getState }) => {
  const state = getState() as RootState;
  const { curId } = state.docs;
  const { cells, rows, cols, colW, rowH } = state.sheet;
  if (!curId) return;
  const old = getDoc(curId);
  if (old) {
    const upd = { ...old, cells, rows, cols, colW, rowH, updatedAt: Date.now() };
    updateDoc(upd);
    return upd;
  }
});
export const createDoc = createAsyncThunk('docs/create', async (data: { name: string; rows: number; cols: number }) => {
  const id = Date.now().toString();
  const newDoc: Document = {
    id, name: data.name || 'Без имени',
    createdAt: Date.now(), updatedAt: Date.now(),
    rows: data.rows, cols: data.cols,
    cells: {}, colW: Array(data.cols).fill(100), rowH: Array(data.rows).fill(25),
  };
  addDoc(newDoc);
  return newDoc;
});
export const renameDoc = createAsyncThunk('docs/rename', async ({ id, name }: { id: string; name: string }) => {
  const doc = getDoc(id);
  if (doc) {
    const upd = { ...doc, name, updatedAt: Date.now() };
    updateDoc(upd);
    return upd;
  }
  throw new Error('no doc');
});
export const removeDoc = createAsyncThunk('docs/remove', async (id: string) => {
  deleteDoc(id);
  return id;
});
export const copyDoc = createAsyncThunk('docs/copy', async (id: string) => duplicateDoc(id));
const docSlice = createSlice({
  name: 'docs',
  initialState: init,
  reducers: {
    setCurId(state, action) { state.curId = action.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchDocs.fulfilled, (s, a) => { s.list = a.payload; });
    b.addCase(createDoc.fulfilled, (s, a) => { s.list.push(a.payload); });
    b.addCase(renameDoc.fulfilled, (s, a) => {
      const idx = s.list.findIndex(d => d.id === a.payload.id);
      if (idx !== -1) s.list[idx] = a.payload;
      if (s.curId === a.payload.id) s.curId = a.payload.id;
    });
    b.addCase(removeDoc.fulfilled, (s, a) => {
      s.list = s.list.filter(d => d.id !== a.payload);
      if (s.curId === a.payload) s.curId = null;
    });
    b.addCase(copyDoc.fulfilled, (s, a) => { s.list.push(a.payload); });
  },
});

export const { setCurId } = docSlice.actions;
export default docSlice.reducer;
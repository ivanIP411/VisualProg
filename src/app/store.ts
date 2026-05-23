import { configureStore } from '@reduxjs/toolkit';
import sheet from '../slices/sheetSlice';
import docs from '../slices/docSlice';
import ui from '../slices/uiSlice';
import auth from '../slices/authSlice';
import { autoSave } from '../middleware/autosave';

export const store = configureStore({
  reducer: { sheet, docs, ui, auth },
  middleware: (getDefault) => getDefault().concat(autoSave),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
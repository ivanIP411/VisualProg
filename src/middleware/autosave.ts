import { type Middleware, isAction } from '@reduxjs/toolkit';
import { saveDoc } from '../slices/docSlice';
import { setSaveStatus } from '../slices/uiSlice';

let timer: ReturnType<typeof setTimeout> | null = null;
export const autoSave: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (isAction(action)) {
    const type = action.type;
    const types = ['sheet/updCell', 'sheet/addRow', 'sheet/delRow','sheet/addCol', 'sheet/delCol', 'sheet/setColW', 'sheet/setRowH'];
    if (types.includes(type)) {
      if (timer) clearTimeout(timer);
      store.dispatch(setSaveStatus('saving'));
      timer = setTimeout(() => {
        store.dispatch(saveDoc() as any);
        store.dispatch(setSaveStatus('saved'));
        timer = null;
      }, 500);
    }
  }
  return result;
};
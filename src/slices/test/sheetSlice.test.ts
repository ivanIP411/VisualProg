import { describe, it, expect } from 'vitest';
import sheetReducer, {updCell, addRow, addCol, delRow, delCol, setColW, setRowH, undo, redo} from '../sheetSlice';

describe('sheetSlice', () => {
  it('Обновляет ячейку и сохраняет историю', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    state = sheetReducer(state, updCell({ row: 0, col: 0, raw: '42' }));
    expect(state.cells['0,0']?.display).toBe('42');
    expect(state.past.length).toBe(1);
  });

  it('Добавляет строку', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    const oldRows = state.rows;
    state = sheetReducer(state, addRow(5));
    expect(state.rows).toBe(oldRows + 1);
    expect(state.rowH.length).toBe(state.rows);
  });

  it('Удаялет строку', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    const oldRows = state.rows;
    state = sheetReducer(state, delRow(10));
    expect(state.rows).toBe(oldRows - 1);
  });

  it('Добавляет столбец', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    const oldCols = state.cols;
    state = sheetReducer(state, addCol(5));
    expect(state.cols).toBe(oldCols + 1);
    expect(state.colW.length).toBe(state.cols);
  });

  it('Удаляет столбец', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    const oldCols = state.cols;
    state = sheetReducer(state, delCol(10));
    expect(state.cols).toBe(oldCols - 1);
  });

  it('Изменяет ширину столбца и сохраняет историю', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    state = sheetReducer(state, setColW({ idx: 0, w: 150 }));
    expect(state.colW[0]).toBe(150);
    expect(state.past.length).toBe(1);
  });

  it('Изменяют высоту строки и сохраняет историю', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    state = sheetReducer(state, setRowH({ idx: 0, h: 40 }));
    expect(state.rowH[0]).toBe(40);
    expect(state.past.length).toBe(1);
  });

  it('Отменяет и повторяет действие', () => {
    let state = sheetReducer(undefined, { type: 'init' });
    state = sheetReducer(state, updCell({ row: 0, col: 0, raw: '100' }));
    expect(state.cells['0,0']?.display).toBe('100');
    state = sheetReducer(state, undo());
    expect(state.cells['0,0']).toBeUndefined();
    state = sheetReducer(state, redo());
    expect(state.cells['0,0']?.display).toBe('100');
  });
});
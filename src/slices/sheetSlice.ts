import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CellData, type Coord, formula as evaluateFormula } from '../types';

type SheetState = {
  cells: Record<string, CellData>;
  rows: number;
  cols: number;
  colW: number[];
  rowH: number[];
  sel: Coord | null;
  range: { start: Coord; end: Coord } | null;
  past: Omit<SheetState, 'past' | 'future'>[];
  future: Omit<SheetState, 'past' | 'future'>[];
};
function emptyCell(): CellData {
  return { value: '', formula: '', display: '' };
}
const init: SheetState = {
  cells: {},
  rows: 100,
  cols: 26,
  colW: Array(26).fill(100),
  rowH: Array(100).fill(25),
  sel: null,
  range: null,
  past: [],
  future: [],
};
function takeSnapshot(state: SheetState): Omit<SheetState, 'past' | 'future'> {
  return {
    cells: { ...state.cells },
    rows: state.rows,
    cols: state.cols,
    colW: [...state.colW],
    rowH: [...state.rowH],
    sel: state.sel ? { ...state.sel } : null,
    range: state.range ? { start: { ...state.range.start }, end: { ...state.range.end } } : null,
  };
}
const sheetSlice = createSlice({
  name: 'sheet',
  initialState: init,
  reducers: {
    load(state, action: PayloadAction<Omit<SheetState, 'past' | 'future'>>) {
      const { cells, rows, cols, colW, rowH, sel, range } = action.payload;
      state.cells = cells;
      state.rows = rows;
      state.cols = cols;
      state.colW = colW;
      state.rowH = rowH;
      state.sel = sel;
      state.range = range;
      state.past = [];
      state.future = [];
    },
    updCell(state, action: PayloadAction<{ row: number; col: number; raw: string }>) {
      state.past.push(takeSnapshot(state));
      state.future = [];
      const { row, col, raw } = action.payload;
      const key = `${row},${col}`;
      let formulaStr = '',
        val: string | number = raw,
        disp = raw;
      if (raw.startsWith('=')) {
        formulaStr = raw;
        const getNumber = (coord: Coord) => {
          const k = `${coord.row},${coord.col}`;
          const cell = state.cells[k];
          if (!cell) return 0;
          if (typeof cell.value === 'number') return cell.value;
          const num = parseFloat(cell.value as string);
          return isNaN(num) ? 0 : num;
        };
        const result = evaluateFormula(raw, getNumber);
        val = isNaN(result) ? 'ОШИБКА' : result;
        disp = val.toString();
      }
      state.cells[key] = { value: val, formula: formulaStr, display: disp };
    },
    recalc(state) {
      const newCells = { ...state.cells };
      let changed = false;
      for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
          const key = `${r},${c}`;
          if (!newCells[key]) {
            newCells[key] = emptyCell();
          }
          const cell = newCells[key];
          if (cell.formula && cell.formula.startsWith('=')) {
            const getNumber = (coord: Coord) => {
              const k = `${coord.row},${coord.col}`;
              const v = newCells[k]?.value;
              if (typeof v === 'number') return v;
              const num = parseFloat(v as string);
              return isNaN(num) ? 0 : num;
            };
            const result = evaluateFormula(cell.formula, getNumber);
            const display = isNaN(result) ? 'ОШИБКА' : result.toString();
            if (cell.value !== result || cell.display !== display) {
              newCells[key] = { ...cell, value: result, display };
              changed = true;
            }
          }
        }
      }
      if (changed) state.cells = newCells;
    },
    setSel(state, action: PayloadAction<Coord | null>) {
      state.sel = action.payload;
    },
    setRange(state, action: PayloadAction<{ start: Coord; end: Coord } | null>) {
      state.range = action.payload;
    },
    setRows(state, action: PayloadAction<number>) {
      state.rows = action.payload;
    },
    setCols(state, action: PayloadAction<number>) {
      state.cols = action.payload;
    },
    setColW(state, action: PayloadAction<{ idx: number; w: number }>) {
      state.past.push(takeSnapshot(state));
      state.future = [];
      state.colW[action.payload.idx] = action.payload.w;
    },
    setRowH(state, action: PayloadAction<{ idx: number; h: number }>) {
      state.past.push(takeSnapshot(state));
      state.future = [];
      state.rowH[action.payload.idx] = action.payload.h;
    },
    addRow(state, action: PayloadAction<number>) {
      state.past.push(takeSnapshot(state));
      state.future = [];
      const after = action.payload;
      state.rows++;
      const newRowH = [...state.rowH];
      newRowH.splice(after + 1, 0, 25);
      state.rowH = newRowH;
    },
    delRow(state, action: PayloadAction<number>) {
      if (state.rows <= 1) return;
      state.past.push(takeSnapshot(state));
      state.future = [];
      state.rows--;
      state.rowH = state.rowH.filter((_, i) => i !== action.payload);
    },
    addCol(state, action: PayloadAction<number>) {
      state.past.push(takeSnapshot(state));
      state.future = [];
      const after = action.payload;
      state.cols++;
      const newColW = [...state.colW];
      newColW.splice(after + 1, 0, 100);
      state.colW = newColW;
    },
    delCol(state, action: PayloadAction<number>) {
      if (state.cols <= 1) return;
      state.past.push(takeSnapshot(state));
      state.future = [];
      state.cols--;
      state.colW = state.colW.filter((_, i) => i !== action.payload);
    },
    undo(state) {
      if (!state.past.length) return;
      const prev = state.past.pop()!;
      const current = takeSnapshot(state);
      state.future.unshift(current);
      state.cells = prev.cells;
      state.rows = prev.rows;
      state.cols = prev.cols;
      state.colW = prev.colW;
      state.rowH = prev.rowH;
    },
    redo(state) {
      if (!state.future.length) return;
      const next = state.future.shift()!;
      const current = takeSnapshot(state);
      state.past.push(current);
      state.cells = next.cells;
      state.rows = next.rows;
      state.cols = next.cols;
      state.colW = next.colW;
      state.rowH = next.rowH;
    },
  },
});

export const {
  load,
  updCell,
  recalc,
  setSel,
  setRange,
  setRows,
  setCols,
  setColW,
  setRowH,
  addRow,
  delRow,
  addCol,
  delCol,
  undo,
  redo,
} = sheetSlice.actions;
export default sheetSlice.reducer;

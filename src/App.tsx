import React, { useState, useCallback, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import Cell from './components/Cell';
import Formul from './components/Formul';
import Menu from './components/Menu';
import type { CellData, Coord } from './types';
import { formula } from './types';
import './App.css';

const ROWS = 100;
const COLS = 26;

function empty(): CellData {
  return { value: '', formula: '', display: '' };
}
function crEmpty(rows: number, cols: number): Record<string, CellData> {
  const cells: Record<string, CellData> = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells[`${r},${c}`] = empty();
    }
  }
  return cells;
}
type EditingState = { row: number; col: number; text: string } | null;
function App() {
  const [rowCount, setRowCount] = useState(ROWS);
  const [colCount, setColCount] = useState(COLS);
  const [cells, setCells] = useState<Record<string, CellData>>(() =>
    crEmpty(ROWS, COLS)
  );
  const [selected, setSelected] = useState<Coord | null>(null);
  const [range, setRange] = useState<{ start: Coord; end: Coord } | null>(null);
  const [editing, setEditing] = useState<EditingState>(null);
  const [colWidths, setColWidths] = useState<number[]>(Array(COLS).fill(100));
  const [rowHeights, setRowHeights] = useState<number[]>(Array(ROWS).fill(25));
  const [menu, setMenu] = useState<{ row: number; col: number; x: number; y: number } | null>(null);
  
  const getNumber = useCallback((coord: Coord): number => {
    const key = `${coord.row},${coord.col}`;
    const cell = cells[key];
    if (!cell) return 0;
    if (typeof cell.value === 'number') return cell.value;
    const num = parseFloat(cell.value as string);
    return isNaN(num) ? 0 : num;
  }, [cells]);
  
  const recalcAll = useCallback(() => {
    setCells(prevCells => {
      const newCells = { ...prevCells };
      let changed = false;
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
          const key = `${r},${c}`;
          const cell = newCells[key];
          if (cell.formula && cell.formula.startsWith('=')) {
            const getValue = (coord: Coord) => {
              const k = `${coord.row},${coord.col}`;
              const v = newCells[k]?.value;
              if (typeof v === 'number') return v;
              const num = parseFloat(v as string);
              return isNaN(num) ? 0 : num;
            };
            const result = formula(cell.formula, getValue);
            const display = isNaN(result) ? 'ОШИБКА' : result.toString();
            if (cell.value !== result || cell.display !== display) {
              newCells[key] = { ...cell, value: result, display };
              changed = true;
            }
          }
        }
      }
      return changed ? newCells : prevCells;
    });
  }, [rowCount, colCount]);

  const updateCell = (row: number, col: number, rawText: string) => {
    const key = `${row},${col}`;
    let formula = '';
    let value: string | number = rawText;
    let display = rawText;
    if (rawText.startsWith('=')) {
      formula = rawText;
    }
    setCells(prev => ({ ...prev, [key]: { value, formula, display } }));
  };
  useEffect(() => {
    recalcAll();
  }, [cells, recalcAll]);
  const onCellClick = (row: number, col: number, e: React.MouseEvent) => {
    if (e.shiftKey && selected) {
      setRange({ start: selected, end: { row, col } });
    } else {
      setSelected({ row, col });
      setRange(null);
    }
  };
  const isSelected = (r: number, c: number) => selected?.row === r && selected?.col === c;
  const isInRange = (r: number, c: number) => {
    if (!range) return false;
    const r1 = Math.min(range.start.row, range.end.row);
    const r2 = Math.max(range.start.row, range.end.row);
    const c1 = Math.min(range.start.col, range.end.col);
    const c2 = Math.max(range.start.col, range.end.col);
    return r >= r1 && r <= r2 && c >= c1 && c <= c2;
  };
  const startEdit = (row: number, col: number) => {
    const key = `${row},${col}`;
    const text = cells[key].formula || cells[key].display;
    setEditing({ row, col, text });
  };
  const finishEdit = () => {
    if (editing) {
      updateCell(editing.row, editing.col, editing.text);
      setEditing(null);
    }
  };
  const addRow = (afterRow: number) => {
    setCells(prev => {
      const next: Record<string, CellData> = {};
      for (let r = 0; r < rowCount + 1; r++) {
        for (let c = 0; c < colCount; c++) {
          if (r <= afterRow) next[`${r},${c}`] = prev[`${r},${c}`] || empty();
          else if (r === afterRow + 1) next[`${r},${c}`] = empty();
          else next[`${r},${c}`] = prev[`${r - 1},${c}`] || empty();
        }
      }
      return next;
    });
    setRowHeights(prev => {
      const newHeights = [...prev];
      newHeights.splice(afterRow + 1, 0, 25);
      return newHeights;
    });
    setRowCount(prev => prev + 1);
  };
  const deleteRow = (row: number) => {
    if (rowCount <= 1) return;
    setCells(prev => {
      const next: Record<string, CellData> = {};
      for (let r = 0; r < rowCount - 1; r++) {
        for (let c = 0; c < colCount; c++) {
          const src = r < row ? r : r + 1;
          next[`${r},${c}`] = prev[`${src},${c}`] || empty();
        }
      }
      return next;
    });
    setRowHeights(prev => prev.filter((_, i) => i !== row));
    setRowCount(prev => prev - 1);
  };
  const addCol = (afterCol: number) => {
    setCells(prev => {
      const next: Record<string, CellData> = {};
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount + 1; c++) {
          if (c <= afterCol) next[`${r},${c}`] = prev[`${r},${c}`] || empty();
          else if (c === afterCol + 1) next[`${r},${c}`] = empty();
          else next[`${r},${c}`] = prev[`${r},${c - 1}`] || empty();
        }
      }
      return next;
    });
    setColWidths(prev => {
      const newWidths = [...prev];
      newWidths.splice(afterCol + 1, 0, 100);
      return newWidths;
    });
    setColCount(prev => prev + 1);
  };
  const deleteCol = (col: number) => {
    if (colCount <= 1) return;
    setCells(prev => {
      const next: Record<string, CellData> = {};
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount - 1; c++) {
          const src = c < col ? c : c + 1;
          next[`${r},${c}`] = prev[`${r},${src}`] || empty();
        }
      }
      return next;
    });
    setColWidths(prev => prev.filter((_, i) => i !== col));
    setColCount(prev => prev - 1);
  };
  const startResizeCol = (colIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = colWidths[colIndex];
    const onMove = (moveEvent: MouseEvent) => {
      const newW = startW + (moveEvent.clientX - startX);
      if (newW > 30) {
        setColWidths(prev => prev.map((w, i) => (i === colIndex ? newW : w)));
      }
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const startResizeRow = (rowIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = rowHeights[rowIndex];
    const onMove = (moveEvent: MouseEvent) => {
      const newH = startH + (moveEvent.clientY - startY);
      if (newH > 20) {
        setRowHeights(prev => prev.map((h, i) => (i === rowIndex ? newH : h)));
      }
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  useEffect(() => {
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);
  const getFormulaValue = () => {
    if (editing) return editing.text;
    if (selected) {
      const key = `${selected.row},${selected.col}`;
      return cells[key].formula || cells[key].display;
    }
    return '';
  };

  const RowRenderer = ({ index }: { index: number }) => (
    <div className="row" style={{ height: rowHeights[index] }}>
      <div className="cell row-header" style={{ height: rowHeights[index], position: 'relative' }}>
        {index + 1}
        <div className="resize-handle-row" onMouseDown={(e) => startResizeRow(index, e)} />
      </div>
      {Array(colCount).fill(0).map((_, col) => (
        <Cell
          key={col}
          row={index}
          col={col}
          value={cells[`${index},${col}`]?.display || ''}
          isSelected={isSelected(index, col)}
          isInRange={isInRange(index, col)}
          width={colWidths[col]}
          onSelect={onCellClick}
          onDoubleClick={startEdit}
          onContextMenu={(r, c, e) => {
            e.preventDefault();
            setMenu({ row: r, col: c, x: e.clientX, y: e.clientY });
          }}
          editing={editing}
          onEditChange={(text) => setEditing((prev) => (prev ? { ...prev, text } : null))}
          onEditFinish={finishEdit}
        />
      ))}
    </div>
  );
  return (
    <div className="app">
      <Formul
        value={getFormulaValue()}
        onChange={(val) => {
          if (editing) {
            setEditing({ ...editing, text: val });
          } else if (selected) {
            startEdit(selected.row, selected.col);
            setEditing((prev) => (prev ? { ...prev, text: val } : null));
          }
        }}
        onEnter={finishEdit}
      />
      <div className="table-container">
        <div className="table">
          <div className="row header-row">
            <div className="cell corner"></div>
            {Array(colCount).fill(0).map((_, c) => (
              <div key={c} className="cell header-cell" style={{ width: colWidths[c] }}>
                {String.fromCharCode(65 + c)}
                <div className="resize-handle" onMouseDown={(e) => startResizeCol(c, e)} />
              </div>
            ))}
          </div>
          <Virtuoso style={{ height: 700 }} totalCount={rowCount} itemContent={(index) => <RowRenderer index={index} />}/>
        </div>
      </div>
      {menu && (
        <Menu
          x={menu.x}
          y={menu.y}
          onAddRow={() => addRow(menu.row)}
          onAddCol={() => addCol(menu.col)}
          onDeleteRow={() => deleteRow(menu.row)}
          onDeleteCol={() => deleteCol(menu.col)}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}
export default App;
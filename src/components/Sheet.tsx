import React, { useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  updCell,
  setSel,
  setRange,
  setColW,
  setRowH,
  addRow,
  delRow,
  addCol,
  delCol,
  undo,
  redo,
  load,
  recalc,
} from '../slices/sheetSlice';
import type { CellData } from '../types';
import Cell from './Cell';
import FormulaBar from './Formul';
import Menu from './Menu';
import '../App.css';

function Sheet() {
  const dispatch = useAppDispatch();
  const { cells, rows, cols, colW, rowH, sel, range } = useAppSelector((s) => s.sheet);
  const saveStatus = useAppSelector((s) => s.ui.saveStatus);
  const [editing, setEditing] = useState<{ row: number; col: number; text: string } | null>(null);
  const [menu, setMenu] = useState<{ row: number; col: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch(undo());
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        dispatch(redo());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  useEffect(() => {
    dispatch(recalc());
  }, [cells, dispatch]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (saveStatus !== 'saved') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [saveStatus]);

  const startEdit = (row: number, col: number) => {
    const key = `${row},${col}`;
    const text = cells[key]?.formula || cells[key]?.display || '';
    setEditing({ row, col, text });
  };

  const finishEdit = () => {
    if (editing) {
      dispatch(updCell({ row: editing.row, col: editing.col, raw: editing.text }));
      setEditing(null);
    }
  };

  const onCellClick = (row: number, col: number, e: React.MouseEvent) => {
    if (e.shiftKey && sel) dispatch(setRange({ start: sel, end: { row, col } }));
    else {
      dispatch(setSel({ row, col }));
      dispatch(setRange(null));
    }
  };

  const isSel = (r: number, c: number) => sel?.row === r && sel?.col === c;
  const inRange = (r: number, c: number) => {
    if (!range) return false;
    const r1 = Math.min(range.start.row, range.end.row);
    const r2 = Math.max(range.start.row, range.end.row);
    const c1 = Math.min(range.start.col, range.end.col);
    const c2 = Math.max(range.start.col, range.end.col);
    return r >= r1 && r <= r2 && c >= c1 && c <= c2;
  };

  const startResizeCol = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX,
      startW = colW[idx];
    const onMove = (me: MouseEvent) => {
      const newW = startW + (me.clientX - startX);
      if (newW > 30) dispatch(setColW({ idx, w: newW }));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const startResizeRow = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY,
      startH = rowH[idx];
    const onMove = (me: MouseEvent) => {
      const newH = startH + (me.clientY - startY);
      if (newH > 20) dispatch(setRowH({ idx, h: newH }));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const getFormulaValue = () => {
    if (editing) return editing.text;
    if (sel)
      return (
        cells[`${sel.row},${sel.col}`]?.formula || cells[`${sel.row},${sel.col}`]?.display || ''
      );
    return '';
  };

  const handleFormulaChange = (val: string) => {
    if (editing) {
      dispatch(updCell({ row: editing.row, col: editing.col, raw: val }));
      setEditing(null);
    } else if (sel) {
      dispatch(updCell({ row: sel.row, col: sel.col, raw: val }));
    }
  };

  const handleFormulaEnter = () => {
    if (editing) {
      dispatch(updCell({ row: editing.row, col: editing.col, raw: editing.text }));
      setEditing(null);
    }
  };

  const exportCSV = () => {
    let csv = [];
    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
        let val = cells[`${r},${c}`]?.display || '';
        row.push(`"${val.replace(/"/g, '""')}"`);
      }
      csv.push(row.join(','));
    }
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'file.csv';
    a.click();
  };

  const exportJSON = () => {
    const data = { cells, colW, rowH, rows, cols };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'file.json';
    a.click();
  };

  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newRows = lines.length;
      let newCols = 0;
      for (const line of lines) newCols = Math.max(newCols, line.split(',').length);
      const newCells: Record<string, CellData> = {};
      for (let r = 0; r < newRows; r++) {
        const vals = lines[r].split(',').map((v) => v.replace(/^"|"$/g, '').replace(/""/g, '"'));
        for (let c = 0; c < vals.length; c++) {
          newCells[`${r},${c}`] = { value: vals[c], formula: '', display: vals[c] };
        }
      }
      dispatch(
        load({
          cells: newCells,
          rows: newRows,
          cols: newCols,
          colW: Array(newCols).fill(100),
          rowH: Array(newRows).fill(25),
          sel: null,
          range: null,
        })
      );
    };
    reader.readAsText(file);
  };

  const RowRenderer = ({ index }: { index: number }) => (
    <div className="row" style={{ height: rowH[index] }}>
      <div className="cell row-header" style={{ height: rowH[index], position: 'relative' }}>
        {index + 1}
        <div className="resize-handle-row" onMouseDown={(e) => startResizeRow(index, e)} />
      </div>
      {Array(cols)
        .fill(0)
        .map((_, col) => (
          <Cell
            key={col}
            row={index}
            col={col}
            value={cells[`${index},${col}`]?.display || ''}
            isSelected={isSel(index, col)}
            isInRange={inRange(index, col)}
            width={colW[col]}
            onSelect={onCellClick}
            onDoubleClick={startEdit}
            onContextMenu={(r, c, e) => {
              e.preventDefault();
              setMenu({ row: r, col: c, x: e.clientX, y: e.clientY });
            }}
            editing={editing}
            onEditChange={(t) => setEditing((prev) => (prev ? { ...prev, text: t } : null))}
            onEditFinish={finishEdit}
          />
        ))}
    </div>
  );
  return (
    <div className="app">
      <div className="toolbar">
        <button onClick={exportCSV}>CSV</button>
        <button onClick={exportJSON}>JSON</button>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files && importCSV(e.target.files[0])}
        />
        <div className="save-status">
          {saveStatus === 'saved' ? 'Сохранено' : saveStatus === 'saving' ? 'Сохранение...' : ''}
        </div>
      </div>
      <FormulaBar
        value={getFormulaValue()}
        onChange={handleFormulaChange}
        onEnter={handleFormulaEnter}
      />
      <div className="table-container">
        <div className="table">
          <div className="row header-row">
            <div className="cell corner"></div>
            {Array(cols)
              .fill(0)
              .map((_, c) => (
                <div key={c} className="cell header-cell" style={{ width: colW[c] }}>
                  {String.fromCharCode(65 + c)}
                  <div className="resize-handle" onMouseDown={(e) => startResizeCol(c, e)} />
                </div>
              ))}
          </div>
          <Virtuoso
            style={{ height: 700 }}
            totalCount={rows}
            itemContent={(i) => <RowRenderer index={i} />}
          />
        </div>
      </div>
      {menu && (
        <Menu
          x={menu.x}
          y={menu.y}
          onAddRow={() => {
            dispatch(addRow(menu.row));
            setMenu(null);
          }}
          onAddCol={() => {
            dispatch(addCol(menu.col));
            setMenu(null);
          }}
          onDeleteRow={() => {
            dispatch(delRow(menu.row));
            setMenu(null);
          }}
          onDeleteCol={() => {
            dispatch(delCol(menu.col));
            setMenu(null);
          }}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}
export default Sheet;

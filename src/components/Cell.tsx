import React, { useRef, useEffect, useState } from 'react';

interface CellProps {
  row: number;
  col: number;
  value: string;
  isSelected: boolean;
  isInRange: boolean;
  width: number;
  onSelect: (row: number, col: number, e: React.MouseEvent) => void;
  onDoubleClick: (row: number, col: number) => void;
  onContextMenu: (row: number, col: number, e: React.MouseEvent) => void;
  editing: { row: number; col: number; text: string } | null;
  onEditChange: (text: string) => void;
  onEditFinish: () => void;
}
function Cell({
  row,
  col,
  value,
  isSelected,
  isInRange,
  width,
  onSelect,
  onDoubleClick,
  onContextMenu,
  editing,
  onEditChange,
  onEditFinish,
}: CellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editing?.row === row && editing?.col === col;
  const [localText, setLocalText] = useState(isEditing ? editing.text : '');

  useEffect(() => {
    if (isEditing) {
      setLocalText(editing.text);
    }
  }, [isEditing, editing?.text]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalText(e.target.value);
  };
  const finishLocalEdit = () => {
    onEditChange(localText);
    onEditFinish(); 
  };
  if (isEditing) {
    return (
      <div className="cell editing" style={{ width }}>
        <input
          ref={inputRef}
          value={localText}
          onChange={handleChange}
          onBlur={finishLocalEdit}
          onKeyDown={(e) => e.key === 'Enter' && finishLocalEdit()}
        />
      </div>
    );
  }
  return (
    <div
      className={`cell ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
      style={{ width }}
      onClick={(e) => onSelect(row, col, e)}
      onDoubleClick={() => onDoubleClick(row, col)}
      onContextMenu={(e) => onContextMenu(row, col, e)}
    >
      <div>{value}</div>
    </div>
  );
}

export default Cell;
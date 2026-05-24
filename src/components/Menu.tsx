import React from 'react';

interface MenuProps {
  x: number;
  y: number;
  onAddRow: () => void;
  onAddCol: () => void;
  onDeleteRow: () => void;
  onDeleteCol: () => void;
  onClose: () => void;
}
function Menu({ x, y, onAddRow, onAddCol, onDeleteRow, onDeleteCol, onClose }: MenuProps) {
  const handle = (fn: () => void) => {
    fn();
    onClose();
  };
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <button onClick={() => handle(onAddRow)}>Добавить строку</button>
      <button onClick={() => handle(onAddCol)}>Добавить столбец</button>
      <button onClick={() => handle(onDeleteRow)}>Удалить строку</button>
      <button onClick={() => handle(onDeleteCol)}>Удалить столбец</button>
    </div>
  );
}
export default Menu;

import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { renameDoc, removeDoc, copyDoc } from '../slices/docSlice';
import Modal from './Modal';
import type { Document } from '../types';

function Dashboard({ docs, onSelect, onCreate }: { docs: Document[]; onSelect: (id: string) => void; onCreate: () => void }) {
  const dispatch = useAppDispatch();
  const [renameTarget, setRenameTarget] = useState<Document | null>(null);
  const [newName, setNewName] = useState('');

  const startRename = (doc: Document) => { setRenameTarget(doc); setNewName(doc.name); };
  const saveRename = () => {
    if (renameTarget) {
      dispatch(renameDoc({ id: renameTarget.id, name: newName.trim() }));
      setRenameTarget(null);
    }
  };
  const handleDelete = (id: string) => { if (window.confirm('Удалить документ?')) dispatch(removeDoc(id)); };
  const handleCopy = (id: string) => { dispatch(copyDoc(id)); };
  return (
    <div className="dashboard">
      <button onClick={onCreate}>Новый документ</button>
      <div className="doc-list">
        {docs.map(doc => (
          <div key={doc.id} className="doc-card">
            <h3 onClick={() => onSelect(doc.id)}>{doc.name}</h3>
            <div className="doc-meta">
              <span>Создан: {new Date(doc.createdAt).toLocaleDateString()}</span>
              <span>Изменён: {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="doc-preview">
              {(() => {
                const preview = [];
                for (let r = 0; r < Math.min(3, doc.rows); r++) {
                  const row = [];
                  for (let c = 0; c < Math.min(3, doc.cols); c++) {
                    const cell = doc.cells[`${r},${c}`];
                    row.push(cell?.display || '');
                  }
                  preview.push(row.join(' | '));
                }
                return <div className="preview">{preview.join(' / ')}</div>;
              })()}
            </div>
            <div className="doc-actions">
              <button onClick={() => startRename(doc)}>Переименовать</button>
              <button onClick={() => handleDelete(doc.id)}>Удалить</button>
              <button onClick={() => handleCopy(doc.id)}>Копировать</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!renameTarget} onClose={() => setRenameTarget(null)}>
        <h3>Переименовать</h3>
        <input value={newName} onChange={e => setNewName(e.target.value)} />
        <button onClick={saveRename}>Сохранить</button>
      </Modal>
    </div>
  );
}
export default Dashboard;
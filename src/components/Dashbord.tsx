import React, { useState } from 'react';
import type { Document } from '../types';
import { deleteDoc, updateDoc, duplicateDoc } from './Doc';
import Modal from './Modal';

interface DashboardProps {
  docs: Document[];
  onSelect: (id: string) => void;
  onCreate: () => void;
}
function Dashbord({ docs, onSelect, onCreate }: DashboardProps) {
  const [renameTarget, setRenameTarget] = useState<Document | null>(null);
  const [newName, setNewName] = useState('');

  const startRename = (doc: Document) => {
    setRenameTarget(doc);
    setNewName(doc.name);
  };
  const saveRename = () => {
    if (!renameTarget) return;
    const updated = { ...renameTarget, name: newName.trim(), updatedAt: Date.now() };
    updateDoc(updated);
    setRenameTarget(null);
    window.location.reload();
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Удалить документ?')) {
      deleteDoc(id);
      window.location.reload();
    }
  };
  const handleDuplicate = (id: string) => {
    duplicateDoc(id);
    window.location.reload();
  };
  return (
    <div className="Dashbord">
      <button onClick={onCreate}>Новый документ</button>
      <div className="doc-list">
        {docs.map(doc => (
          <div key={doc.id} className="doc-card">
            <h3 onClick={() => onSelect(doc.id)}>{doc.name}</h3>
            <div className="doc-meta">
              <span>Создан: {new Date(doc.createdAt).toLocaleDateString()}</span>
              <span>Изменен: {new Date(doc.updatedAt).toLocaleDateString()}</span>
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
              <button onClick={() => handleDuplicate(doc.id)}>Копировать</button>
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
export default Dashbord;
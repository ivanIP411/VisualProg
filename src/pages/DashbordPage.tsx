import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchDocs, setCurId, createDoc } from '../slices/docSlice';
import { openModal, closeModal } from '../slices/uiSlice';
import { load } from '../slices/sheetSlice';
import { getDoc } from '../components/Doc';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashbord';
import Modal from '../components/Modal';

function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const docs = useAppSelector((s) => s.docs.list);
  const modalOpen = useAppSelector((s) => s.ui.newModal);
  const [newName, setNewName] = useState('');
  const [newRows, setNewRows] = useState(10);
  const [newCols, setNewCols] = useState(5);
  useEffect(() => {
    dispatch(fetchDocs());
  }, []);
  const openDoc = (id: string) => {
    const doc = getDoc(id);
    if (doc) {
      dispatch(
        load({
          cells: doc.cells,
          rows: doc.rows,
          cols: doc.cols,
          colW: doc.colW,
          rowH: doc.rowH,
          sel: null,
          range: null,
        })
      );
      dispatch(setCurId(id));
      navigate(`/documents/${id}`);
    }
  };
  const handleCreate = () => {
    dispatch(createDoc({ name: newName.trim() || 'Новый документ', rows: newRows, cols: newCols }));
    dispatch(closeModal());
    setNewName('');
    setNewRows(10);
    setNewCols(5);
  };
  return (
    <>
      <Dashboard docs={docs} onSelect={openDoc} onCreate={() => dispatch(openModal())} />
      <Modal open={modalOpen} onClose={() => dispatch(closeModal())}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Название"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <label>Строки:</label>
          <input
            type="number"
            value={newRows}
            onChange={(e) => setNewRows(Number(e.target.value))}
            min={1}
            style={{ width: '70px' }}
          />
          <label>Столбцы:</label>
          <input
            type="number"
            value={newCols}
            onChange={(e) => setNewCols(Number(e.target.value))}
            min={1}
            style={{ width: '70px' }}
          />
          <button onClick={handleCreate}>Создать</button>
        </div>
      </Modal>
    </>
  );
}
export default DashboardPage;

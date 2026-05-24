import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getDoc } from '../components/Doc';
import { load, setSel, setRange } from '../slices/sheetSlice';
import { setCurId } from '../slices/docSlice';
import Sheet from '../components/Sheet';

function SheetPage() {
  const { documentId } = useParams();
  const dispatch = useAppDispatch();
  const curId = useAppSelector(s => s.docs.curId);
  const [docName, setDocName] = useState<string>('');

  useEffect(() => {
    if (documentId) {
      const doc = getDoc(documentId);
      if (doc) {
        setDocName(doc.name);
      }
      if (documentId !== curId) {
        const docData = getDoc(documentId);
        if (docData) {
          dispatch(load({
            cells: docData.cells,
            rows: docData.rows,
            cols: docData.cols,
            colW: docData.colW,
            rowH: docData.rowH,
            sel: null,
            range: null,
          }));
          dispatch(setCurId(documentId));
          dispatch(setSel(null));
          dispatch(setRange(null));
        }
      }
    }
  }, [documentId]);

  if (!documentId) return <div>Ошибка: ID документа не указан</div>;
  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/dashboard">Мои документы</Link>
        <span> / {docName || 'Загрузка...'}</span>
      </div>
      <Sheet />
    </div>
  );
}
export default SheetPage;
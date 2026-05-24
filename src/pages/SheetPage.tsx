import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getDoc } from '../components/Doc';
import { load, setSel, setRange } from '../slices/sheetSlice';
import { setCurId } from '../slices/docSlice';
import Sheet from '../components/Sheet';

function SheetPage() {
  const { documentId } = useParams();
  const dispatch = useAppDispatch();
  const curId = useAppSelector((s) => s.docs.curId);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [docData, setDocData] = useState<any>(null);

  useEffect(() => {
    if (!documentId) {
      setAllowed(false);
      return;
    }
    const doc = getDoc(documentId);
    if (!doc) {
      setAllowed(false);
      return;
    }
    setAllowed(true);
    setDocData(doc);
  }, [documentId]);

  useEffect(() => {
    if (allowed && docData && documentId && documentId !== curId) {
      dispatch(
        load({
          cells: docData.cells,
          rows: docData.rows,
          cols: docData.cols,
          colW: docData.colW,
          rowH: docData.rowH,
          sel: null,
          range: null,
        })
      );
      dispatch(setCurId(documentId));
      dispatch(setSel(null));
      dispatch(setRange(null));
    }
  }, [allowed, docData, documentId, curId, dispatch]);

  if (allowed === null) return <div>Загрузка...</div>;
  if (!allowed) return <Navigate to="/dashboard" replace />;
  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/dashboard">Мои документы</Link>
        <span> / </span>
      </div>
      <Sheet />
    </div>
  );
}
export default SheetPage;

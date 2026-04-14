import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBoard, updateBoard, deleteBoard } from '../api';
import LayerPopup from '../components/LayerPopup';
import LoadingBar from '../components/LoadingBar';
import msg from '../messages';

export default function BoardEdit() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const origTitle = useRef('');
  const origDesc = useRef('');

  useEffect(() => {
    fetchBoard(idx).then(data => {
      setBoard(data);
      setTitle(data.title);
      setDescription(data.description);
      origTitle.current = data.title;
      origDesc.current = data.description;
    });
  }, [idx]);

  const hasChanges = () => title !== origTitle.current || description !== origDesc.current || file;

  const handleSubmit = async () => {
    if (!hasChanges()) {
      setPopup({
        message: msg.noChangeConfirm,
        onConfirm: () => { doSave(); setPopup(null); },
        onCancel: () => setPopup(null),
      });
      return;
    }
    doSave();
  };

  const doSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      if (file) fd.append('file', file);
      await updateBoard(idx, fd);
      navigate('/board/list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setPopup({
      message: msg.deleteConfirm,
      onConfirm: async () => { await deleteBoard(idx); navigate('/board/list'); },
      onCancel: () => setPopup(null),
    });
  };

  const handleDownload = async () => {
    if (!board?.filePath) return;
    const url = `/api/upload/download?filePath=${encodeURIComponent(board.filePath)}&originalName=${encodeURIComponent(board.originalFileName || '')}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) { window.location.href = url; }
      else { setPopup({ message: msg.fileNotFound, onConfirm: () => setPopup(null), confirmOnly: true }); }
    } catch { setPopup({ message: msg.fileNotFound, onConfirm: () => setPopup(null), confirmOnly: true }); }
  };

  if (!board) return <div className="container-narrow"></div>;

  return (
    <div className="container-narrow">
      <h1>{msg.boardEditTitle}</h1>
      <form onSubmit={e => e.preventDefault()}>
        <label htmlFor="title">{msg.labelTitle}</label>
        <input id="title" value={title} onChange={e=>setTitle(e.target.value)} required />

        <label>{msg.labelFile}</label>
        {board.filePath ? (
          <div className="file-info">
            📎 <a href="#" onClick={e=>{e.preventDefault();handleDownload();}}>{board.originalFileName || board.filePath}</a>
          </div>
        ) : (
          <div className="file-none">{msg.fileNone}</div>
        )}
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <span className="file-hint">{msg.fileReplaceHint}</span>

        <label htmlFor="description">{msg.labelContent}</label>
        <textarea id="description" value={description} onChange={e=>setDescription(e.target.value)} required />

        <div className="btn-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button type="button" className="btn-submit" onClick={handleSubmit}>{msg.btnEdit}</button>
          <button type="button" className="btn-cancel" onClick={()=>navigate('/board/list')}>{msg.btnCancel}</button>
          <button type="button" className="btn-delete" onClick={handleDelete}>{msg.btnDelete}</button>
        </div>
      </form>
      {popup && <LayerPopup {...popup} />}
      {loading && <LoadingBar message="수정 중..." />}
    </div>
  );
}

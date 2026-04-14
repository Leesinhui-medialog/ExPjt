import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../api';
import msg from '../messages';
import LoadingBar from '../components/LoadingBar';

export default function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    if (file) fd.append('file', file);
    try {
      await createBoard(fd);
      navigate('/board/list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow">
      <h1>{msg.boardWriteTitle}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">{msg.labelTitle}</label>
        <input id="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder={msg.placeholderTitle} required />

        <label htmlFor="file">{msg.labelFile}</label>
        <input id="file" type="file" onChange={e=>setFile(e.target.files[0])} />

        <label htmlFor="description">{msg.labelContent}</label>
        <textarea id="description" value={description} onChange={e=>setDescription(e.target.value)} placeholder={msg.placeholderContent} required />

        <div className="btn-group">
          <button type="submit" className="btn-submit">{msg.btnSubmit}</button>
          <button type="button" className="btn-cancel" onClick={()=>navigate('/board/list')}>{msg.btnCancel}</button>
        </div>
      </form>
      {loading && <LoadingBar message="등록 중..." />}
    </div>
  );
}

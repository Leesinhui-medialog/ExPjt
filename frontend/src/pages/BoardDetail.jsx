import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileIcon from '../components/FileIcon';
import msg from '../messages';

/**
 * 게시글 상세 보기 페이지.
 * 게시글 제목, 내용, 첨부파일, 작성일을 표시하고 수정/취소 버튼을 제공한다.
 */
export default function BoardDetail() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetch(`/api/board/${idx}`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('게시글을 찾을 수 없습니다.');
        return res.json();
      })
      .then(data => setBoard(data))
      .catch(() => navigate('/board/list'));
  }, [idx, navigate]);

  if (!board) return null;

  /** 첨부파일 다운로드 처리 */
  const handleDownload = () => {
    if (!board.filePath) return;
    const url = `/api/upload/download?filePath=${encodeURIComponent(board.filePath)}&originalName=${encodeURIComponent(board.originalFileName || '')}`;
    window.location.href = url;
  };

  return (
    <div className="container-narrow">
      <h1>게시글 상세</h1>
      <div style={{ marginBottom: '16px' }}>
        <label>{msg.labelTitle}</label>
        <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', minHeight: '20px' }}>
          {board.title}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>첨부파일</label>
        <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', minHeight: '20px' }}>
          {board.filePath ? (
            <span style={{ cursor: 'pointer', color: '#4a90d9' }} onClick={handleDownload}>
              <FileIcon filePath={board.filePath} /> {board.originalFileName || '첨부파일'}
            </span>
          ) : (
            <span style={{ color: '#999' }}>첨부파일 없음</span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>{msg.labelContent}</label>
        <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', minHeight: '150px', whiteSpace: 'pre-wrap' }}>
          {board.description}
        </div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label>작성자</label>
          <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            {board.authorName || '익명'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label>작성일</label>
          <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            {board.regDate}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label>수정일</label>
          <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            {board.modDate || '-'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label>조회수</label>
          <div style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            {board.viewCount || 0}
          </div>
        </div>
      </div>

      <div className="btn-group" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <button type="button" className="btn-submit" onClick={() => navigate(`/board/edit/${board.idx}`)}>수정</button>
        <button type="button" className="btn-cancel" onClick={() => navigate('/board/list')}>취소</button>
      </div>
    </div>
  );
}

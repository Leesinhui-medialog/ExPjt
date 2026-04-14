import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBoardList } from '../api';
import FileIcon from '../components/FileIcon';
import msg from '../messages';

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * 텍스트를 한글 50자/영문 100자 기준으로 잘라서 표시한다.
   * 한글은 2바이트, 영문은 1바이트로 계산하여 최대 100바이트까지 표시.
   */
  const truncateText = (text, maxBytes = 100) => {
    if (!text) return '';
    let byteCount = 0;
    let result = '';
    for (const char of text) {
      const charBytes = char.charCodeAt(0) > 127 ? 2 : 1;
      if (byteCount + charBytes > maxBytes) {
        return result + '...';
      }
      byteCount += charBytes;
      result += char;
    }
    return result;
  };

  useEffect(() => {
    fetchBoardList(page).then(data => {
      setBoards(data.content || []);
      setTotalPages(data.totalPages || 0);
    });
  }, [page]);

  return (
    <div className="container-wide">
      <h1>{msg.boardListTitle}</h1>
      <div className="text-right mb-12">
        <Link to="/board/write" className="btn-link">{msg.boardWrite}</Link>
      </div>
      <table>
        <thead>
          <tr><th>{msg.colNo}</th><th>첨부</th><th style={{ width: '60%' }}>{msg.colTitle}</th><th>작성자</th><th>읽음</th><th>{msg.colDate}</th></tr>
        </thead>
        <tbody>
          {boards.length === 0 && (
            <tr><td colSpan="6" className="empty">{msg.emptyList}</td></tr>
          )}
          {boards.map(b => (
            <tr key={b.idx}>
              <td style={{ textAlign: 'center' }}>{b.idx}</td>
              <td style={{ textAlign: 'center' }}>{b.filePath && <a href={`/api/upload/download?filePath=${encodeURIComponent(b.filePath)}`} title={b.originalFileName || '다운로드'}><FileIcon filePath={b.filePath} /></a>}</td>
              <td>
                <Link to={`/board/edit/${b.idx}`}>{truncateText(b.title)}</Link>
              </td>
              <td style={{ textAlign: 'center' }}>{b.authorName || '익명'}</td>
              <td style={{ textAlign: 'center' }}>{b.viewCount || 0}</td>
              <td>{b.regDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages >= 1 && (
        <div className="paging">
          {page > 0 && <a href="#" onClick={e=>{e.preventDefault();setPage(page-1);}}>{msg.pagePrev}</a>}
          {Array.from({length: totalPages}, (_, i) => (
            <a key={i} href="#" className={i === page ? 'active' : ''} onClick={e=>{e.preventDefault();setPage(i);}}>{i+1}</a>
          ))}
          {page < totalPages-1 && <a href="#" onClick={e=>{e.preventDefault();setPage(page+1);}}>{msg.pageNext}</a>}
        </div>
      )}
    </div>
  );
}

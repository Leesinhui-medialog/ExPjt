import { Route } from 'react-router-dom';
import BoardList from '../pages/BoardList';
import BoardWrite from '../pages/BoardWrite';
import BoardEdit from '../pages/BoardEdit';
import BoardDetail from '../pages/BoardDetail';

/**
 * 게시판 관련 라우트 배열을 반환한다.
 * @param {Function} ProtectedRoute - 인증 가드 컴포넌트
 */
export default function boardRoutes(ProtectedRoute) {
  return [
    <Route key="board-list" path="/board/list" element={<ProtectedRoute><BoardList /></ProtectedRoute>} />,
    <Route key="board-write" path="/board/write" element={<ProtectedRoute><BoardWrite /></ProtectedRoute>} />,
    <Route key="board-detail" path="/board/detail/:idx" element={<ProtectedRoute><BoardDetail /></ProtectedRoute>} />,
    <Route key="board-edit" path="/board/edit/:idx" element={<ProtectedRoute><BoardEdit /></ProtectedRoute>} />,
  ];
}

import { Route } from 'react-router-dom';
import MemberList from '../pages/MemberList';
import MemberEdit from '../pages/MemberEdit';
import PasswordChange from '../pages/PasswordChange';

/**
 * 회원 관련 라우트 배열을 반환한다.
 * @param {Function} ProtectedRoute - 인증 가드 컴포넌트
 */
export default function memberRoutes(ProtectedRoute) {
  return [
    <Route key="member-list" path="/member/list" element={<ProtectedRoute><MemberList /></ProtectedRoute>} />,
    <Route key="member-edit" path="/member/edit" element={<ProtectedRoute><MemberEdit /></ProtectedRoute>} />,
    <Route key="member-password" path="/member/password" element={<ProtectedRoute><PasswordChange /></ProtectedRoute>} />,
  ];
}

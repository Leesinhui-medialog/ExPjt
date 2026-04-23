import { Route } from 'react-router-dom';
import LocationDisplay from '../pages/golf/LocationDisplay';

/**
 * 기타 라우트 배열을 반환한다 (위치 정보 등).
 * @param {Function} ProtectedRoute - 인증 가드 컴포넌트
 */
export default function otherRoutes(ProtectedRoute) {
  return [
    <Route key="location-display" path="/location/display" element={<ProtectedRoute><LocationDisplay /></ProtectedRoute>} />,
  ];
}

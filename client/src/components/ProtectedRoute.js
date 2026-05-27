import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../services/apiClient';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getAuthToken()) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
}
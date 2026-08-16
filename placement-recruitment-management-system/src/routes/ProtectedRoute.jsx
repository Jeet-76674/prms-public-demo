import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();

  if (!token) {
    // Save attempted route for post-login redirect
    return <Navigate to="/select-role" replace />;
  }

  if (allowedRoles && role && !allowedRoles.map(r => r.toUpperCase()).includes(role.toUpperCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.VaiTro)) {
    return <Navigate to="/" replace />; // Or to a specific "Not Authorized" page
  }

  return <Outlet />;
};

export default ProtectedRoute;

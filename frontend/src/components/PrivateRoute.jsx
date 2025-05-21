import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in, redirect to sign in
    return <Navigate to='/signin' replace />;
  }

  // Logged in, allow access
  return children;
}

export default PrivateRoute;

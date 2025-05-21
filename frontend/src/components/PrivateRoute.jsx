import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to signin, preserving the current page location in state
    return <Navigate to='/signin' replace state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;

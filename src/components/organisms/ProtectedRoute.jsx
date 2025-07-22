import { Navigate } from "react-router-dom";

// A higher-order component or hook to protect routes
const ProtectedRoute = ({ children, role: requiredRole }) => {
  const user = localStorage.getItem('usuario');
  const userRole = localStorage.getItem('rol');

  if (!user || userRole !== requiredRole ) {
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoute;
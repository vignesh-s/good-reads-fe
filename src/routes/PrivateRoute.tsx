import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Important: don't render redirects too early

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

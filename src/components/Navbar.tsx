import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm px-4 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          📚 goodreads
        </Link>

        {getToken() ? (
          <div className="d-flex align-items-center gap-3">
            <span className="me-3">Hello, {user} 👋</span>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

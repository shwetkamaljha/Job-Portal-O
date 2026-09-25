import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="brand">
          Bridge<span>.</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>

          {(!user || user.role === 'seeker') && (
            <NavLink to="/jobs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Browse jobs
            </NavLink>
          )}

          {user?.role === 'seeker' && (
            <NavLink to="/my-applications" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              My applications
            </NavLink>
          )}

          {user?.role === 'employer' && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Log in
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </NavLink>
            </>
          ) : (
            <div className="nav-user">
              <div>
                <div className="nav-user-name">{user.name}</div>
              </div>
              <span className="nav-user-role">{user.role}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

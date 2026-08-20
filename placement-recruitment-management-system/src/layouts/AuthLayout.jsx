import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  const location = useLocation();
  
  // Dynamic max-width based on route path
  let maxWidth = '440px';
  if (location.pathname === '/select-role') {
    maxWidth = '980px';
  } else if (location.pathname.endsWith('/signup')) {
    maxWidth = '500px';
  }

  const isRoleSelection = location.pathname === '/select-role';
  const isSignUp = location.pathname.endsWith('/signup');
  const backToRolesUrl = isSignUp ? '/select-role?mode=signup' : '/select-role';

  return (
    <div className="min-vh-100 d-flex flex-column auth-page-bg">
      {/* Full Header Navbar Matching Landing Page */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2.5 border-bottom border-light">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/" style={{ textDecoration: 'none' }}>
            <div className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '1.1rem' }}>
              P
            </div>
            <span className="fw-bold tracking-tight text-slate-900 m-0" style={{ fontSize: '1.2rem', color: '#1E293B' }}>PRMS Pro</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#authNavbar"
            aria-controls="authNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="authNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-3">
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold text-secondary" href="/#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold text-secondary" href="/#journey">
                  Placement Journey
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold text-secondary" href="/#stats">
                  Statistics
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <Link to="/select-role?mode=login" className="btn btn-outline-primary px-4">
                Sign In
              </Link>
              <Link to="/select-role?mode=signup" className="btn btn-primary px-4 shadow-sm">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Form Center Stage */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-4 px-3">
        <div className="w-100" style={{ maxWidth, transition: 'max-width 0.3s ease' }}>
          {!isRoleSelection && (
            <div className="mb-3 text-start">
              <Link 
                to={backToRolesUrl} 
                className="btn-back rounded-pill px-3 py-1.5"
                style={{ fontSize: '0.85rem' }}
              >
                <ArrowLeft size={16} className="text-primary" />
                <span>Back to Role Selection</span>
              </Link>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}






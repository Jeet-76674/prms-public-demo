import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Info, Compass, Phone, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import DemoBanner from '../components/DemoBanner';

export default function PublicLayout() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    const r = (role || '').toUpperCase();
    if (r === 'VC') return '/dashboard/vc';
    if (r === 'TPO') return '/dashboard/tpo';
    if (r === 'STUDENT') return '/dashboard/student';
    if (r === 'RECRUITER') return '/dashboard/recruiter';
    return '/select-role';
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-pattern">
      <DemoBanner />

      {/* Sticky Header Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2.5 border-bottom border-light">
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
            data-bs-target="#publicNavbar"
            aria-controls="publicNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="publicNavbar">
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
              {token ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                  >
                    <Sparkles size={16} />
                    <span>Go to Portal</span>
                  </Link>
                  <button onClick={logout} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/select-role?mode=login" className="btn btn-outline-primary px-4">
                    Sign In
                  </Link>
                  <Link to="/select-role?mode=signup" className="btn btn-primary px-4 shadow-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow-1 d-flex flex-column">
        <Outlet />
      </main>

      {/* Modern Compact & Polished Footer */}
      <footer className="text-light py-5 mt-auto" style={{ backgroundColor: '#0B132B' }}>
        <div className="container">
          <div className="row g-4 pb-4 border-bottom border-secondary border-opacity-25">
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '1.1rem' }}>
                  P
                </div>
                <span className="fw-bold tracking-tight text-white" style={{ fontSize: '1.2rem' }}>PRMS Pro</span>
              </div>
              <p className="text-slate-400 mb-3" style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94A3B8' }}>
                Next-generation Placement & Recruitment Management System empowering universities, candidates, and enterprise recruiters with seamless workflows.
              </p>
              <div className="d-flex align-items-center gap-2 text-xs" style={{ color: '#64748B', fontSize: '0.8rem' }}>
                <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-20 px-2 py-1 rounded">System Online</span>
                <span>•</span>
                <span>High Precision Gateway</span>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white fw-bold mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>For Students</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Explore Jobs</Link></li>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Build Profile</Link></li>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Upload Resume</Link></li>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Track Status</Link></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white fw-bold mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>For Recruiters</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Post Openings</Link></li>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Review Applicants</Link></li>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Candidate Search</Link></li>
                <li className="mb-2"><Link to="/select-role" className="text-decoration-none transition-all" style={{ color: '#94A3B8' }}>Schedule Drives</Link></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6 className="text-white fw-bold mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>Support & Inquiries</h6>
              <p className="mb-3" style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>
                For technical support, registration queries, or corporate partnership inquiries, reach out to the university portal desk.
              </p>
              <div style={{ fontSize: '0.825rem', color: '#CBD5E1' }}>
                <div className="mb-1"><span className="text-secondary opacity-75">Email:</span> <span className="fw-medium text-white">support@prms-university.edu</span></div>
                <div><span className="text-secondary opacity-75">Phone:</span> <span className="fw-medium text-white">+1 (800) 555-0199</span></div>
              </div>
            </div>
          </div>

          <div className="pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3" style={{ fontSize: '0.825rem', color: '#94A3B8' }}>
            <div className="d-flex align-items-center flex-wrap gap-2 text-center text-md-start justify-content-center justify-content-md-start">
              <span>© 2026 PRMS Pro. All rights reserved.</span>
              <span className="d-none d-sm-inline text-secondary opacity-50">•</span>
              <span className="d-inline-flex align-items-center gap-1.5 flex-wrap justify-content-center">
                Crafted with <span style={{ color: '#EF4444' }}>❤️</span> & lots of <span style={{ color: '#F59E0B' }}>☕</span> by{' '}
                <a 
                  href="https://portfolio-mocha-nine-99.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="fw-bold text-white text-decoration-none px-2.5 py-0.5 rounded-pill transition-all d-inline-flex align-items-center gap-1 shadow-xs"
                  style={{ backgroundColor: 'rgba(37, 99, 235, 0.25)', border: '1px solid rgba(59, 130, 246, 0.4)' }}
                  title="View Jeet Tetar's Developer Portfolio"
                >
                  <span>Jeet Tetar</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </a>
              </span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link to="/" className="text-decoration-none" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
              <span>•</span>
              <Link to="/" className="text-decoration-none" style={{ color: '#94A3B8' }}>Terms of Service</Link>
              <span>•</span>
              <Link to="/" className="text-decoration-none" style={{ color: '#94A3B8' }}>Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Unauthorized() {
  const { role, token } = useAuth();

  const getDashboardPath = () => {
    const r = (role || '').toUpperCase();
    if (r === 'VC') return '/dashboard/vc';
    if (r === 'TPO') return '/dashboard/tpo';
    if (r === 'STUDENT') return '/dashboard/student';
    if (r === 'RECRUITER') return '/dashboard/recruiter';
    return '/select-role';
  };

  return (
    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5 px-3 my-auto">
      <div 
        className="card shadow-lg p-4 p-md-5 border-0 text-center bg-white" 
        style={{ maxWidth: '480px', width: '100%', borderRadius: '20px' }}
      >
        <div 
          className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-3 mb-4 mx-auto"
          style={{ width: '80px', height: '80px' }}
        >
          <ShieldAlert size={42} />
        </div>
        
        <h2 className="fw-bold mb-2 text-slate-900 tracking-tight" style={{ fontSize: '1.75rem' }}>
          Access Restricted
        </h2>
        
        <p className="text-secondary mb-4 mx-auto" style={{ fontSize: '0.925rem', lineHeight: '1.6', maxWidth: '380px' }}>
          {token
            ? `You are currently logged in as a ${role || 'User'}, which does not have permission to view this specific section.`
            : 'You are not authorized to view this page. Please sign in with an authorized account.'}
        </p>

        <div className="d-flex flex-column gap-3 w-100">
          {token ? (
            <Link 
              to={getDashboardPath()} 
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2.5 px-4 fw-semibold rounded-3 shadow-sm text-decoration-none"
              style={{ fontSize: '0.95rem' }}
            >
              <LayoutDashboard size={18} />
              <span>Go to My Dashboard</span>
            </Link>
          ) : (
            <Link 
              to="/select-role" 
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2.5 px-4 fw-semibold rounded-3 shadow-sm text-decoration-none"
              style={{ fontSize: '0.95rem' }}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
          
          <Link 
            to="/select-role" 
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 py-2.5 px-4 fw-semibold rounded-3 text-slate-700 bg-white border border-slate-300 text-decoration-none"
            style={{ fontSize: '0.95rem' }}
          >
            <span>Switch Account Roles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

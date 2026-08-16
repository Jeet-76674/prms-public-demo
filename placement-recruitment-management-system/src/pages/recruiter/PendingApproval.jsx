import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogOut, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterPendingApproval({ status = 'PENDING' }) {
  const { logout } = useAuth();

  const handleRefreshCheck = () => {
    toast.success('Re-checking verification status with university administration...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getStatusContent = () => {
    switch(status) {
      case 'INACTIVE':
        return {
          title: 'Account Inactive',
          subtitle: 'Your account has been deactivated by the Vice Chancellor.',
          desc: 'You no longer have access to publish openings, screen candidates, or view placements. If you believe this is an error, please contact the University Administration.',
          iconColor: 'text-secondary',
          bgColor: 'bg-secondary'
        };
      case 'REJECTED':
        return {
          title: 'Account Rejected',
          subtitle: 'Your registration request was declined.',
          desc: 'The Vice Chancellor has reviewed your corporate credentials and declined the request. You do not have permission to use the platform. Please reach out to the university administration for more details.',
          iconColor: 'text-danger',
          bgColor: 'bg-danger'
        };
      case 'PENDING':
      default:
        return {
          title: 'Verification Pending',
          subtitle: 'Vice Chancellor (VC) Approval Required',
          desc: 'Your corporate recruiter account has been registered. The Vice Chancellor reviews corporate credentials and company authorization before granting portal access.',
          iconColor: 'text-warning',
          bgColor: 'bg-warning'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="d-flex align-items-center justify-content-center bg-light text-start px-3 h-100" style={{ minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card shadow-lg p-4 border-light text-center"
        style={{ borderRadius: '16px', maxWidth: '520px', width: '100%', backgroundColor: '#ffffff' }}
      >
        <div className={`d-inline-flex ${content.bgColor} bg-opacity-10 ${content.iconColor} rounded-circle p-3 mb-3 mx-auto`}>
          <ShieldAlert size={36} />
        </div>

        <h3 className={`fw-bold ${content.iconColor} mb-2`}>{content.title}</h3>
        <h6 className="fw-semibold text-secondary mb-4">{content.subtitle}</h6>
        
        <p className="text-secondary mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          {content.desc}
        </p>

        {status === 'PENDING' && (
          <div className="bg-light rounded-3 p-3 mb-4 text-start border">
            <div className="fw-bold text-secondary mb-1.5" style={{ fontSize: '0.85rem' }}>WHAT HAPPENS NEXT?</div>
            <ul className="text-secondary mb-0 ps-3 text-xs" style={{ lineHeight: '1.5' }}>
              <li className="mb-1">Vice Chancellor reviews registration and business domain.</li>
              <li className="mb-1">An approval notification triggers immediately on clearance.</li>
              <li>You will gain access to publish openings and screen candidate dossiers.</li>
            </ul>
          </div>
        )}

        {/* Refresh simulation */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
          <Loader2 className={`${content.iconColor} border-0`} size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
          <span className="text-muted text-xs">Waiting on Vice Chancellor approval...</span>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <button
              onClick={handleRefreshCheck}
              className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-1.5"
              style={{ fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} />
              <span>Check Status</span>
            </button>
          </div>
          
          <div className="col-6">
            <button
              onClick={logout}
              className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-1.5"
              style={{ fontSize: '0.85rem' }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

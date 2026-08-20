import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw, ShieldCheck, AlertCircle, X, Loader2 } from 'lucide-react';
import { demoService } from '../services/demoService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function DemoBanner() {
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

  if (!isDemoMode || isDismissed) {
    return null;
  }

  const handleReset = async () => {
    try {
      setResetting(true);
      await demoService.resetDemoEnvironment();
      toast.success('Demo environment restored to baseline dataset!', { duration: 4000 });
      setShowConfirmModal(false);
      logout();
      navigate('/select-role');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset demo environment.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <div 
        className="w-100 text-white d-flex align-items-center justify-content-between flex-wrap gap-2"
        style={{ 
          background: 'linear-gradient(90deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)',
          padding: '4px 16px',
          fontSize: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 1050,
          position: 'relative'
        }}
      >
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span 
            className="d-inline-flex align-items-center gap-1 fw-bold text-white shadow-sm" 
            style={{ 
              backgroundColor: '#6366F1', 
              padding: '3px 9px',
              borderRadius: '9999px',
              fontSize: '0.7rem', 
              letterSpacing: '0.04em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={12} style={{ flexShrink: 0 }} />
            <span>DEMO SANDBOX</span>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '0.75rem', lineHeight: 1.3 }}>
            Fictional university data. Uploads are strictly validated and simulated.
          </span>
          {role && (
            <span 
              className="d-inline-flex align-items-center fw-semibold ms-1"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                color: '#C7D2FE',
                border: '1px solid rgba(165, 180, 252, 0.4)',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontSize: '0.65rem',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                lineHeight: 1.2
              }}
            >
              Role: {role}
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-sm d-inline-flex align-items-center gap-1.5 fw-medium text-white shadow-none"
            style={{ 
              fontSize: '0.75rem', 
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              lineHeight: 1.3,
              transition: 'all 0.2s ease'
            }}
            title="Restore baseline students, companies, applications, and jobs"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Baseline</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="btn btn-sm text-white-50 p-1 border-0 d-inline-flex align-items-center justify-content-center"
            title="Hide banner for this session"
            style={{ background: 'transparent', opacity: 0.7 }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="p-4 text-center">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '56px', height: '56px', backgroundColor: '#EEF2FF', color: '#4F46E5' }}
                >
                  <RotateCcw size={28} />
                </div>
                <h5 className="fw-bold text-slate-900 mb-2">Reset Demo Baseline?</h5>
                <p className="text-secondary mb-4" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  This will reload the predefined baseline dataset: 5 students, 4 companies, 4 jobs, application workflow stages, and VC/TPO accounts. Any temporary modifications will be reset.
                </p>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={() => setShowConfirmModal(false)}
                    className="btn btn-light w-50 py-2 fw-semibold text-slate-700"
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={handleReset}
                    className="btn btn-primary w-50 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: '8px', backgroundColor: '#4F46E5' }}
                  >
                    {resetting ? (
                      <>
                        <Loader2 size={16} className="spinner-border spinner-border-sm animate-spin" />
                        <span>Restoring...</span>
                      </>
                    ) : (
                      <span>Confirm Reset</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

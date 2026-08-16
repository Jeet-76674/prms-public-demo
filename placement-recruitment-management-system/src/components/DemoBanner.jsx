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
        className="w-100 py-1.5 px-3 text-white d-flex align-items-center justify-content-between flex-wrap gap-2 shadow-xs"
        style={{ 
          background: 'linear-gradient(90deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)',
          fontSize: '0.82rem',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          zIndex: 1050,
          position: 'relative'
        }}
      >
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge bg-indigo-500 text-white rounded-pill px-2 py-0.5 d-inline-flex align-items-center gap-1" style={{ backgroundColor: '#6366F1' }}>
            <Sparkles size={12} />
            <span>DEMO SANDBOX</span>
          </span>
          <span className="opacity-90">
            Fictional university data. Uploads are strictly validated and simulated.
          </span>
          {role && (
            <span className="badge bg-white bg-opacity-20 text-white ms-1 rounded-pill">
              Active Role: {role}
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-sm btn-outline-light py-0.5 px-2.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-medium"
            style={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.4)' }}
            title="Restore baseline students, companies, applications, and jobs"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Baseline</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="btn btn-sm text-white-50 p-0 ms-1 border-0"
            title="Hide banner for this session"
            style={{ background: 'transparent' }}
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

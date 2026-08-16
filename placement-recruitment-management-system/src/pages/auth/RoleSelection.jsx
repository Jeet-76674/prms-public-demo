import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  Shield, 
  Users, 
  LayoutDashboard, 
  Sparkles, 
  Zap, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('mode') === 'signup';
  const { token, role, login } = useAuth();
  const [quickLoginRole, setQuickLoginRole] = useState(null);

  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

  const getDashboardPath = () => {
    const r = (role || '').toUpperCase();
    if (r === 'VC') return '/dashboard/vc';
    if (r === 'TPO') return '/dashboard/tpo';
    if (r === 'STUDENT') return '/dashboard/student';
    if (r === 'RECRUITER') return '/dashboard/recruiter';
    return '/';
  };

  const handleQuickDemoLogin = async (roleName, email) => {
    try {
      setQuickLoginRole(roleName);
      const res = await login(email, 'Demo@1234', roleName);
      if (res.success) {
        const r = roleName.toUpperCase();
        if (r === 'VC') navigate('/dashboard/vc');
        else if (r === 'TPO') navigate('/dashboard/tpo');
        else if (r === 'STUDENT') navigate('/dashboard/student');
        else navigate('/dashboard/recruiter');
      }
    } catch (err) {
      toast.error('Failed to initiate demo session.');
    } finally {
      setQuickLoginRole(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="py-4"
    >
      <div className="text-center mb-4">
        <h2 className="fw-bold tracking-tight text-slate-900 mb-2" style={{ fontSize: '2.25rem' }}>
          Welcome to <span className="text-gradient">PRMS Pro</span>
        </h2>
        <p className="text-secondary mx-auto" style={{ fontSize: '1.05rem', maxWidth: '520px' }}>
          Choose your gateway below to {isSignUp ? 'register a new account' : 'sign in to your dashboard'}.
        </p>

        {token && (
          <div className="mt-2 mb-3">
            <Link to={getDashboardPath()} className="btn btn-sm btn-primary px-3 py-1.5 rounded-pill shadow-xs d-inline-flex align-items-center gap-2">
              <LayoutDashboard size={15} />
              <span>You are currently signed in — Open {role} Dashboard</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Demo Access Bar (Only in Demo Mode) */}
      {isDemoMode && !isSignUp && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-sm p-4 mb-5 mx-auto"
          style={{ 
            maxWidth: '1080px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)',
            border: '1px solid #E0E7FF'
          }}
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom border-indigo-100">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 text-indigo-600 bg-white shadow-xs">
                <Zap size={20} className="text-primary" />
              </div>
              <div>
                <h6 className="m-0 fw-bold text-slate-900" style={{ fontSize: '1rem' }}>
                  1-Click Instant Demo Access
                </h6>
                <small className="text-secondary" style={{ fontSize: '0.78rem' }}>
                  Explore complete real-time workflows with pre-populated fictional datasets.
                </small>
              </div>
            </div>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2.5 py-1 rounded-pill fw-medium" style={{ fontSize: '0.75rem' }}>
              Password: Demo@1234
            </span>
          </div>

          <div className="row g-2.5">
            {/* Student Demo Button */}
            <div className="col-6 col-md-3">
              <button
                disabled={quickLoginRole !== null}
                onClick={() => handleQuickDemoLogin('STUDENT', 'student.demo@indus.edu')}
                className="btn btn-white w-100 p-2.5 text-start border shadow-xs d-flex flex-column gap-1 bg-white hover-shadow transition-all"
                style={{ borderRadius: '12px' }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center gap-2">
                    <GraduationCap size={18} className="text-primary" />
                    <span className="fw-bold text-slate-800" style={{ fontSize: '0.85rem' }}>Student Demo</span>
                  </div>
                  {quickLoginRole === 'STUDENT' ? (
                    <Loader2 size={14} className="spinner-border spinner-border-sm animate-spin text-primary" />
                  ) : (
                    <ArrowRight size={13} className="text-muted" />
                  )}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>Alex Mercer (9.2 CGPA)</div>
              </button>
            </div>

            {/* Recruiter Demo Button */}
            <div className="col-6 col-md-3">
              <button
                disabled={quickLoginRole !== null}
                onClick={() => handleQuickDemoLogin('RECRUITER', 'recruiter.demo@techcorp.com')}
                className="btn btn-white w-100 p-2.5 text-start border shadow-xs d-flex flex-column gap-1 bg-white hover-shadow transition-all"
                style={{ borderRadius: '12px' }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center gap-2">
                    <Building2 size={18} className="text-success" />
                    <span className="fw-bold text-slate-800" style={{ fontSize: '0.85rem' }}>Recruiter Demo</span>
                  </div>
                  {quickLoginRole === 'RECRUITER' ? (
                    <Loader2 size={14} className="spinner-border spinner-border-sm animate-spin text-success" />
                  ) : (
                    <ArrowRight size={13} className="text-muted" />
                  )}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>TechCorp HR Lead</div>
              </button>
            </div>

            {/* TPO Demo Button */}
            <div className="col-6 col-md-3">
              <button
                disabled={quickLoginRole !== null}
                onClick={() => handleQuickDemoLogin('TPO', 'tpo.demo@indus.edu')}
                className="btn btn-white w-100 p-2.5 text-start border shadow-xs d-flex flex-column gap-1 bg-white hover-shadow transition-all"
                style={{ borderRadius: '12px' }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center gap-2">
                    <Users size={18} style={{ color: '#7C3AED' }} />
                    <span className="fw-bold text-slate-800" style={{ fontSize: '0.85rem' }}>TPO Demo</span>
                  </div>
                  {quickLoginRole === 'TPO' ? (
                    <Loader2 size={14} className="spinner-border spinner-border-sm animate-spin text-purple-600" />
                  ) : (
                    <ArrowRight size={13} className="text-muted" />
                  )}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>Prof. Rajesh Sharma</div>
              </button>
            </div>

            {/* VC Demo Button */}
            <div className="col-6 col-md-3">
              <button
                disabled={quickLoginRole !== null}
                onClick={() => handleQuickDemoLogin('VC', 'vc.demo@indus.edu')}
                className="btn btn-white w-100 p-2.5 text-start border shadow-xs d-flex flex-column gap-1 bg-white hover-shadow transition-all"
                style={{ borderRadius: '12px' }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center gap-2">
                    <Shield size={18} className="text-slate-900" />
                    <span className="fw-bold text-slate-800" style={{ fontSize: '0.85rem' }}>VC Demo</span>
                  </div>
                  {quickLoginRole === 'VC' ? (
                    <Loader2 size={14} className="spinner-border spinner-border-sm animate-spin text-dark" />
                  ) : (
                    <ArrowRight size={13} className="text-muted" />
                  )}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>Dr. K.S. Verma (Admin)</div>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Standard Role Portal Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="row g-4 justify-content-center"
      >
        {/* Student Card */}
        <motion.div variants={itemVariants} className={`col-12 col-md-6 ${isSignUp ? 'col-lg-5' : 'col-lg-3'}`}>
          <div
            onClick={() => navigate(isSignUp ? '/student/signup' : '/student/login')}
            className="role-card role-card-student p-4 h-100 cursor-pointer d-flex flex-column align-items-center text-center"
            style={{ minHeight: '340px' }}
          >
            <div className="role-icon-box bg-primary bg-opacity-10 text-primary">
              <GraduationCap size={32} />
            </div>
            
            <h4 className="fw-bold text-slate-900 mb-2.5" style={{ fontSize: '1.3rem' }}>
              Student Portal
            </h4>
            
            <p className="text-secondary px-2 mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              Build your resume profile, track placements, and apply for verified corporate openings directly.
            </p>

            <button className="btn btn-premium btn-premium-primary w-100 mt-auto d-flex align-items-center justify-content-center gap-2">
              <span>{isSignUp ? 'Student Register' : 'Student Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Recruiter Card */}
        <motion.div variants={itemVariants} className={`col-12 col-md-6 ${isSignUp ? 'col-lg-5' : 'col-lg-3'}`}>
          <div
            onClick={() => navigate(isSignUp ? '/recruiter/signup' : '/recruiter/login')}
            className="role-card role-card-recruiter p-4 h-100 cursor-pointer d-flex flex-column align-items-center text-center"
            style={{ minHeight: '340px' }}
          >
            <div className="role-icon-box bg-success bg-opacity-10 text-success">
              <Building2 size={32} />
            </div>
            
            <h4 className="fw-bold text-slate-900 mb-2.5" style={{ fontSize: '1.3rem' }}>
              Recruiter Portal
            </h4>
            
            <p className="text-secondary px-2 mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              Post career opportunities, evaluate candidates, coordinate interviews, and manage hiring pipelines.
            </p>

            <button className="btn btn-premium btn-premium-success w-100 mt-auto d-flex align-items-center justify-content-center gap-2">
              <span>{isSignUp ? 'Recruiter Register' : 'Recruiter Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* TPO Card (Only for Sign In - No public registration) */}
        {!isSignUp && (
          <motion.div variants={itemVariants} className="col-12 col-md-6 col-lg-3">
            <div
              onClick={() => navigate('/tpo/login')}
              className="role-card role-card-tpo p-4 h-100 cursor-pointer d-flex flex-column align-items-center text-center"
              style={{ minHeight: '340px' }}
            >
              <div className="role-icon-box bg-purple-100 text-purple-600" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>
                <Users size={30} />
              </div>
              
              <h4 className="fw-bold text-slate-900 mb-2.5" style={{ fontSize: '1.3rem' }}>
                TPO Portal
              </h4>
              
              <p className="text-secondary px-2 mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                For Training & Placement Officers to audit students, coordinate jobs, and manage campus drives.
              </p>

              <button className="btn btn-premium btn-premium-tpo w-100 mt-auto d-flex align-items-center justify-content-center gap-2">
                <span>TPO Sign In</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Vice Chancellor (VC) Card (Only for Sign In - No public registration) */}
        {!isSignUp && (
          <motion.div variants={itemVariants} className="col-12 col-md-6 col-lg-3">
            <div
              onClick={() => navigate('/vc/login')}
              className="role-card p-4 h-100 cursor-pointer d-flex flex-column align-items-center text-center"
              style={{ minHeight: '340px', borderTop: '4px solid #0F172A' }}
            >
              <div className="role-icon-box" style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
                <Shield size={28} />
              </div>
              
              <h4 className="fw-bold text-slate-900 mb-2.5" style={{ fontSize: '1.3rem' }}>
                Vice Chancellor
              </h4>
              
              <p className="text-secondary px-2 mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                Highest administrative authority to approve company registrations and govern TPO officers.
              </p>

              <button className="btn btn-dark w-100 mt-auto d-flex align-items-center justify-content-center gap-2 py-2.5 fw-semibold shadow-sm" style={{ backgroundColor: '#0F172A', borderRadius: '8px' }}>
                <span>VC Sign In</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

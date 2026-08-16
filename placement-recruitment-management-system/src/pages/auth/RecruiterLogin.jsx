import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function RecruiterLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

  const fillDemoCredentials = () => {
    setValue('email', 'recruiter.demo@techcorp.com');
    setValue('password', 'Demo@1234');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password, 'recruiter');
    setLoading(false);
    if (result.success) {
      if (result.profileCompleted) {
        navigate('/dashboard/recruiter');
      } else {
        navigate('/recruiter/profile');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="auth-card card-top-accent-recruiter p-4 p-sm-5"
    >
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3" style={{ width: '54px', height: '54px' }}>
          <Mail size={26} />
        </div>
        <h3 className="fw-bold text-slate-900 mb-1.5" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Recruiter Sign In</h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.875rem' }}>
          Welcome back! Access your recruiter portal below.
        </p>

        {isDemoMode && (
          <div className="mt-3">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: '0.78rem' }}
            >
              <span>Auto-Fill Demo: recruiter.demo@techcorp.com</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Email Field */}
        <div className="mb-3.5">
          <label className="form-label fw-semibold text-slate-700 mb-1.5" style={{ fontSize: '0.85rem' }}>
            Work Email Address
          </label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Mail size={17} />
            </span>
            <input
              type="email"
              placeholder="hr@company.com"
              className={`form-control form-control-premium form-control-premium-success ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'Work email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.email.message}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1.5">
            <label className="form-label fw-semibold text-slate-700 mb-0" style={{ fontSize: '0.85rem' }}>
              Password
            </label>
            <Link to="/forgot-password" className="text-success text-decoration-none fw-semibold" style={{ fontSize: '0.8rem' }}>
              Forgot password?
            </Link>
          </div>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Lock size={17} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`form-control form-control-premium form-control-premium-success pe-5 ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn border-0 position-absolute end-0 top-0 h-100 px-3 d-flex align-items-center text-muted"
              style={{ background: 'transparent' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.password.message}</div>
          )}
        </div>

        {/* Remember me removed as requested */}

        <button type="submit" disabled={loading} className="btn btn-premium btn-premium-success w-100 py-2.5 mb-3 d-flex align-items-center justify-content-center gap-2">

          {loading ? (
            <>
              <Loader2 size={18} className="spinner-border spinner-border-sm animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          <span className="text-muted">New company? </span>
          <Link to="/recruiter/signup" className="text-success fw-semibold text-decoration-none">
            Register Recruiter Account
          </Link>
        </div>
      </form>
    </motion.div>
  );
}



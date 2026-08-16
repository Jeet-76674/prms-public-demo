import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Eye, EyeOff, Loader2, Mail } from 'lucide-react';

export default function VcLogin() {
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
    setValue('email', 'vc.demo@indus.edu');
    setValue('password', 'Demo@1234');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password, 'VC');
    setLoading(false);
    if (result.success) {
      navigate('/dashboard/vc');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="auth-card p-4 p-sm-5"
      style={{ borderTop: '4px solid #0F172A' }}
    >
      <div className="text-center mb-4">
        <div 
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-xs" 
          style={{ width: '54px', height: '54px', backgroundColor: '#0F172A', color: '#FFFFFF' }}
        >
          <Shield size={26} />
        </div>
        <h3 className="fw-bold text-slate-900 mb-1.5" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
          Vice Chancellor Sign In
        </h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.875rem' }}>
          Highest administrative authority portal
        </p>

        {isDemoMode && (
          <div className="mt-3">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="btn btn-sm rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center gap-1.5 text-white"
              style={{ fontSize: '0.78rem', backgroundColor: '#0F172A', border: '1px solid #334155' }}
            >
              <span>Auto-Fill Demo: vc.demo@indus.edu</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Email Field */}
        <div className="mb-3.5">
          <label className="form-label fw-semibold text-slate-700 mb-1.5" style={{ fontSize: '0.85rem' }}>
            VC Official Email
          </label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Mail size={17} />
            </span>
            <input
              type="email"
              placeholder="vc@indus.edu"
              className={`form-control form-control-premium ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'Official VC email is required',
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
            <Link to="/forgot-password" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.8rem' }}>
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
              className={`form-control form-control-premium pe-5 ${errors.password ? 'is-invalid' : ''}`}
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

        {/* Remember me */}
        <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '0.85rem' }}>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="vcRememberMe" style={{ cursor: 'pointer' }} />
            <label className="form-check-label text-secondary fw-medium" htmlFor="vcRememberMe" style={{ cursor: 'pointer', userSelect: 'none' }}>
              Remember this device
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="btn btn-dark w-100 py-2.5 mb-3 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
          style={{ backgroundColor: '#0F172A', borderRadius: '8px' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spinner-border spinner-border-sm animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Vice Chancellor Sign In</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function TpoLogin() {
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
    setValue('email', 'tpo.demo@indus.edu');
    setValue('password', 'Demo@1234');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password, 'TPO');
    setLoading(false);
    if (result.success) {
      navigate('/dashboard/tpo');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="auth-card card-top-accent-tpo p-4 p-sm-5"
    >
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-purple-100 text-purple-600 rounded-circle mb-3" style={{ width: '54px', height: '54px', backgroundColor: '#F3E8FF', color: '#7C3AED' }}>
          <Mail size={26} />
        </div>
        <h3 className="fw-bold text-slate-900 mb-1.5" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>TPO Sign In</h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.875rem' }}>
          Placement cell administration portal
        </p>

        {isDemoMode && (
          <div className="mt-3">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="btn btn-sm rounded-pill px-3 py-1 fw-medium d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: '0.78rem', backgroundColor: '#F3E8FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}
            >
              <span>Auto-Fill Demo: tpo.demo@indus.edu</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Email Field */}
        <div className="mb-3.5">
          <label className="form-label fw-semibold text-slate-700 mb-1.5" style={{ fontSize: '0.85rem' }}>
            TPO Email Address
          </label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Mail size={17} />
            </span>
            <input
              type="email"
              placeholder="tpo@university.edu"
              className={`form-control form-control-premium ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'College email is required',
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
            <input className="form-check-input" type="checkbox" id="tpoRememberMe" style={{ cursor: 'pointer' }} />
            <label className="form-check-label text-secondary fw-medium" htmlFor="tpoRememberMe" style={{ cursor: 'pointer', userSelect: 'none' }}>
              Remember my device
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-premium btn-premium-tpo w-100 py-2.5 mb-3 d-flex align-items-center justify-content-center gap-2">
          {loading ? (
            <>
              <Loader2 size={18} className="spinner-border spinner-border-sm animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Admin Sign In</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}



import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { Loader2, Building, User, Mail, Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function RecruiterSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '+91 '
    }
  });

  const password = watch('password', '');

  const checkPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'No password', color: 'text-muted' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, text: 'Weak', color: 'text-danger', barColor: 'bg-danger' };
    if (score === 2 || score === 3) return { score, text: 'Good', color: 'text-warning', barColor: 'bg-warning' };
    return { score, text: 'Strong', color: 'text-success', barColor: 'bg-success' };
  };

  const strength = checkPasswordStrength(password);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const phoneDigits = data.phone.replace(/\D/g, '').slice(-10);
      const payload = {
        firstName: data.companyName,
        lastName: data.hrName,
        email: data.email,
        phoneNumber: phoneDigits,
        password: data.password
      };
      await authService.sendOtp(payload, 'RECRUITER');
      toast.success('Validation OTP sent to your mailbox.');
      
      sessionStorage.setItem('prms_pending_signup', JSON.stringify({
        signupData: payload,
        role: 'recruiter'
      }));
      
      navigate('/otp', { state: { email: data.email, role: 'recruiter' } });
    } catch (err) {
      toast.error('Could not initiate signup. Please try again.');
    } finally {
      setLoading(false);
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
        <h3 className="fw-bold text-slate-900 mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Recruiter Portal Signup</h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.875rem' }}>
          Connect with the university placement office
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Company Name */}
        <div className="mb-3">
          <label className="form-label text-slate-700 fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Company / Corporate Name</label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Building size={16} />
            </span>
            <input
              type="text"
              placeholder="Stripe, Inc."
              className={`form-control form-control-premium form-control-premium-success ${errors.companyName ? 'is-invalid' : ''}`}
              {...register('companyName', { required: 'Company name is required' })}
            />
          </div>
          {errors.companyName && <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.companyName.message}</div>}
        </div>

        {/* HR Lead Name */}
        <div className="mb-3">
          <label className="form-label text-slate-700 fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>HR Lead Name</label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <User size={16} />
            </span>
            <input
              type="text"
              placeholder="Sarah Jenkins"
              className={`form-control form-control-premium form-control-premium-success ${errors.hrName ? 'is-invalid' : ''}`}
              {...register('hrName', { required: 'HR Contact name is required' })}
            />
          </div>
          {errors.hrName && <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.hrName.message}</div>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label text-slate-700 fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Work Email</label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="hr@stripe.com"
              autoComplete="username"
              className={`form-control form-control-premium form-control-premium-success ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid address' }
              })}
            />
          </div>
          {errors.email && <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.email.message}</div>}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label text-slate-700 fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>HR Desk Phone</label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Phone size={16} />
            </span>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className={`form-control form-control-premium form-control-premium-success ${errors.phone ? 'is-invalid' : ''}`}
              {...register('phone', { required: 'Phone is required' })}
            />
          </div>
          {errors.phone && <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.phone.message}</div>}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label text-slate-700 fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Secret Password</label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Lock size={16} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`form-control form-control-premium form-control-premium-success pe-5 ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 chars' }
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
          {errors.password && <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.password.message}</div>}

          {password && (
            <div className="mt-2" style={{ fontSize: '0.75rem' }}>
              <div className="d-flex justify-content-between mb-1 text-secondary">
                <span>Strength:</span>
                <span className={`fw-bold ${strength.color}`}>{strength.text}</span>
              </div>
              <div className="progress bg-slate-100" style={{ height: '5px', borderRadius: '10px' }}>
                <div
                  className={`progress-bar ${strength.barColor}`}
                  role="progressbar"
                  style={{ width: `${(strength.score / 4) * 100}%`, borderRadius: '10px', transition: 'width 0.3s ease' }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="form-label text-slate-700 fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Confirm Password</label>
          <div className="form-input-container">
            <span className="form-input-icon">
              <Lock size={16} />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`form-control form-control-premium form-control-premium-success pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...register('confirmPassword', {
                required: 'Confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="btn border-0 position-absolute end-0 top-0 h-100 px-3 d-flex align-items-center text-muted"
              style={{ background: 'transparent' }}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="invalid-feedback d-block mt-1" style={{ fontSize: '0.8rem' }}>{errors.confirmPassword.message}</div>}
        </div>


        <button type="submit" disabled={loading} className="btn btn-premium btn-premium-success w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
          {loading ? (
            <>
              <Loader2 size={18} className="spinner-border spinner-border-sm animate-spin" />
              <span>Sending Security OTP...</span>
            </>
          ) : (
            <span>Send Validation OTP</span>
          )}
        </button>

        <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
          <span className="text-muted">Already registered? </span>
          <Link to="/recruiter/login" className="text-success fw-semibold text-decoration-none">
            Sign In
          </Link>
        </div>
      </form>
    </motion.div>
  );
}



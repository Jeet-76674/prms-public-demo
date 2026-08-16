import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { KeyRound, Timer, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const email = location.state?.email || sessionStorage.getItem('user_email') || 'candidate@university.edu';
  const role = location.state?.role || sessionStorage.getItem('role') || 'student';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes (300 seconds)
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // Timer effect
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move next
    if (value !== '' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace handles previous box focus
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length !== 6 || isNaN(pastedData)) {
      toast.error('Please paste a valid 6-digit number');
      return;
    }

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputsRef.current[5].focus();
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const pendingSignup = sessionStorage.getItem('prms_pending_signup');
      if (pendingSignup) {
        const { signupData, role: signupRole } = JSON.parse(pendingSignup);
        await authService.sendOtp(signupData, signupRole.toUpperCase());
      } else {
        await authService.sendOtp({ email }, role.toUpperCase());
      }
      setTimer(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0].focus();
      toast.success('A fresh OTP code was dispatched.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const pendingSignup = sessionStorage.getItem('prms_pending_signup');
      if (pendingSignup) {
        const { signupData, role: signupRole } = JSON.parse(pendingSignup);
        
        if (signupData.phoneNumber || signupData.phone) {
          sessionStorage.setItem('user_phone', signupData.phoneNumber || signupData.phone);
        }
        if (signupData.firstName) {
          sessionStorage.setItem('user_company_name', signupData.firstName);
        }
        if (signupData.lastName) {
          sessionStorage.setItem('user_hr_name', signupData.lastName);
        }
        if (signupData.email) {
          sessionStorage.setItem('user_email', signupData.email);
        }
        
        // Ensure OTP is passed to the signup payload
        const fullSignupData = { ...signupData, otp: fullOtp };
        
        // 1. Actually register the user (backend will verify and delete OTP)
        const signupResult = await signup(fullSignupData, signupRole);
        
        if (!signupResult.success) {
          return;
        }
        
        sessionStorage.removeItem('prms_pending_signup');
        toast.success('Account created and email verified successfully!', { id: 'otp-success-toast' });

        // Finalize state in db or fallback simulation
        const isStudent = signupRole === 'student';
        if (isStudent) {
          sessionStorage.setItem('student_profile_completed', 'false');
          navigate('/student/profile');
        } else {
          sessionStorage.setItem('recruiter_profile_completed', 'false');
          navigate('/recruiter/profile');
        }
      } else {
        // Fallback for simple verification
        await authService.verifyOtp(email, fullOtp);
        toast.success('Email validated successfully!', { id: 'otp-success-toast' });
        navigate(role === 'student' ? '/dashboard/student' : '/dashboard/recruiter');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification code invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card shadow-lg p-4 border-light text-center"
      style={{ borderRadius: '16px' }}
    >
      <div className="d-inline-flex bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3 mx-auto">
        <KeyRound size={32} />
      </div>

      <h3 className="fw-bold text-gradient mb-2">Two-Factor Security</h3>
      <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>
        We sent a 6-digit verification code to <span className="fw-semibold text-dark">{email}</span>.
      </p>

      <form onSubmit={handleVerify}>
        {/* OTP Inputs group */}
        <div className="d-flex justify-content-center gap-2 mb-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-box"
              required
            />
          ))}
        </div>

        {/* Timer */}
        <div className="d-flex align-items-center justify-content-center gap-1.5 mb-4 text-muted" style={{ fontSize: '0.9rem' }}>
          <Timer size={16} />
          <span>Code expires in: </span>
          <span className={`fw-bold ${timer < 60 ? 'text-danger' : 'text-primary'}`}>
            {formatTime(timer)}
          </span>
        </div>

        {/* Actions */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-2.5 mb-3 fw-bold shadow-sm"
        >
          {loading ? 'Processing Validation...' : 'Confirm Verification Code'}
        </button>

        <div className="text-center" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">Didn't receive the email? </span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="btn btn-link p-0 text-primary fw-semibold text-decoration-none d-inline-flex align-items-center gap-1"
            >
              <RefreshCw size={12} /> Resend OTP
            </button>
          ) : (
            <span className="text-muted fw-semibold">
              Resend in {formatTime(timer)}
            </span>
          )}
        </div>
      </form>
    </motion.div>
  );
}

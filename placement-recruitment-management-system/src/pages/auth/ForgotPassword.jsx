import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Key, CheckCircle, ArrowRight, Loader2, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import api from '../../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.sendForgotPasswordOtp({ email: formData.email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOtp(formData.email, formData.otp);
      toast.success('OTP verified successfully');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      toast.success('Password reset successfully. Please login.');
      navigate('/select-role');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="auth-card"
    >
      <div className="floating-card-header text-white text-center" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
        <h3 className="fw-bold m-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.025em' }}>Reset Password</h3>
        <p className="text-white text-opacity-75 mb-0 mt-1" style={{ fontSize: '0.85rem' }}>
          Follow the steps to recover your account
        </p>
      </div>

      <div className="p-4">
        {step === 1 && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="form-label text-sm fw-medium text-secondary">Email Address</label>
              <div className="form-input-container">
                <span className="form-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control form-control-premium"
                  placeholder="Enter your registered email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-premium btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="spinner-border spinner-border-sm animate-spin" style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <span>Send OTP</span>
              )}
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="form-label text-sm fw-medium text-secondary">Enter OTP</label>
              <div className="form-input-container">
                <span className="form-input-icon">
                  <Key size={16} />
                </span>
                <input
                  type="text"
                  className="form-control form-control-premium text-center fw-bold"
                  placeholder="• • • • • •"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
              </div>
              <div className="form-text mt-2 text-center text-xs text-muted">
                Check your email inbox and spam folder for the OTP.
              </div>
            </div>
            <button type="submit" className="btn btn-premium btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="spinner-border spinner-border-sm animate-spin" style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <span>Verify OTP</span>
              )}
            </button>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label text-sm fw-medium text-secondary">New Password</label>
              <div className="form-input-container">
                <span className="form-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control form-control-premium"
                  placeholder="Create new password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label text-sm fw-medium text-secondary">Confirm Password</label>
              <div className="form-input-container">
                <span className="form-input-icon">
                  <CheckCircle size={16} />
                </span>
                <input
                  type="password"
                  className="form-control form-control-premium"
                  placeholder="Confirm new password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-premium btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="spinner-border spinner-border-sm animate-spin" style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </motion.form>
        )}

        <div className="text-center mt-4 pt-3 border-top">
          <Link to="/select-role" className="btn-back px-3.5 py-1.5 rounded-pill text-sm">
            <ArrowLeft size={16} className="text-primary" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

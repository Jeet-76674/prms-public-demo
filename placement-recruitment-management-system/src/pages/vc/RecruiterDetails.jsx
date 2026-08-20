import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { vcService } from '../../services/vcService';
import toast from 'react-hot-toast';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  Info,
  Linkedin,
  Users,
  PowerOff,
  Clock,
  Briefcase,
  ChevronRight
} from 'lucide-react';

export default function VcRecruiterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    loadRecruiter();
  }, [id]);

  const loadRecruiter = async () => {
    try {
      const [data, jobsData] = await Promise.all([
        vcService.getRecruiterById(id),
        vcService.getRecruiterJobs(id)
      ]);
      setRecruiter(data);
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load recruiter details', err);
      toast.error('Recruiter not found');
      navigate('/vc/recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const res = await vcService.approveRecruiter(id);
      toast.success('Company approved and activated successfully');
      setRecruiter(prev => ({
        ...prev,
        ...res,
        verified: true,
        accountStatus: 'ACTIVE'
      }));
    } catch (err) {
      toast.error('Failed to approve company');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const res = await vcService.rejectRecruiter(id);
      toast.success('Company rejected successfully');
      setShowRejectDialog(false);
      setRecruiter(prev => ({
        ...prev,
        ...res,
        verified: false,
        accountStatus: 'REJECTED'
      }));
    } catch (err) {
      toast.error('Failed to reject company');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setProcessing(true);
    try {
      const res = await vcService.updateRecruiterStatus(id, status);
      toast.success(`Company status updated to ${status}`);
      setRecruiter(prev => ({
        ...prev,
        ...res,
        verified: status === 'ACTIVE',
        accountStatus: status
      }));
    } catch (err) {
      toast.error('Failed to update company status');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2" style={{ fontSize: '0.8rem' }}><CheckCircle size={14} className="me-1" /> ACTIVE & VERIFIED</span>;
      case 'PENDING':
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-2" style={{ fontSize: '0.8rem' }}><Clock size={14} className="me-1" /> PENDING VC APPROVAL</span>;
      case 'INACTIVE':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2" style={{ fontSize: '0.8rem' }}><PowerOff size={14} className="me-1" /> INACTIVE</span>;
      case 'REJECTED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2" style={{ fontSize: '0.8rem' }}><XCircle size={14} className="me-1" /> REJECTED</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Loading company details...</h6>
      </div>
    );
  }

  if (!recruiter) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="container-fluid p-0">
      {/* Back Button */}
      <Link
        to="/vc/recruiters"
        className="btn-back mb-4"
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Company Directory</span>
      </Link>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 bg-white shadow-sm p-4 text-center h-100" style={{ borderRadius: '12px' }}>
            <div className="mb-4">
              <div className="bg-light rounded-3 d-inline-flex align-items-center justify-content-center text-primary border mx-auto" style={{ width: '110px', height: '110px', backgroundColor: '#EFF6FF' }}>
                <Building2 size={44} />
              </div>
            </div>
            
            <h4 className="fw-bold text-dark mb-1">{recruiter.companyName}</h4>
            <p className="text-muted text-sm mb-3">{recruiter.industry || 'Industry not specified'}</p>
            
            <div className="mb-4">
              {getStatusBadge(recruiter.accountStatus || (recruiter.verified ? 'ACTIVE' : 'PENDING'))}
            </div>

            <div className="d-flex flex-column gap-2 text-start pt-3 border-top">
              <div className="d-flex align-items-center gap-3 text-secondary text-sm">
                <Globe size={16} />
                <a href={recruiter.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none text-truncate">
                  {recruiter.website || 'No website'}
                </a>
              </div>
              <div className="d-flex align-items-center gap-3 text-secondary text-sm">
                <MapPin size={16} />
                <span className="text-truncate">{recruiter.headOffice || 'No location'}</span>
              </div>
              <div className="d-flex align-items-center gap-3 text-secondary text-sm">
                <Users size={16} />
                <span>Size: {recruiter.companySize || 'N/A'}</span>
              </div>
              {recruiter.linkedin && (
                <div className="d-flex align-items-center gap-3 text-secondary text-sm mt-1">
                  <Linkedin size={16} className="text-primary" />
                  <a href={recruiter.linkedin} target="_blank" rel="noreferrer" className="text-primary text-decoration-none text-truncate">
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold text-secondary mb-3">About the Company</h5>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              {recruiter.companyDescription || 'No description provided by the recruiter.'}
            </p>
          </div>

          <div className="card border-0 bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold text-secondary mb-4">HR Contact Information</h5>
            
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle mt-1">
                    <Info size={18} />
                  </div>
                  <div>
                    <span className="d-block text-muted text-xs fw-semibold mb-1">HR NAME</span>
                    <span className="fw-medium text-dark">{recruiter.hrName}</span>
                    <span className="d-block text-muted text-xs mt-1">{recruiter.hrDesignation}</span>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle mt-1">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="d-block text-muted text-xs fw-semibold mb-1">EMAIL ADDRESS</span>
                    <span className="fw-medium text-dark">{recruiter.companyEmail}</span>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle mt-1">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="d-block text-muted text-xs fw-semibold mb-1">PHONE NUMBER</span>
                    <span className="fw-medium text-dark">{recruiter.companyPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VC Executive Action Area */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0 !important' }}>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">Vice Chancellor Decision</h5>
                <p className="text-muted text-xs mb-0">
                  Approve, reject, or suspend this company's platform access.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {(recruiter.accountStatus === 'PENDING' || (!recruiter.accountStatus && !recruiter.verified)) && (
                  <>
                    <button 
                      onClick={() => setShowRejectDialog(true)}
                      disabled={processing}
                      className="btn btn-outline-danger px-4 fw-semibold" 
                      style={{ borderRadius: '8px' }}
                    >
                      Reject Company
                    </button>
                    <button 
                      onClick={handleApprove}
                      disabled={processing}
                      className="btn btn-success text-white px-4 d-flex align-items-center gap-2 fw-semibold" 
                      style={{ backgroundColor: '#22C55E', borderRadius: '8px' }}
                    >
                      {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      <span>Approve & Activate</span>
                    </button>
                  </>
                )}
                {(recruiter.accountStatus === 'ACTIVE' || recruiter.verified === true) && (
                  <button 
                    onClick={() => handleUpdateStatus('INACTIVE')}
                    disabled={processing}
                    className="btn btn-outline-warning text-dark px-4 d-flex align-items-center gap-2 fw-semibold" 
                    style={{ borderRadius: '8px' }}
                  >
                    {processing ? <Loader2 size={16} className="animate-spin" /> : <PowerOff size={16} />}
                    <span>Deactivate Company</span>
                  </button>
                )}
                {(recruiter.accountStatus === 'INACTIVE' || recruiter.accountStatus === 'REJECTED') && (
                  <button 
                    onClick={handleApprove}
                    disabled={processing}
                    className="btn btn-success text-white px-4 d-flex align-items-center gap-2 fw-semibold" 
                    style={{ backgroundColor: '#22C55E', borderRadius: '8px' }}
                  >
                    {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    <span>Activate Company</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Jobs Posted Section */}
          <div className="card border-0 bg-white shadow-sm mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-slate-800 d-flex align-items-center gap-2">
                <Briefcase size={20} className="text-primary" />
                Jobs Posted ({jobs.length})
              </h5>
            </div>
            <div className="card-body p-0">
              {jobs.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted mb-0 small">This recruiter hasn't posted any jobs yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-uppercase text-slate-500 fw-semibold py-3 ps-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Job Role</th>
                        <th className="text-uppercase text-slate-500 fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => (
                        <tr key={job.id}>
                          <td className="ps-4 py-3 fw-medium text-slate-800">{job.title}</td>
                          <td className="py-3">
                            <span className={`badge ${job.status === 'OPEN' ? 'bg-success' : 'bg-secondary'} bg-opacity-10 ${job.status === 'OPEN' ? 'text-success' : 'text-secondary'} px-2 py-1 rounded`}>
                              {job.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      {showRejectDialog && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header bg-danger text-white py-3 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <XCircle size={20} />
                  <span>Reject Recruiter Registration?</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowRejectDialog(false)}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <p className="text-secondary mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Are you sure you want to reject this company? The recruiter will be notified and prevented from accessing placement drives.
                </p>
              </div>
              <div className="modal-footer bg-light py-3 border-0">
                <button type="button" className="btn btn-light shadow-sm" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </button>
                <button type="button" disabled={processing} className="btn btn-danger px-4 shadow-sm" onClick={handleReject}>
                  {processing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

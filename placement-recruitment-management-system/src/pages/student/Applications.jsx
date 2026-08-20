import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import api from '../../services/api';
import Pagination from '../../components/Pagination';
import { FolderClosed, Calendar, FileText, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolvePdfUrl } from '../../utils/pdfHelper';

export default function StudentApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const baseURL = api.defaults.baseURL || 'http://localhost:8080';

  // Modal targets
  const [withdrawTargetId, setWithdrawTargetId] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [coverLetterTarget, setCoverLetterTarget] = useState(null);
  const [interviewDetailsTarget, setInterviewDetailsTarget] = useState(null);
  const [offerDetailsTarget, setOfferDetailsTarget] = useState(null);
  const [processingOffer, setProcessingOffer] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    try {
      const data = await studentService.getApplications({ page, size: 10 });
      setApplications(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load candidate applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawClick = (id) => {
    setWithdrawTargetId(id);
  };

  const confirmWithdraw = async () => {
    if (!withdrawTargetId) return;
    setWithdrawing(true);
    try {
      await studentService.withdrawApplication(withdrawTargetId);
      toast.success('Application successfully withdrawn');
      setApplications(
        applications.map(app => app.applicationId === withdrawTargetId ? { ...app, applicationStatus: 'WITHDRAWN' } : app)
      );
      setWithdrawTargetId(null);
    } catch (err) {
      toast.error('Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED': return { bgClass: 'bg-primary bg-opacity-10 text-primary border-primary', text: 'Applied', color: '#3B82F6' };
      case 'UNDER_REVIEW': return { bgClass: 'bg-warning bg-opacity-10 text-warning border-warning', text: 'Under Review', color: '#EAB308' };
      case 'SHORTLISTED': return { bgClass: 'bg-purple-100 text-purple-700', text: 'Shortlisted', color: '#9333EA', customStyle: { backgroundColor: '#F3E8FF', color: '#9333EA', border: '1px solid #D8B4FE' } };
      case 'INTERVIEW_SCHEDULED': return { bgClass: 'bg-orange-100 text-orange-700', text: 'Interview Scheduled', color: '#F97316', customStyle: { backgroundColor: '#FFEDD5', color: '#C2410C', border: '1px solid #FDBA74' } };
      case 'SELECTED': return { bgClass: 'bg-success bg-opacity-10 text-success border-success', text: 'Offer Pending', color: '#22C55E' };
      case 'OFFER_ACCEPTED': return { bgClass: 'bg-success text-white border-success', text: 'Offer Accepted', color: '#16A34A', customStyle: { backgroundColor: '#16A34A', color: 'white', border: '1px solid #15803D' } };
      case 'OFFER_REJECTED': return { bgClass: 'bg-danger text-white border-danger', text: 'Offer Declined', color: '#DC2626', customStyle: { backgroundColor: '#DC2626', color: 'white', border: '1px solid #B91C1C' } };
      case 'REJECTED': return { bgClass: 'bg-danger bg-opacity-10 text-danger border-danger', text: 'Rejected', color: '#EF4444' };
      case 'WITHDRAWN': return { bgClass: 'bg-secondary bg-opacity-10 text-secondary border-secondary', text: 'Withdrawn', color: '#6B7280' };
      default: return { bgClass: 'bg-light text-dark border-secondary', text: status, color: '#000' };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      
      {/* Title Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1 text-slate-900" style={{ letterSpacing: '-0.02em' }}>My Pipeline</h3>
        <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
          Track open interview pipelines, review submission cover letters, and manage active status parameters.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card p-5 border-0 text-center bg-white shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
            <FolderClosed size={40} />
          </div>
          <h5 className="fw-bold">No Applications Registered</h5>
          <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
            You haven't applied to any corporate listings yet. Explore verified listings and apply with your uploaded transcript.
          </p>
          <Link to="/student/jobs" className="btn btn-primary px-4 shadow-sm mx-auto">Browse Openings</Link>
        </div>
      ) : (
        <div className="row g-3 text-start">
          {applications.map((app) => {
            const statusInfo = getStatusBadge(app.applicationStatus);
            const canWithdraw = app.applicationStatus === 'APPLIED' || app.applicationStatus === 'UNDER_REVIEW';

            return (
              <div key={app.applicationId} className="col-12">
                <div 
                  onClick={(e) => {
                    if (!e.target.closest('button, a, .cursor-pointer')) {
                      navigate(`/student/jobs/${app.jobId}`);
                    }
                  }}
                  className="card p-3 px-4 border bg-white shadow-xs card-hover transition-all position-relative" 
                  style={{ borderRadius: '14px', cursor: 'pointer', borderColor: '#E2E8F0' }}
                  title="Click to view role requirements and job details"
                >
                  
                  {/* Status header row */}
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={15} className="text-muted" />
                      <span className="text-secondary text-xs">Applied on: <strong>{new Date(app.appliedAt).toLocaleDateString()}</strong></span>
                    </div>
                    <span 
                      className={`badge border ${statusInfo.bgClass} px-2.5 py-1 fw-semibold`} 
                      style={statusInfo.customStyle || (statusInfo.color ? { color: statusInfo.color, borderColor: statusInfo.color } : {})}
                    >
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Body Info row */}
                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-7">
                      <Link to={`/student/jobs/${app.jobId}`} className="text-decoration-none" onClick={(e) => e.stopPropagation()}>
                        <h5 className="fw-bold text-slate-900 mb-1 card-hover-text" style={{ fontSize: '1.05rem', letterSpacing: '-0.01em' }}>{app.jobTitle}</h5>
                      </Link>
                      
                      {/* Attachments details list */}
                      <div className="d-flex flex-wrap gap-3 mt-2 text-muted" style={{ fontSize: '0.825rem' }}>
                        <a 
                          href={resolvePdfUrl(app.resumeUrl, 'resume')} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="d-flex align-items-center gap-1.5 text-decoration-none cursor-pointer text-secondary hover-text-primary fw-medium"
                        >
                          <FileText size={15} className="text-primary" />
                          <span>View Resume</span>
                        </a>
                        {app.coverLetter ? (
                          <span 
                            className="d-flex align-items-center gap-1.5 cursor-pointer text-secondary hover-text-primary fw-medium" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCoverLetterTarget(app.coverLetter);
                            }} 
                            style={{ cursor: 'pointer' }}
                          >
                            <Eye size={15} className="text-primary" />
                            <span>View Cover Letter</span>
                          </span>
                        ) : (
                          <span className="d-flex align-items-center gap-1 text-muted">
                            <Eye size={15} /> No Cover Letter
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timeline visualization */}
                    <div className="col-12 col-md-4 text-md-end d-flex flex-column justify-content-between">
                      <div className="mb-3">
                        <div className="text-muted text-xs mb-2 fw-semibold">PIPELINE PROGRESSION</div>
                        {/* Progressive line graph representation */}
                        <div className="progress mb-2 bg-light" style={{ height: '6px', borderRadius: '4px' }}>
                          <div
                            className={`progress-bar ${
                              (app.applicationStatus === 'SELECTED' || app.applicationStatus === 'OFFER_ACCEPTED') ? 'bg-success' : (app.applicationStatus === 'REJECTED' || app.applicationStatus === 'OFFER_REJECTED') ? 'bg-danger' : app.applicationStatus === 'WITHDRAWN' ? 'bg-secondary' : 'bg-primary'
                            }`}
                            style={{
                              width:
                                (app.applicationStatus === 'SELECTED' || app.applicationStatus === 'OFFER_ACCEPTED')
                                  ? '100%'
                                  : app.applicationStatus === 'SHORTLISTED' || app.applicationStatus === 'INTERVIEW_SCHEDULED'
                                  ? '75%'
                                  : app.applicationStatus === 'UNDER_REVIEW'
                                  ? '50%'
                                  : app.applicationStatus === 'WITHDRAWN'
                                  ? '100%'
                                  : '25%'
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Withdraw Action button */}
                      {canWithdraw && (
                        <button
                          onClick={() => handleWithdrawClick(app.applicationId)}
                          className="btn btn-outline-danger btn-sm px-3.5 align-self-md-end shadow-sm"
                          style={{ borderRadius: '6px' }}
                        >
                          Withdraw Submission
                        </button>
                      )}

                      {/* Interview details button */}
                      {app.applicationStatus === 'INTERVIEW_SCHEDULED' && (
                        <button
                          onClick={() => setInterviewDetailsTarget(app)}
                          className="btn btn-primary btn-sm px-3.5 align-self-md-end shadow-sm mt-2"
                          style={{ borderRadius: '6px' }}
                        >
                          <Calendar size={14} className="me-1" /> View Interview Details
                        </button>
                      )}

                      {/* Offer details button */}
                      {app.applicationStatus === 'SELECTED' && (
                        <button
                          onClick={() => setOfferDetailsTarget(app)}
                          className="btn btn-success btn-sm px-3.5 align-self-md-end shadow-sm mt-2 fw-medium"
                          style={{ borderRadius: '6px' }}
                        >
                          <FileText size={14} className="me-1" /> View Offer Details
                        </button>
                      )}

                      {/* Accepted/Rejected indicators */}
                      {app.applicationStatus === 'OFFER_ACCEPTED' && (
                        <div className="text-success text-sm fw-bold align-self-md-end mt-2 d-flex align-items-center gap-1">
                          <AlertTriangle size={14} /> Offer Accepted
                        </div>
                      )}
                      {app.applicationStatus === 'OFFER_REJECTED' && (
                        <div className="text-danger text-sm fw-bold align-self-md-end mt-2 d-flex align-items-center gap-1">
                          <AlertTriangle size={14} /> Offer Declined
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!loading && applications.length > 0 && (
        <div className="mt-4">
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            totalElements={totalElements} 
            size={10} 
            setPage={setPage} 
          />
        </div>
      )}

      {/* Handlers for offer actions */}
      {(() => {
        const handleAcceptOffer = async (id) => {
          setProcessingOffer(true);
          try {
            await studentService.acceptOffer(id);
            toast.success('Congratulations! Offer Accepted.');
            setApplications(applications.map(app => app.applicationId === id ? { ...app, applicationStatus: 'OFFER_ACCEPTED' } : app));
            setOfferDetailsTarget(null);
          } catch (err) {
            toast.error('Failed to accept offer');
          } finally {
            setProcessingOffer(false);
          }
        };

        const handleRejectOffer = async (id) => {
          setProcessingOffer(true);
          try {
            await studentService.rejectOffer(id);
            toast.success('Offer successfully declined.');
            setApplications(applications.map(app => app.applicationId === id ? { ...app, applicationStatus: 'OFFER_REJECTED' } : app));
            setOfferDetailsTarget(null);
          } catch (err) {
            toast.error('Failed to decline offer');
          } finally {
            setProcessingOffer(false);
          }
        };

        return (
          <>
            {/* Withdraw confirmation Modal */}
      {withdrawTargetId && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header bg-danger text-white py-3 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <AlertTriangle size={20} />
                  <span>Withdraw Application?</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setWithdrawTargetId(null)}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <p className="text-secondary mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Are you absolutely sure you want to withdraw this active application? This action is irreversible, and recruiters will be flagged immediately.
                </p>
              </div>
              <div className="modal-footer bg-light py-3 border-0">
                <button type="button" className="btn btn-light shadow-sm" onClick={() => setWithdrawTargetId(null)}>
                  Keep active
                </button>
                <button type="button" disabled={withdrawing} className="btn btn-danger px-4 shadow-sm" onClick={handleWithdrawConfirm}>
                  {withdrawing ? <Loader2 size={16} className="spinner" /> : 'Withdraw Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cover Letter Viewer Modal */}
      {coverLetterTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-light py-3 border-bottom border-light">
                <h5 className="modal-title fw-bold text-dark">Submission Cover Letter</h5>
                <button type="button" className="btn-close" onClick={() => setCoverLetterTarget(null)}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <div className="bg-light p-3 rounded-3 text-secondary border border-light" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {coverLetterTarget}
                </div>
              </div>
              <div className="modal-footer bg-light py-3 border-0">
                <button type="button" className="btn btn-secondary px-4 shadow-sm" onClick={() => setCoverLetterTarget(null)}>
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Details Modal */}
      {interviewDetailsTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-light py-3 border-bottom border-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Calendar size={20} className="text-primary"/> Interview Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setInterviewDetailsTarget(null)}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <div className="bg-light p-4 rounded-3 text-secondary border border-light">
                  <div className="mb-3">
                    <span className="text-muted d-block text-sm fw-medium mb-1">Company / Job</span>
                    <strong className="text-dark d-block">{interviewDetailsTarget.jobTitle}</strong>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <span className="text-muted d-block text-sm fw-medium mb-1">Date</span>
                      <strong className="text-dark">{interviewDetailsTarget.interviewDate || 'Not specified'}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block text-sm fw-medium mb-1">Time</span>
                      <strong className="text-dark">{interviewDetailsTarget.interviewTime || 'Not specified'}</strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-muted d-block text-sm fw-medium mb-1">Meeting Link / Location</span>
                    <strong className="text-dark d-block">{interviewDetailsTarget.interviewLink || 'Not specified'}</strong>
                  </div>
                  {interviewDetailsTarget.interviewInstructions && (
                    <div className="mt-4 border-top pt-3">
                      <span className="text-muted d-block text-sm fw-medium mb-2">Instructions from recruiter</span>
                      <div className="text-dark" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                        {interviewDetailsTarget.interviewInstructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer bg-light py-3 border-0">
                <button type="button" className="btn btn-primary px-4 shadow-sm" onClick={() => setInterviewDetailsTarget(null)}>
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Details Modal */}
      {offerDetailsTarget && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header bg-success text-white py-3 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <FileText size={20} /> Offer Details
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setOfferDetailsTarget(null)} disabled={processingOffer}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <div className="text-center mb-4">
                  <div className="d-inline-flex bg-success bg-opacity-10 text-success rounded-circle p-3 mb-3">
                    <Calendar size={32} />
                  </div>
                  <h4 className="fw-bold text-dark">Congratulations!</h4>
                  <p className="text-muted text-sm mb-0">You have been selected for <strong>{offerDetailsTarget.jobTitle}</strong>.</p>
                </div>
                <div className="bg-light p-3 rounded-3 text-secondary border border-light text-center">
                  <span className="text-muted d-block text-sm fw-medium mb-1">Expected Joining Date</span>
                  <strong className="text-dark d-block fs-5">{offerDetailsTarget.joiningDate || 'To be decided'}</strong>
                </div>
                <p className="text-muted text-sm mt-3 mb-0 text-center">
                  Please confirm your decision below.
                </p>
              </div>
              <div className="modal-footer bg-light py-3 border-0 d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-outline-danger px-4 shadow-sm" 
                  onClick={() => handleRejectOffer(offerDetailsTarget.applicationId)}
                  disabled={processingOffer}
                  style={{ borderRadius: '8px' }}
                >
                  Decline Offer
                </button>
                <button 
                  type="button" 
                  className="btn btn-success px-4 shadow-sm" 
                  onClick={() => handleAcceptOffer(offerDetailsTarget.applicationId)}
                  disabled={processingOffer}
                  style={{ borderRadius: '8px' }}
                >
                  {processingOffer ? <Loader2 size={16} className="spinner" /> : 'Accept Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          </>
        );
      })()}
    </motion.div>
  );
}

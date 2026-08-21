import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { recruiterService } from '../../services/recruiterService';
import api from '../../services/api';
import { ArrowLeft, Users, FileText, Eye, Loader2, Calendar, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';
import { resolvePdfUrl } from '../../utils/pdfHelper';
import { formatStudentName } from '../../utils/nameHelper';

export default function RecruiterApplicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);
  const [activeStageFilter, setActiveStageFilter] = useState('ALL');
  
  // Bulk scheduling state
  const [selectedApps, setSelectedApps] = useState(new Set());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingAppIds, setSchedulingAppIds] = useState(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', mode: 'ONLINE', link: '', instructions: '' });

  // Bulk selection confirm state
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectingAppIds, setSelectingAppIds] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selectionForm, setSelectionForm] = useState({ joiningDate: '' });

  const baseURL = api.defaults.baseURL || 'http://localhost:8080';

  const STATUS_HIERARCHY = ['OFFER_ACCEPTED', 'SELECTED', 'INTERVIEW_SCHEDULED', 'SHORTLISTED', 'UNDER_REVIEW', 'APPLIED', 'OFFER_REJECTED', 'REJECTED', 'WITHDRAWN'];

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const jobData = await recruiterService.getJobById(id);
        setJob(jobData);
        
        const applicantsData = await recruiterService.getJobApplications(id, { page, size: 50 }); // Increased size for better grouping view
        setApplicants(applicantsData.content || []);
        setTotalPages(applicantsData.totalPages || 0);
        setTotalElements(applicantsData.totalElements || 0);
      } catch (error) {
        toast.error('Failed to load applicant data');
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, [id, page]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (newStatus === 'APPLIED' || newStatus === 'WITHDRAWN') {
      toast.error('Cannot change status to ' + newStatus);
      return;
    }

    if (newStatus === 'SELECTED') {
      setSelectingAppIds([applicationId]);
      setShowSelectionModal(true);
      return;
    }

    try {
      await recruiterService.updateApplicationStatus(applicationId, newStatus);
      toast.success('Applicant status updated to ' + newStatus);
      
      setApplicants(prev => prev.map(app => 
        app.applicationId === applicationId ? { ...app, applicationStatus: newStatus } : app
      ));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleBulkStatusUpdate = async (status, appIds, joiningDate = null) => {
    try {
      setLoading(true);
      const payload = {
        applicationIds: Array.from(appIds),
        applicationStatus: status
      };
      
      if (joiningDate) {
        payload.joiningDate = joiningDate;
      }
      
      await recruiterService.updateBulkApplicationStatus(payload);
      toast.success(`Successfully updated ${appIds.length} candidates to ${status}`);
      
      const updatedAppIds = new Set(appIds);
      setApplicants(prev => prev.map(app => 
        updatedAppIds.has(app.applicationId) ? { ...app, applicationStatus: status } : app
      ));
      
      setSelectedApps(prev => {
        const next = new Set(prev);
        appIds.forEach(id => next.delete(id));
        return next;
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const confirmSelection = async (e) => {
    e.preventDefault();
    if (!selectingAppIds || selectingAppIds.length === 0) return;
    if (!selectionForm.joiningDate) {
      toast.error('Please provide a joining date');
      return;
    }

    setSelecting(true);
    try {
      await handleBulkStatusUpdate('SELECTED', selectingAppIds, selectionForm.joiningDate);
      setShowSelectionModal(false);
      setSelectingAppIds(null);
      setSelectionForm({ joiningDate: '' });
    } catch (err) {
      // Error handled by handleBulkStatusUpdate
    } finally {
      setSelecting(false);
    }
  };

  const handleBulkSchedule = async (e) => {
    e.preventDefault();
    if (!schedulingAppIds || schedulingAppIds.length === 0) return;
    
    setScheduling(true);
    try {
      const payload = {
        applicationIds: Array.from(schedulingAppIds),
        date: scheduleForm.date,
        time: scheduleForm.time,
        link: scheduleForm.link,
        instructions: scheduleForm.instructions
      };
      await recruiterService.scheduleBulkInterviews(payload);
      toast.success(`Successfully scheduled interviews for ${schedulingAppIds.length} candidates!`);
      
      const scheduledIds = new Set(schedulingAppIds);
      setApplicants(prev => prev.map(app => 
        scheduledIds.has(app.applicationId) ? { ...app, applicationStatus: 'INTERVIEW_SCHEDULED' } : app
      ));
      
      setShowScheduleModal(false);
      setSelectedApps(prev => {
         const next = new Set(prev);
         schedulingAppIds.forEach(id => next.delete(id));
         return next;
      });
      setSchedulingAppIds(null);
      setScheduleForm({ date: '', time: '', mode: 'ONLINE', link: '', instructions: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interviews');
    } finally {
      setScheduling(false);
    }
  };

  const toggleSelection = (appId) => {
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) newSet.delete(appId);
      else newSet.add(appId);
      return newSet;
    });
  };

  const toggleGroupAll = (groupApps) => {
    const allSelected = groupApps.every(app => selectedApps.has(app.applicationId));
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        groupApps.forEach(app => newSet.delete(app.applicationId));
      } else {
        groupApps.forEach(app => newSet.add(app.applicationId));
      }
      return newSet;
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-primary bg-opacity-10 text-primary border border-primary';
      case 'UNDER_REVIEW':
        return 'bg-warning bg-opacity-10 text-warning border border-warning';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-orange-100 text-orange-700 border border-orange-300';
      case 'SELECTED':
        return 'bg-success bg-opacity-10 text-success border border-success';
      case 'REJECTED':
        return 'bg-danger bg-opacity-10 text-danger border border-danger';
      case 'WITHDRAWN':
        return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
      default:
        return 'bg-light text-secondary border';
    }
  };

  const formatStatusName = (status) => {
    return status.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="spinner" size={32} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-4 text-start">
        <Link to="/recruiter/jobs" className="btn-back mb-4">
          <ArrowLeft size={18} className="text-primary" />
          <span>Back to Job Listings</span>
        </Link>
        <div className="card border-0 bg-white shadow-sm p-5 text-center my-4" style={{ borderRadius: '16px' }}>
          <Users className="text-muted mx-auto mb-3" size={48} />
          <h5 className="fw-bold text-slate-800">Job Opening Not Found</h5>
          <p className="text-muted mb-4">The requested job opening details or applicant pipeline could not be loaded.</p>
          <div>
            <Link to="/recruiter/jobs" className="btn btn-primary px-4 py-2 fw-semibold rounded-3 text-decoration-none">
              Back to Job Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Group applicants
  const groupedApplicants = STATUS_HIERARCHY.reduce((acc, status) => {
    const appsInStatus = applicants.filter(a => a.applicationStatus === status);
    if (appsInStatus.length > 0) acc[status] = appsInStatus;
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container py-4 text-start">
      
      {/* Back button */}
      <Link
        to="/recruiter/jobs"
        className="btn-back mb-4"
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Job Listings</span>
      </Link>

      {/* Header Info */}
      <div className="card border-0 mb-4 bg-white p-4 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h4 className="fw-bold text-dark mb-1">Applicants: {job?.title}</h4>
            <small className="text-muted" style={{ fontSize: '0.9rem' }}>Total submissions: <strong>{applicants.length}</strong> candidates</small>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <select 
              className="form-select border-light shadow-sm bg-light text-dark fw-medium" 
              style={{ minWidth: '180px', borderRadius: '8px' }}
              value={activeStageFilter}
              onChange={(e) => setActiveStageFilter(e.target.value)}
            >
              <option value="ALL">Show All Stages</option>
              {STATUS_HIERARCHY.map(status => (
                <option key={status} value={status}>{formatStatusName(status)}</option>
              ))}
            </select>
            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle d-flex align-items-center justify-content-center">
              <Users size={28} />
            </div>
          </div>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="card text-center p-5 border-0 bg-white shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
            <Users size={40} />
          </div>
          <h5 className="fw-bold">No Candidates Applied Yet</h5>
          <p className="text-muted text-xs mx-auto mb-0" style={{ maxWidth: '380px' }}>
            We haven't received any applications for this opening. Once students start applying, their academic dossiers will load here automatically.
          </p>
        </div>
      ) : (
        <>
          {STATUS_HIERARCHY.map(status => {
            if (activeStageFilter !== 'ALL' && status !== activeStageFilter) return null;

            const groupApps = groupedApplicants[status];
            if (!groupApps) return null;

            const isAllGroupSelected = groupApps.every(app => selectedApps.has(app.applicationId));
            const groupSelectedApps = groupApps.filter(app => selectedApps.has(app.applicationId));
            const groupSelectedIds = groupSelectedApps.map(app => app.applicationId);

            return (
              <div key={status} className="mb-5">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    {formatStatusName(status)}
                    <span className={`badge ${getStatusBadgeClass(status)}`} style={{ fontSize: '0.75rem' }}>
                      {groupApps.length}
                    </span>
                  </h5>
                  
                  {groupSelectedIds.length > 0 && (
                    <div className="dropdown">
                      <button className="btn btn-outline-primary btn-sm shadow-sm d-inline-flex align-items-center gap-2 px-3 dropdown-toggle" data-bs-toggle="dropdown">
                        Bulk Actions ({groupSelectedIds.length})
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" style={{ borderRadius: '12px', padding: '8px', zIndex: 1050 }}>
                        <li><button className="dropdown-item py-2" style={{ borderRadius: '6px' }} onClick={() => handleBulkStatusUpdate('UNDER_REVIEW', groupSelectedIds)}>Mark as Under Review</button></li>
                        <li><button className="dropdown-item py-2" style={{ borderRadius: '6px' }} onClick={() => handleBulkStatusUpdate('SHORTLISTED', groupSelectedIds)}>Mark as Shortlisted</button></li>
                        <li><button className="dropdown-item py-2 text-primary fw-medium d-flex align-items-center gap-2" style={{ borderRadius: '6px' }} onClick={() => { setSchedulingAppIds(groupSelectedIds); setShowScheduleModal(true); }}>
                          <Calendar size={14} /> Schedule Interviews...
                        </button></li>
                        <li><hr className="dropdown-divider my-2" /></li>
                        <li><button className="dropdown-item py-2 text-success fw-medium" style={{ borderRadius: '6px' }} onClick={() => { setSelectingAppIds(groupSelectedIds); setShowSelectionModal(true); }}>Mark as Selected</button></li>
                        <li><button className="dropdown-item py-2 text-danger fw-medium" style={{ borderRadius: '6px' }} onClick={() => handleBulkStatusUpdate('REJECTED', groupSelectedIds)}>Mark as Rejected</button></li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '16px' }}>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light text-secondary" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                        <tr>
                          <th className="px-4 py-3" style={{ width: '40px' }}>
                            <input 
                              type="checkbox" 
                              className="form-check-input cursor-pointer" 
                              checked={isAllGroupSelected} 
                              onChange={() => toggleGroupAll(groupApps)} 
                            />
                          </th>
                          <th className="py-3">STUDENT</th>
                          <th className="py-3">EMAIL</th>
                          <th className="py-3">RESUME</th>
                          <th className="py-3">APPLIED DATE</th>
                          <th className="py-3">STATUS</th>
                          <th className="px-4 py-3 text-end">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '0.9rem' }}>
                        {groupApps.map((app) => (
                          <tr key={app.applicationId} className={selectedApps.has(app.applicationId) ? 'bg-light' : ''}>
                            <td className="px-4 py-3">
                              <input 
                                type="checkbox" 
                                className="form-check-input cursor-pointer" 
                                checked={selectedApps.has(app.applicationId)} 
                                onChange={() => toggleSelection(app.applicationId)} 
                              />
                            </td>
                            <td className="py-3">
                              <div className="fw-bold text-dark">{formatStudentName(app.studentName, app.studentEmail)}</div>
                            </td>
                            <td className="text-muted">
                              {app.studentEmail}
                            </td>
                            <td>
                              <div className="d-flex flex-column gap-2">
                                {app.resumeUrl ? (
                                  <a
                                    href={resolvePdfUrl(app.resumeUrl, 'resume')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none text-primary fw-semibold d-inline-flex align-items-center gap-1 cursor-pointer"
                                    style={{ fontSize: '0.85rem' }}
                                  >
                                    <FileText size={16} /> Open PDF
                                  </a>
                                ) : (
                                  <span className="text-muted" style={{ fontSize: '0.85rem' }}><FileText size={16} /> No Resume</span>
                                )}
                                
                                {app.coverLetter ? (
                                  <span
                                    onClick={() => setActiveCoverLetter(app.coverLetter)}
                                    className="text-secondary fw-medium cursor-pointer d-inline-flex align-items-center gap-1"
                                    style={{ fontSize: '0.85rem', textDecoration: 'underline' }}
                                  >
                                    <Eye size={16} /> Cover Letter
                                  </span>
                                ) : (
                                  <span className="text-muted" style={{ fontSize: '0.85rem' }}><Eye size={16} /> No Cover Letter</span>
                                )}
                              </div>
                            </td>
                            <td className="text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(app.applicationStatus)}`}>
                                {app.applicationStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <select
                                className="form-select form-select-sm d-inline-block w-auto focus-ring focus-ring-primary"
                                style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                                value={app.applicationStatus}
                                onChange={(e) => handleStatusUpdate(app.applicationId, e.target.value)}
                                disabled={app.applicationStatus === 'WITHDRAWN'}
                              >
                                {app.applicationStatus === 'APPLIED' && <option value="APPLIED" disabled>APPLIED</option>}
                                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                                <option value="SELECTED">SELECTED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {!loading && applicants.length > 0 && (
        <div className="mt-4">
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            totalElements={totalElements} 
            size={50} 
            setPage={setPage} 
          />
        </div>
      )}

      {/* Cover Letter Viewer Modal */}
      {activeCoverLetter && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-light py-3 border-bottom border-light">
                <h5 className="modal-title fw-bold text-dark">Candidate Cover Letter</h5>
                <button type="button" className="btn-close" onClick={() => setActiveCoverLetter(null)}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <div className="bg-light p-3 rounded-3 text-secondary border border-light" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {activeCoverLetter}
                </div>
              </div>
              <div className="modal-footer bg-light py-3 border-0">
                <button type="button" className="btn btn-secondary px-4 shadow-sm" onClick={() => setActiveCoverLetter(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interviews Modal */}
      {showScheduleModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-light py-3 border-bottom border-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Calendar size={20} className="text-primary"/> Schedule Bulk Interviews
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowScheduleModal(false)}></button>
              </div>
              <form onSubmit={handleBulkSchedule}>
                <div className="modal-body p-4 text-start bg-white">
                  <p className="text-muted text-sm mb-4">
                    You are scheduling interviews for <strong>{schedulingAppIds?.length || 0}</strong> candidate(s). This will send an automated notification to them with the following details.
                  </p>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-sm fw-medium text-secondary">Date *</label>
                      <input type="date" required className="form-control" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-sm fw-medium text-secondary">Time *</label>
                      <input type="time" required className="form-control" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-sm fw-medium text-secondary">Interview Mode *</label>
                      <select 
                        className="form-select" 
                        value={scheduleForm.mode} 
                        onChange={(e) => setScheduleForm({...scheduleForm, mode: e.target.value, link: ''})}
                      >
                        <option value="ONLINE">Online (Virtual)</option>
                        <option value="OFFLINE">Offline (In-Person)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-sm fw-medium text-secondary">
                        {scheduleForm.mode === 'ONLINE' ? 'Meeting Link *' : 'Office Location *'}
                      </label>
                      <input 
                        type="text" 
                        required
                        className="form-control" 
                        placeholder={scheduleForm.mode === 'ONLINE' ? 'e.g. Google Meet Link' : 'e.g. Office Room 102, Building A'} 
                        value={scheduleForm.link} 
                        onChange={(e) => setScheduleForm({...scheduleForm, link: e.target.value})} 
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-sm fw-medium text-secondary">Instructions (Optional)</label>
                      <textarea className="form-control" rows="3" placeholder="e.g. Please bring a copy of your resume." value={scheduleForm.instructions} onChange={(e) => setScheduleForm({...scheduleForm, instructions: e.target.value})}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light py-3 border-0">
                  <button type="button" className="btn btn-light border px-4 shadow-sm" onClick={() => setShowScheduleModal(false)} disabled={scheduling}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm d-flex align-items-center gap-2" disabled={scheduling}>
                    {scheduling ? <Loader2 size={16} className="animate-spin"/> : <Calendar size={16}/>}
                    Schedule & Notify
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Selection Modal */}
      {showSelectionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-success bg-opacity-10 py-3 border-bottom-0">
                <h5 className="modal-title fw-bold text-success d-flex align-items-center gap-2">
                  Confirm Selection
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowSelectionModal(false)}></button>
              </div>
              <form onSubmit={confirmSelection}>
                <div className="modal-body p-4 text-start bg-white">
                  <p className="text-muted text-sm mb-4">
                    You are marking <strong>{selectingAppIds?.length || 0}</strong> candidate(s) as SELECTED. They will receive an official congratulations email.
                  </p>
                  <div className="mb-3">
                    <label className="form-label text-sm fw-medium text-secondary">Joining Date *</label>
                    <input 
                      type="date" 
                      required 
                      className="form-control" 
                      value={selectionForm.joiningDate} 
                      onChange={(e) => setSelectionForm({ joiningDate: e.target.value })} 
                    />
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>This date will be included in their offer email.</small>
                  </div>
                </div>
                <div className="modal-footer bg-light py-3 border-0">
                  <button type="button" className="btn btn-light border px-4 shadow-sm" onClick={() => setShowSelectionModal(false)} disabled={selecting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success px-4 shadow-sm d-flex align-items-center gap-2" disabled={selecting}>
                    {selecting ? <Loader2 size={16} className="animate-spin"/> : 'Confirm & Notify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}

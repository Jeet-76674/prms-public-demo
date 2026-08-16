import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, Calendar, IndianRupee, Users, Loader2, Briefcase, ChevronRight, FileText } from 'lucide-react';
import { tpoService } from '../../services/tpoService';
import toast from 'react-hot-toast';

export default function TpoJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobData = await tpoService.getJobById(id);
        setJob(jobData);
      } catch (error) {
        toast.error('Failed to load job details');
        navigate('/tpo/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setAppsLoading(true);
        const appsData = await tpoService.getJobApplications(id, { page, size: 10 });
        setApplications(appsData.content);
        setTotalPages(appsData.totalPages);
        setTotalApplicants(appsData.totalElements);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setAppsLoading(false);
      }
    };
    fetchApplications();
  }, [id, page]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Open</span>;
      case 'CLOSED':
        return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">Closed</span>;
      case 'DRAFT':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">Draft</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  const getApplicationStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED': return <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill">Applied</span>;
      case 'SHORTLISTED': return <span className="badge bg-info bg-opacity-10 text-info px-3 py-1.5 rounded-pill">Shortlisted</span>;
      case 'INTERVIEW_SCHEDULED': return <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1.5 rounded-pill">Interview</span>;
      case 'SELECTED': return <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill">Selected</span>;
      case 'REJECTED': return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-1.5 rounded-pill">Rejected</span>;
      default: return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1.5 rounded-pill">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container-fluid p-0">
      <div className="mb-4 d-flex align-items-center gap-3">
        <button onClick={() => navigate('/tpo/jobs')} className="btn btn-light rounded-circle p-2 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="h4 mb-0 fw-bold text-slate-800">Job Details</h2>
        </div>
      </div>

      <div className="row g-4">
        {/* Job Info Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h4 className="fw-bold mb-1 text-slate-800">{job.title}</h4>
                  <p className="text-muted mb-0 fw-medium">{job.companyName || 'Unknown Company'}</p>
                </div>
              </div>

              <div className="d-flex gap-2 mb-4 pb-4 border-bottom">
                {getStatusBadge(job.status)}
                <span className="badge bg-slate-100 text-slate-700 px-3 py-2 rounded-pill border">
                  {job.employmentType.replace('_', ' ')}
                </span>
                <span className="badge bg-slate-100 text-slate-700 px-3 py-2 rounded-pill border">
                  {job.workMode.replace('_', ' ')}
                </span>
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded text-muted"><MapPin size={18} /></div>
                  <div>
                    <div className="text-muted small fw-medium">Location</div>
                    <div className="fw-semibold text-slate-800">{job.location}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded text-muted"><IndianRupee size={18} /></div>
                  <div>
                    <div className="text-muted small fw-medium">Salary Range</div>
                    <div className="fw-semibold text-slate-800">₹{job.minimumSalary?.toLocaleString()} - ₹{job.maximumSalary?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded text-muted"><Users size={18} /></div>
                  <div>
                    <div className="text-muted small fw-medium">Vacancies</div>
                    <div className="fw-semibold text-slate-800">{job.vacancies} Openings</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded text-muted"><Calendar size={18} /></div>
                  <div>
                    <div className="text-muted small fw-medium">Application Deadline</div>
                    <div className="fw-semibold text-danger">{job.applicationDeadline}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Applicants Column */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-slate-800">Applicants ({totalApplicants})</h5>
            </div>
            <div className="card-body p-0">
              {appsLoading ? (
                <div className="text-center p-5">
                  <Loader2 className="animate-spin text-primary mx-auto mb-3" size={32} />
                  <p className="text-muted">Loading applicants...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center p-5">
                  <div className="bg-slate-50 rounded-circle d-inline-flex p-4 mb-3">
                    <Users size={32} className="text-muted" />
                  </div>
                  <h6 className="text-slate-800 fw-semibold">No Applicants Yet</h6>
                  <p className="text-muted small">No students have applied for this position.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-uppercase text-slate-500 fw-semibold py-3 ps-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Student</th>
                        <th className="text-uppercase text-slate-500 fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Applied On</th>
                        <th className="text-uppercase text-slate-500 fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Status</th>
                        <th className="text-uppercase text-slate-500 fw-semibold py-3 pe-4 text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.applicationId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tpo/students/${app.studentId}`)}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                                {app.studentName.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-semibold text-slate-800">{app.studentName}</div>
                                <div className="text-muted small">{app.studentEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-slate-600">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            {getApplicationStatusBadge(app.applicationStatus)}
                          </td>
                          <td className="pe-4 py-3 text-end">
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              {app.applicationStatus === 'SELECTED' && (
                                <button
                                  className="btn btn-success btn-sm text-white px-2 py-1 d-inline-flex align-items-center gap-1 shadow-sm"
                                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/tpo/placements?studentId=${app.studentId}&jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}&companyName=${encodeURIComponent(job.companyName || '')}`);
                                  }}
                                  title="Create Placement Record"
                                >
                                  <Briefcase size={12} /> Convert to Placement
                                </button>
                              )}
                              <button 
                                className="btn btn-light btn-sm rounded-circle p-2 text-primary border"
                                onClick={(e) => { e.stopPropagation(); navigate(`/tpo/students/${app.studentId}`); }}
                                title="View Student Details"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {!appsLoading && totalPages > 1 && (
              <div className="card-footer bg-white border-top py-3 d-flex justify-content-center">
                <ul className="pagination pagination-sm gap-2 mb-0">
                  <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 border-0 bg-light shadow-sm text-slate-700 px-3" onClick={() => setPage(p => p - 1)}>Previous</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                      <button className={`page-link rounded-3 border-0 shadow-sm px-3 ${page === i ? 'bg-primary text-white' : 'bg-light text-slate-700'}`} onClick={() => setPage(i)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 border-0 bg-light shadow-sm text-slate-700 px-3" onClick={() => setPage(p => p + 1)}>Next</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

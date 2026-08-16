import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
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

export default function TpoRecruiterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadRecruiter();
  }, [id]);

  const loadRecruiter = async () => {
    try {
      const [data, jobsData] = await Promise.all([
        tpoService.getRecruiterById(id),
        tpoService.getRecruiterJobs(id)
      ]);
      setRecruiter(data);
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to load recruiter details', err);
      toast.error('Recruiter not found');
      navigate('/tpo/recruiters');
    } finally {
      setLoading(false);
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
        <h6 className="mt-3 text-muted">Loading recruiter details...</h6>
      </div>
    );
  }

  if (!recruiter) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="container-fluid p-0">
      {/* Back Button */}
      <Link
        to="/tpo/recruiters"
        className="btn btn-white bg-white text-slate-800 border shadow-xs fw-semibold rounded-3 px-3.5 py-2 d-inline-flex align-items-center gap-2 mb-4 hover-bg-light transition-all"
        style={{ fontSize: '0.875rem' }}
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Recruiter Directory</span>
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

        {/* Right Column: Details */}
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
                        <th className="text-uppercase text-slate-500 fw-semibold py-3 pe-4 text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => (
                        <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tpo/jobs/${job.id}`)}>
                          <td className="ps-4 py-3 fw-medium text-slate-800">{job.title}</td>
                          <td className="py-3">
                            <span className={`badge ${job.status === 'OPEN' ? 'bg-success' : 'bg-secondary'} bg-opacity-10 ${job.status === 'OPEN' ? 'text-success' : 'text-secondary'} px-2 py-1 rounded`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="pe-4 py-3 text-end">
                            <button className="btn btn-light btn-sm rounded-circle p-2 text-primary" onClick={(e) => { e.stopPropagation(); navigate(`/tpo/jobs/${job.id}`); }}>
                              <ChevronRight size={16} />
                            </button>
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
    </motion.div>
  );
}

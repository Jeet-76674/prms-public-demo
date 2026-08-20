import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import api from '../../services/api';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Layers,
  GraduationCap,
  Users,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  FileDown,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const baseURL = api.defaults.baseURL;

  useEffect(() => {
    async function loadJobAndStatus() {
      setLoading(true);
      try {
        const jb = await studentService.getJobById(id);
        const prof = await studentService.getProfile();
        setJob(jb);
        setStudentProfile(prof);

        // Also check if applied
        try {
          const apps = await studentService.getApplications();
          const applied = apps.some(app => app.jobId === parseInt(id));
          setHasApplied(applied);
        } catch (e) {
          console.error(e);
        }
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/student/jobs');
      } finally {
        setLoading(false);
      }
    }
    loadJobAndStatus();
  }, [id, navigate]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (coverLetter.split(' ').length < 10) {
      toast.error('Cover letter should be at least 10 words');
      return;
    }

    setApplying(true);
    try {
      await studentService.applyJob(id, coverLetter);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
        <Loader2 className="animate-spin text-primary mb-3" size={40} />
        <h6 className="text-muted fw-medium">Loading position profile...</h6>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-5">
        <h5 className="text-danger fw-bold">Position Not Found</h5>
        <Link to="/student/jobs" className="btn-back mt-3">
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const isCgpaEligible = studentProfile ? studentProfile.cgpa >= (job?.minimumCgpa ?? job?.minimumCGPA ?? 0) : true;
  const isBacklogEligible = studentProfile ? studentProfile.activeBacklogs <= (job?.allowedBacklogs ?? 0) : true;
  const isEligible = isCgpaEligible && isBacklogEligible;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
      style={{ maxWidth: '1020px' }}
    >
      <Link
        to="/student/jobs"
        className="btn-back mb-4"
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Job Directory</span>
      </Link>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 p-4 bg-white shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="d-flex align-items-start gap-4 mb-4">
              <div className="flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                <div className="w-100 h-100 bg-light rounded-3 d-flex align-items-center justify-content-center text-slate-800 border">
                  <Building2 size={32} />
                </div>
              </div>
              <div>
                <h3 className="fw-bold text-slate-900 mb-1" style={{ letterSpacing: '-0.02em' }}>{job.title}</h3>
                <div className="d-flex flex-wrap align-items-center text-muted gap-3 mt-2" style={{ fontSize: '0.875rem' }}>
                  <span className="d-flex align-items-center gap-1.5 text-primary fw-semibold">
                    <Building2 size={15} /> {job.companyName}
                  </span>
                  <span className="d-flex align-items-center gap-1 text-slate-600">
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span className="d-flex align-items-center gap-1 text-slate-600">
                    <Briefcase size={15} /> {
                      { 0: 'Fresher', 1: '0-1 Years', 2: '1-2 Years', 3: '2+ Years' }[job.experienceRequired] || `${job.experienceRequired} Years`
                    }
                  </span>
                </div>
              </div>
            </div>

            <h5 className="fw-bold text-slate-900 mb-2" style={{ fontSize: '1.05rem' }}>Role Overview</h5>
            <p className="text-slate-700 mb-4" style={{ lineHeight: '1.65', whiteSpace: 'pre-wrap', fontSize: '0.925rem' }}>{job.description}</p>

            <h5 className="fw-bold text-slate-900 mb-2" style={{ fontSize: '1.05rem' }}>Core Responsibilities</h5>
            <p className="text-slate-700 mb-4" style={{ lineHeight: '1.65', whiteSpace: 'pre-wrap', fontSize: '0.925rem' }}>{job.responsibilities}</p>

            <h5 className="fw-bold text-slate-900 mb-2" style={{ fontSize: '1.05rem' }}>Qualifications & Requirements</h5>
            <p className="text-slate-700 mb-4" style={{ lineHeight: '1.65', whiteSpace: 'pre-wrap', fontSize: '0.925rem' }}>{job.requirements}</p>

            <h5 className="fw-bold text-slate-900 mb-2" style={{ fontSize: '1.05rem' }}>Required Skills</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {job.requiredSkills?.split(',').map((skill, index) => (
                <span key={index} className="badge bg-light text-slate-800 border px-3 py-2 fw-medium" style={{ fontSize: '0.8rem', borderRadius: '10px' }}>
                  {skill.trim()}
                </span>
              ))}
            </div>

            <div className="bg-light p-3.5 rounded-3 d-flex align-items-center justify-content-between border mt-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-2 bg-white border text-primary d-flex align-items-center justify-content-center">
                  <FileDown size={22} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-slate-900" style={{ fontSize: '0.9rem' }}>Official Job Description.pdf</h6>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Verified recruitment syllabus and criteria details</small>
                </div>
              </div>
              <a href={resolvePdfUrl(job.jdUrl, 'jd')} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm px-3.5 fw-semibold" style={{ borderRadius: '8px' }}>
                Open PDF
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 p-4 bg-white shadow-sm mb-4 position-sticky" style={{ top: '90px', borderRadius: '16px' }}>
            <h5 className="fw-bold text-slate-900 mb-3" style={{ fontSize: '1.1rem' }}>Onboarding Gate</h5>

            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><IndianRupee size={16} /> Salary:</span>
                <strong className="text-slate-900" style={{ fontSize: '0.9rem' }}>₹{job.minimumSalary ? Number(job.minimumSalary).toLocaleString('en-IN') : '0'} - ₹{job.maximumSalary ? Number(job.maximumSalary).toLocaleString('en-IN') : '0'}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><Calendar size={16} /> Deadline:</span>
                <strong className="text-slate-900" style={{ fontSize: '0.9rem' }}>{job.applicationDeadline}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><Layers size={16} /> Employment:</span>
                <strong className="text-slate-900" style={{ fontSize: '0.9rem' }}>{job.employmentType} ({job.workMode})</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><Users size={16} /> Vacancies:</span>
                <strong className="text-slate-900" style={{ fontSize: '0.9rem' }}>{job.vacancies} open seats</strong>
              </div>
            </div>

            {studentProfile && (
              <div className="bg-slate-50 rounded-3 p-3 mb-4 border" style={{ borderColor: '#E2E8F0' }}>
                <div className="fw-bold text-slate-800 mb-2.5 d-flex align-items-center justify-content-between" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  <span>METRIC ELIGIBILITY CHECK</span>
                  <span className={`badge ${isCgpaEligible && isBacklogEligible ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-semibold`} style={{ fontSize: '0.68rem' }}>
                    {isCgpaEligible && isBacklogEligible ? 'ALL CRITERIA MET' : 'CRITERIA NOT MET'}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between py-1.5 border-bottom border-light">
                  <span className="text-secondary d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                    <GraduationCap size={15} className="text-primary flex-shrink-0" />
                    <span>Min CGPA: <strong>{job.minimumCGPA}</strong></span>
                  </span>
                  <span className={`badge ${isCgpaEligible ? 'bg-success text-white' : 'bg-danger text-white'} px-2 py-1`} style={{ fontSize: '0.7rem' }}>
                    {isCgpaEligible ? `PASS (GPA: ${studentProfile.cgpa})` : `FAIL (GPA: ${studentProfile.cgpa})`}
                  </span>
                </div>

                <div className="d-flex align-items-center justify-content-between py-1.5 pt-2">
                  <span className="text-secondary d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                    <AlertTriangle size={15} className="text-warning flex-shrink-0" />
                    <span>Max Backlogs: <strong>{job.allowedBacklogs}</strong></span>
                  </span>
                  <span className={`badge ${isBacklogEligible ? 'bg-success text-white' : 'bg-danger text-white'} px-2.5 py-1`} style={{ fontSize: '0.7rem' }}>
                    {isBacklogEligible ? 'PASS (0)' : `FAIL (${studentProfile.activeBacklogs})`}
                  </span>
                </div>
              </div>
            )}

            {job.status === 'CLOSED' ? (
              <button disabled className="btn btn-secondary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                <AlertTriangle size={18} />
                <span>Job is Closed</span>
              </button>
            ) : hasApplied ? (
              <button disabled className="btn btn-success w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                <CheckCircle2 size={18} />
                <span>Application Submitted</span>
              </button>
            ) : !isEligible && studentProfile ? (
              <div className="text-center">
                <div className="text-danger fw-semibold mb-2 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '0.8rem' }}>
                  <AlertTriangle size={14} /> Academic gates not satisfied.
                </div>
                <button disabled className="btn btn-outline-danger w-100 py-2.5 fw-bold">
                  Locked Profile
                </button>
              </div>
            ) : (
              <button onClick={() => setShowApplyModal(true)} className="btn btn-primary w-100 py-2.5 shadow-sm fw-bold">
                Apply for this Role
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Prompt Modal */}
      {showApplyModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
              <div className="modal-header bg-primary text-white py-3 border-0">
                <h5 className="modal-title fw-bold">Write Your Cover Letter</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowApplyModal(false)}></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body p-4 bg-white">
                  <div className="mb-3 text-start">
                    <label className="form-label fw-bold text-secondary" style={{ fontSize: '0.9rem' }}>
                      Explain why you are an ideal fit for {job.companyName} ({job.title})
                    </label>
                    <textarea
                      rows="5"
                      className="form-control bg-light border-light focus-ring focus-ring-primary"
                      placeholder="Discuss your frameworks, cloud certifications, or core algorithmic scores..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    ></textarea>
                    <small className="text-muted d-block mt-2" style={{ fontSize: '0.8rem' }}>Minimum 10 words. Your verified profile details will be shared automatically.</small>
                  </div>
                </div>
                <div className="modal-footer bg-light py-3 border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={applying} className="btn btn-primary px-4 shadow-sm">
                    {applying ? <><Loader2 size={16} className="spinner me-2" /> Submitting...</> : 'Submit Application'}
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

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
      toast.error(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="spinner" size={32} />
      </div>
    );
  }

  if (!job) return null;

  const isCgpaEligible = studentProfile?.cgpa >= (job.minimumCgpa ?? job.minimumCGPA ?? 0);
  const isBacklogEligible = studentProfile?.activeBacklogs <= job.allowedBacklogs;
  const isEligible = isCgpaEligible && isBacklogEligible;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
      style={{ maxWidth: '1000px' }}
    >
      <Link
        to="/student/jobs"
        className="btn btn-white bg-white text-slate-800 border shadow-xs fw-semibold rounded-3 px-3.5 py-2 d-inline-flex align-items-center gap-2 mb-4 hover-bg-light transition-all text-decoration-none"
        style={{ fontSize: '0.875rem' }}
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Job Directory</span>
      </Link>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          <div className="card border-0 p-4 bg-white shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="d-flex align-items-start gap-4 mb-4">
              <div className="flex-shrink-0" style={{ width: '70px', height: '70px' }}>
                <div className="w-100 h-100 bg-light rounded-3 d-flex align-items-center justify-content-center text-primary">
                  <Building2 size={36} />
                </div>
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-1">{job.title}</h3>
                <div className="d-flex flex-wrap align-items-center text-muted gap-3 mt-2" style={{ fontSize: '0.9rem' }}>
                  <span className="d-flex align-items-center gap-1 text-primary fw-medium">
                    <Building2 size={16} /> {job.companyName}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <Briefcase size={16} /> {
                      { 0: 'Fresher', 1: '0-1 Years', 2: '1-2 Years', 3: '2+ Years' }[job.experienceRequired] || `${job.experienceRequired} Years`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* General Descriptions */}
            <h5 className="fw-bold text-secondary mb-2">Role Overview</h5>
            <p className="text-secondary mb-4" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.description}</p>

            <h5 className="fw-bold text-secondary mb-2">Core Responsibilities</h5>
            <p className="text-secondary mb-4" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.responsibilities}</p>

            <h5 className="fw-bold text-secondary mb-2">Qualifications & Requirements</h5>
            <p className="text-secondary mb-4" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>

            {/* Skills */}
            <h5 className="fw-bold text-secondary mb-2">Required Skills</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {job.requiredSkills?.split(',').map((skill, index) => (
                <span key={index} className="badge bg-light text-secondary border px-3 py-2" style={{ fontSize: '0.8rem', borderRadius: '12px' }}>
                  {skill.trim()}
                </span>
              ))}
            </div>

            {/* Embedded JD PDF Action */}
            {job.jdUrl && (
              <div className="bg-light p-3 rounded-3 d-flex align-items-center justify-content-between border border-light mt-4">
                <div className="d-flex align-items-center gap-2">
                  <FileDown size={24} className="text-primary" />
                  <div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Official Job Description.pdf</h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Detailed criteria and curriculum matches</small>
                  </div>
                </div>
                <a href={job.jdUrl.startsWith('http') ? job.jdUrl : `${api.defaults.baseURL || ''}${job.jdUrl.startsWith('/') ? '' : '/'}${job.jdUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm px-3">
                  Open PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Eligibility check cards */}
        <div className="col-lg-4">
          <div className="card border-0 p-4 bg-white shadow-sm mb-4 position-sticky" style={{ top: '90px', borderRadius: '16px' }}>
            <h5 className="fw-bold text-secondary mb-3">Onboarding Gate</h5>

            {/* Salary deadline details list */}
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><IndianRupee size={16} /> Salary:</span>
                <strong className="text-dark" style={{ fontSize: '0.9rem' }}>₹{job.minimumSalary ? Number(job.minimumSalary).toLocaleString('en-IN') : '0'} - ₹{job.maximumSalary ? Number(job.maximumSalary).toLocaleString('en-IN') : '0'}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><Calendar size={16} /> Deadline:</span>
                <strong className="text-dark" style={{ fontSize: '0.9rem' }}>{job.applicationDeadline}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><Layers size={16} /> Employment:</span>
                <strong className="text-dark" style={{ fontSize: '0.9rem' }}>{job.employmentType} ({job.workMode})</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}><Users size={16} /> Vacancies:</span>
                <strong className="text-dark" style={{ fontSize: '0.9rem' }}>{job.vacancies} open seats</strong>
              </div>
            </div>

            {/* Eligibility widget */}
            {studentProfile && (
              <div className="bg-light rounded-3 p-3 mb-4 border">
                <div className="fw-bold text-secondary mb-3" style={{ fontSize: '0.8rem' }}>METRIC ELIGIBILITY CHECK</div>

                {/* CGPA check */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}><GraduationCap size={14} /> Min CGPA: {job.minimumCGPA}</span>
                  {isCgpaEligible ? (
                    <span className="badge bg-success-subtle text-success py-1" style={{ fontSize: '0.7rem' }}>PASS (Your GPA: {studentProfile.cgpa})</span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger py-1" style={{ fontSize: '0.7rem' }}>FAIL (Your GPA: {studentProfile.cgpa})</span>
                  )}
                </div>

                {/* Backlog check */}
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}><AlertTriangle size={14} /> Max Backlogs: {job.allowedBacklogs}</span>
                  {isBacklogEligible ? (
                    <span className="badge bg-success-subtle text-success py-1" style={{ fontSize: '0.7rem' }}>PASS</span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger py-1" style={{ fontSize: '0.7rem' }}>FAIL ({studentProfile.activeBacklogs} backlogs)</span>
                  )}
                </div>
              </div>
            )}

            {/* Final Apply button triggers */}
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

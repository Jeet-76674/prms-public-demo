import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  FileText,
  Linkedin,
  Github,
  Globe,
  Award,
  PowerOff,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { resolvePdfUrl } from '../../utils/pdfHelper';
import { formatStudentName, formatStudentInitials } from '../../utils/nameHelper';

export default function TpoStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const [data, applicationsData] = await Promise.all([
        tpoService.getStudentById(id),
        tpoService.getStudentApplications(id)
      ]);
      setStudent({ ...data, applications: applicationsData });
    } catch (err) {
      console.error('Failed to load student details', err);
      toast.error('Student not found');
      navigate('/tpo/students');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlacementStatus = async (status) => {
    setProcessing(true);
    try {
      await tpoService.updateStudentPlacementStatus(id, status);
      toast.success(`Placement status updated to ${status}`);
      loadStudent();
    } catch (err) {
      toast.error('Failed to update placement status');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateAccountStatus = async (status) => {
    setProcessing(true);
    try {
      await tpoService.updateStudentAccountStatus(id, status);
      toast.success(`Account status updated to ${status}`);
      loadStudent();
    } catch (err) {
      toast.error('Failed to update account status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Loading student details...</h6>
      </div>
    );
  }

  if (!student) return null;

  const getPlacementBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2" style={{ fontSize: '0.8rem' }}><CheckCircle size={14} className="me-1" /> PLACED</span>;
      case 'HIGHER_STUDIES':
        return <span className="badge bg-info bg-opacity-10 text-info border border-info px-3 py-2" style={{ fontSize: '0.8rem' }}><Award size={14} className="me-1" /> HIGHER STUDIES</span>;
      case 'SELF_EMPLOYED':
        return <span className="badge bg-purple bg-opacity-10 text-purple border border-purple px-3 py-2" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe', borderColor: '#c4b5fd', fontSize: '0.8rem' }}><Globe size={14} className="me-1" /> SELF EMPLOYED</span>;
      case 'NOT_PLACED':
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2" style={{ fontSize: '0.8rem' }}><XCircle size={14} className="me-1" /> NOT PLACED</span>;
    }
  };

  const getAccountBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2" style={{ fontSize: '0.8rem' }}><CheckCircle size={14} className="me-1" /> ACCOUNT ACTIVE</span>;
      case 'INACTIVE':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2" style={{ fontSize: '0.8rem' }}><PowerOff size={14} className="me-1" /> ACCOUNT INACTIVE</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      {/* Back Button */}
      <Link
        to="/tpo/students"
        className="btn-back mb-4"
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Student Directory</span>
      </Link>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 bg-white shadow-sm p-4 text-center h-100" style={{ borderRadius: '12px' }}>
            <div className="mb-4">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center text-primary border mx-auto shadow-sm" style={{ width: '120px', height: '120px', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {formatStudentInitials(student.firstName, student.lastName)}
              </div>
            </div>
            
            <h4 className="fw-bold text-dark mb-1">
              {formatStudentName(`${student.firstName || ''} ${student.lastName || ''}`.trim(), student.email)}
            </h4>
            <p className="text-muted text-sm mb-1">{student.enrollmentNumber}</p>
            <p className="text-muted text-sm fw-medium mb-3">{student.department || 'Department not specified'}</p>
            
            <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
              {getPlacementBadge(student.placementStatus)}
              {getAccountBadge(student.accountStatus || 'ACTIVE')}
            </div>

            <div className="d-flex flex-column gap-2 text-start pt-3 border-top">
              <div className="d-flex align-items-center gap-3 text-secondary text-sm">
                <Mail size={16} />
                <span className="text-truncate">{student.email}</span>
              </div>
              <div className="d-flex align-items-center gap-3 text-secondary text-sm">
                <Phone size={16} />
                <span className="text-truncate">{student.phoneNumber || 'No phone provided'}</span>
              </div>
              <div className="d-flex align-items-center gap-3 text-secondary text-sm">
                <MapPin size={16} />
                <span className="text-truncate">{student.city || 'No location'}, {student.state || ''}</span>
              </div>
              {student.linkedinUrl && (
                <div className="d-flex align-items-center gap-3 text-secondary text-sm mt-1">
                  <Linkedin size={16} className="text-primary" />
                  <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary text-decoration-none text-truncate">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {student.githubUrl && (
                <div className="d-flex align-items-center gap-3 text-secondary text-sm mt-1">
                  <Github size={16} className="text-dark" />
                  <a href={student.githubUrl} target="_blank" rel="noreferrer" className="text-dark text-decoration-none text-truncate">
                    GitHub Profile
                  </a>
                </div>
              )}
              {student.resumeUrl && (
                <div className="d-flex align-items-center gap-3 text-secondary text-sm mt-1">
                  <FileText size={16} className="text-danger" />
                  <a href={resolvePdfUrl(student.resumeUrl, 'resume')} target="_blank" rel="noreferrer" className="text-danger text-decoration-none text-truncate fw-semibold">
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="col-12 col-lg-8">
          
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 bg-white shadow-sm p-4 h-100 text-center" style={{ borderRadius: '12px' }}>
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-inline-flex mx-auto mb-3">
                  <GraduationCap size={24} />
                </div>
                <h6 className="text-muted text-xs fw-bold mb-1">CGPA</h6>
                <h3 className="fw-bold mb-0 text-dark">{student.cgpa || 'N/A'}</h3>
              </div>
            </div>
            
            <div className="col-12 col-md-4">
              <div className="card border-0 bg-white shadow-sm p-4 h-100 text-center" style={{ borderRadius: '12px' }}>
                <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-inline-flex mx-auto mb-3">
                  <FileText size={24} />
                </div>
                <h6 className="text-muted text-xs fw-bold mb-1">ACTIVE BACKLOGS</h6>
                <h3 className="fw-bold mb-0 text-dark">{student.activeBacklogs || 0}</h3>
              </div>
            </div>
            
            <div className="col-12 col-md-4">
              <div className="card border-0 bg-white shadow-sm p-4 h-100 text-center" style={{ borderRadius: '12px' }}>
                <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 d-inline-flex mx-auto mb-3">
                  <Award size={24} />
                </div>
                <h6 className="text-muted text-xs fw-bold mb-1">PASSING YEAR</h6>
                <h3 className="fw-bold mb-0 text-dark">{student.passingYear || 'N/A'}</h3>
              </div>
            </div>
          </div>

          <div className="card border-0 bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold text-secondary mb-3">Academic Details</h5>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-4">
                <span className="d-block text-muted text-xs fw-semibold mb-1">10th Percentage</span>
                <span className="fw-medium text-dark">{student.tenthPercentage ? `${student.tenthPercentage}%` : 'N/A'}</span>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <span className="d-block text-muted text-xs fw-semibold mb-1">12th Percentage</span>
                <span className="fw-medium text-dark">{student.twelfthPercentage ? `${student.twelfthPercentage}%` : 'N/A'}</span>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <span className="d-block text-muted text-xs fw-semibold mb-1">Diploma Percentage</span>
                <span className="fw-medium text-dark">{student.diplomaPercentage ? `${student.diplomaPercentage}%` : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="card border-0 bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold text-secondary mb-3">Skills & Achievements</h5>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <span className="d-block text-muted text-xs fw-semibold mb-2">Technical Skills</span>
                <p className="text-dark mb-0">{student.technicalSkills || 'No technical skills listed'}</p>
              </div>
              <div className="col-12 col-md-6">
                <span className="d-block text-muted text-xs fw-semibold mb-2">Soft Skills</span>
                <p className="text-dark mb-0">{student.softSkills || 'No soft skills listed'}</p>
              </div>
              <div className="col-12 col-md-6">
                <span className="d-block text-muted text-xs fw-semibold mb-2">Certifications</span>
                <p className="text-dark mb-0">{student.certifications || 'No certifications listed'}</p>
              </div>
              <div className="col-12 col-md-6">
                <span className="d-block text-muted text-xs fw-semibold mb-2">Achievements</span>
                <p className="text-dark mb-0">{student.achievements || 'No achievements listed'}</p>
              </div>
            </div>
          </div>

          {/* Applications Area */}
          <div className="card border-0 bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold text-secondary mb-3">Job Applications</h5>
            {student.applications && student.applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 text-sm">
                  <thead className="table-light text-muted">
                    <tr>
                      <th className="py-2 px-3">Company</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.applications.map((app, index) => (
                      <tr key={index}>
                        <td className="py-2 px-3 fw-medium">{app.companyName || `Job ID: ${app.jobId}`}</td>
                        <td className="py-2 px-3 text-muted">
                          <Link to={`/tpo/jobs/${app.jobId}`} className="text-decoration-none">{app.jobTitle || 'N/A'}</Link>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`badge ${(app.applicationStatus === 'SELECTED' || app.applicationStatus === 'OFFER_ACCEPTED') ? 'bg-success' : (app.applicationStatus === 'REJECTED' || app.applicationStatus === 'OFFER_REJECTED') ? 'bg-danger' : 'bg-warning text-dark'}`}>
                            {app.applicationStatus}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-end">
                          {(app.applicationStatus === 'SELECTED' || app.applicationStatus === 'OFFER_ACCEPTED') && (
                            <button
                              className="btn btn-sm btn-primary py-1 px-2"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => {
                                navigate(`/tpo/placements?studentId=${student.id}&jobId=${app.jobId}`);
                              }}
                            >
                              Create Placement
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-sm mb-0">No job applications found.</p>
            )}
          </div>

          {/* Action Area */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0 !important' }}>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">Account Management</h5>
                <p className="text-muted text-xs mb-0">
                  Manage student's access to the portal.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {(!student.accountStatus || student.accountStatus === 'ACTIVE') ? (
                  <button 
                    onClick={() => handleUpdateAccountStatus('INACTIVE')}
                    disabled={processing}
                    className="btn btn-warning text-dark px-4 d-flex align-items-center gap-2 fw-medium" 
                    style={{ borderRadius: '8px' }}
                  >
                    {processing ? <Loader2 size={16} className="animate-spin" /> : <PowerOff size={16} />}
                    <span>Deactivate Account</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdateAccountStatus('ACTIVE')}
                    disabled={processing}
                    className="btn btn-success text-white px-4 d-flex align-items-center gap-2 fw-medium" 
                    style={{ backgroundColor: '#22C55E', borderRadius: '8px' }}
                  >
                    {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    <span>Activate Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
}

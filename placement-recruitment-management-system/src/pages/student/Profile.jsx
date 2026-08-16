import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  UploadCloud,
  FileText,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function StudentProfile() {
  const { setProfileCompletedState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [profilePic, setProfilePic] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  const fileInputPicRef = useRef(null);
  const fileInputResumeRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getFieldState,
    formState: { errors },
  } = useForm({
    shouldUnregister: false
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await studentService.getProfile();
        setProfileData(data);
        reset(data);
        if (data.profileImageUrl || data.profilePic) setProfilePic(data.profileImageUrl || data.profilePic);
        if (data.resumeUrl) setResumeName(data.resumeUrl);
        if (data.profileCompleted) setIsEditing(false);
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.message?.includes('not found')) {
          return; // Expected for new users
        }
        toast.error('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [reset]);

  const focusFirstInvalidField = (fields) => {
    for (const fieldName of fields) {
      const state = getFieldState(fieldName);
      if (state.invalid || state.error) {
        const element = document.getElementsByName(fieldName)[0] || document.querySelector(`[name="${fieldName}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
        break;
      }
    }
  };

  const getFieldsForTab = (tabId) => {
    if (tabId === 'personal') {
      return ['enrollmentNumber', 'dateOfBirth', 'gender', 'pincode', 'addressLine1', 'city', 'state', 'country'];
    }
    if (tabId === 'academic') {
      return ['department', 'semester', 'section', 'cgpa', 'passingYear'];
    }
    return [];
  };

  const onError = (formErrors) => {
    const errorFields = Object.keys(formErrors);
    if (errorFields.length > 0) {
      const personalFields = getFieldsForTab('personal');
      const academicFields = getFieldsForTab('academic');

      const hasPersonalErr = errorFields.some(f => personalFields.includes(f));
      const hasAcademicErr = errorFields.some(f => academicFields.includes(f));

      if (hasPersonalErr) setActiveTab('personal');
      else if (hasAcademicErr) setActiveTab('academic');

      setTimeout(() => {
        const firstField = errorFields[0];
        const element = document.getElementsByName(firstField)[0] || document.querySelector(`[name="${firstField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
    }
  };

  const resolveResumeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    const targetPath = cleanPath.startsWith('/api/') ? cleanPath.replace('/api/', '/') : cleanPath;
    return targetPath;
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForTab(activeTab);

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        focusFirstInvalidField(fieldsToValidate);
        return;
      }
    }

    const currentIndex = tabItems.findIndex(t => t.id === activeTab);
    if (currentIndex < tabItems.length - 1) {
      setActiveTab(tabItems[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleTabClick = async (targetTabId) => {
    const currentIndex = tabItems.findIndex(t => t.id === activeTab);
    const targetIndex = tabItems.findIndex(t => t.id === targetTabId);

    if (targetIndex > currentIndex) {
      const fieldsToValidate = getFieldsForTab(activeTab);
      if (fieldsToValidate.length > 0) {
        const isValid = await trigger(fieldsToValidate);
        if (!isValid) {
          focusFirstInvalidField(fieldsToValidate);
          return;
        }
      }
    }

    setActiveTab(targetTabId);
  };

  const handlePrev = () => {
    const currentIndex = tabItems.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabItems[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const data = await studentService.saveProfile(formData);
      setProfileCompletedState(true);
      setProfileData(data);
      setIsEditing(false);
      toast.success('Profile saved successfully!');
    } catch (err) {
      // api.js interceptor will display detailed validation error
    } finally {
      setSaving(false);
    }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setIsUploadingPic(true);
    try {
      const response = await studentService.uploadProfileImage(uploadData);
      setProfilePic(response.fileUrl || response.url);
      toast.success('Profile photo uploaded.');
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setIsUploadingPic(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF document only.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('resume', file);

    setIsUploadingResume(true);
    try {
      const response = await studentService.uploadResume(uploadData);
      setResumeName(response.fileUrl || response.url || file.name);
      toast.success('Academic resume PDF uploaded successfully!');
    } catch (err) {
      toast.error('Resume PDF upload failed.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Retrieving profile parameters...</h6>
      </div>
    );
  }

  const tabItems = [
    { id: 'personal', label: 'Personal Information', icon: <User size={18} /> },
    { id: 'academic', label: 'Academic Qualifications', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'Professional Skills', icon: <Sparkles size={18} /> },
    { id: 'uploads', label: 'Uploads & Portfolio', icon: <LinkIcon size={18} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="container-fluid p-0">

      {/* Onboarding status card */}
      <div className="card border-0 mb-4 bg-light p-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary bg-opacity-10 text-primary p-2.5 rounded-3">
            <CheckCircle size={24} />
          </div>
          <div>
            <h6 className="fw-bold mb-1">Academic Profile Verification Check</h6>
            <p className="text-secondary text-xs mb-0">Fill all mandatory sections to unlock placements. Academic fields cannot contain backlogs beyond threshold bounds.</p>
          </div>
        </div>
      </div>

      {!isEditing && profileData ? (
        <div className="row g-4">
          <div className="col-lg-12 mb-3 text-end">
            <button onClick={() => setIsEditing(true)} className="btn btn-primary shadow-sm px-4">
              Edit Profile
            </button>
          </div>
          {/* Read-Only Layout */}
          <div className="col-lg-4">
            <div className="card border-0 p-4 text-center bg-white shadow-sm h-100">
               <img src={resolveResumeUrl(profileData.profileImageUrl || profileData.profilePic) || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'} alt="Profile" className="rounded-circle border mx-auto mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
               <h4 className="fw-bold mb-1">{profileData.firstName} {profileData.lastName}</h4>
               <p className="text-muted mb-3">{profileData.department}</p>
               <div className="d-flex justify-content-center gap-2 flex-wrap">
                 <span className="badge bg-primary bg-opacity-10 text-primary">{profileData.enrollmentNumber}</span>
                 <span className="badge bg-success-subtle text-success">Verified</span>
               </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card border-0 p-4 bg-white shadow-sm h-100">
               {/* Details */}
               <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                 <User className="text-primary" size={20} />
                 <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>Personal Information</h5>
               </div>
               <div className="row g-3 mb-4">
                 <div className="col-md-6">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">EMAIL</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.email}</p>
                 </div>
                 <div className="col-md-6">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">PHONE</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.phoneNumber || '—'}</p>
                 </div>
                 <div className="col-md-6">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">DATE OF BIRTH</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.dateOfBirth || '—'}</p>
                 </div>
                 <div className="col-md-6">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">LOCATION</span>
                   <p className="fw-semibold text-slate-900 m-0">{[profileData.city, profileData.state, profileData.country].filter(Boolean).join(', ') || '—'}</p>
                 </div>
               </div>

               {/* Academic */}
               <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                 <GraduationCap className="text-primary" size={20} />
                 <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>Academic Qualifications</h5>
               </div>
               <div className="row g-3 mb-4">
                 <div className="col-md-4">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">CURRENT CGPA</span>
                   <p className="fw-bold text-primary m-0" style={{ fontSize: '1.1rem' }}>{profileData.cgpa || '—'}</p>
                 </div>
                 <div className="col-md-4">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">SEMESTER</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.semester || '—'}</p>
                 </div>
                 <div className="col-md-4">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">PASSING YEAR</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.passingYear || '—'}</p>
                 </div>
                 <div className="col-md-4">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">10TH %</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.tenthPercentage || '—'}</p>
                 </div>
                 <div className="col-md-4">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">12TH / DIPLOMA %</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.twelfthPercentage || profileData.diplomaPercentage || '—'}</p>
                 </div>
                 <div className="col-md-4">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">ACTIVE BACKLOGS</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData.activeBacklogs || '0'}</p>
                 </div>
               </div>

               {/* Uploads & Portfolio */}
               <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                 <LinkIcon className="text-primary" size={20} />
                 <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>Uploads & Portfolio</h5>
               </div>
               <div className="row g-3">
                 <div className="col-md-6">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">LINKEDIN URL</span>
                   {profileData?.linkedinUrl ? <a href={profileData.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary fw-medium text-decoration-none text-truncate d-block">{profileData.linkedinUrl}</a> : <span className="text-slate-500">—</span>}
                 </div>
                 <div className="col-md-6">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">GITHUB URL</span>
                   {profileData?.githubUrl ? <a href={profileData.githubUrl} target="_blank" rel="noreferrer" className="text-primary fw-medium text-decoration-none text-truncate d-block">{profileData.githubUrl}</a> : <span className="text-slate-500">—</span>}
                 </div>
                 <div className="col-md-4 mt-2">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">PORTFOLIO</span>
                   {profileData?.portfolioUrl ? <a href={profileData.portfolioUrl} target="_blank" rel="noreferrer" className="text-primary fw-medium text-decoration-none text-truncate d-block">{profileData.portfolioUrl}</a> : <span className="text-slate-500">—</span>}
                 </div>
                 <div className="col-md-4 mt-2">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">LEETCODE</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData?.leetcodeUrl || '—'}</p>
                 </div>
                 <div className="col-md-4 mt-2">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">HACKERRANK</span>
                   <p className="fw-semibold text-slate-900 m-0">{profileData?.hackerrankUrl || '—'}</p>
                 </div>
                 <div className="col-12 mt-3">
                   <span className="text-muted d-block text-xs fw-semibold mb-1">RESUME PDF</span>
                   {profileData?.resumeUrl ? (
                      <a href={resolveResumeUrl(profileData.resumeUrl)} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center gap-2 text-success text-decoration-none hover-text-primary mt-1">
                        <FileText size={18} />
                        <span className="fw-semibold text-sm text-truncate text-decoration-underline" style={{ maxWidth: '300px' }}>
                          {profileData.resumeUrl.split('/').pop()}
                        </span>
                      </a>
                   ) : (
                     <span className="text-slate-500">—</span>
                   )}
                 </div>
               </div>

            </div>
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row g-4">

          {/* Left Sidebar Profile Badge */}
          <div className="col-lg-3">
            <div className="card border-0 p-4 text-center bg-white shadow-sm mb-4">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={resolveResumeUrl(profilePic) || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
                  alt="Profile"
                  className="rounded-circle border"
                  style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  disabled={isUploadingPic}
                  onClick={() => fileInputPicRef.current.click()}
                  className="btn btn-primary rounded-circle p-1.5 position-absolute bottom-0 end-0 shadow-sm border border-white d-flex align-items-center justify-content-center"
                  style={{ width: '32px', height: '32px' }}
                >
                  <UploadCloud size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputPicRef}
                  onChange={handlePicUpload}
                  accept="image/*"
                  className="d-none"
                />
              </div>

              {isUploadingPic && <div className="text-primary text-xs mb-2">Saving photo...</div>}

              <h6 className="fw-bold mb-1">Candidate Profile Photo</h6>
              <p className="text-muted text-xs mb-3">Upload a professional headshot for corporate resume cards.</p>

              <div className="border-top pt-3 text-start">
                <div className="text-muted text-xs mb-1">VERIFICATION TAGS</div>
                <div className="badge bg-success-subtle text-success border border-success w-100 py-2" style={{ fontSize: '0.7rem' }}>
                  STUDENT ID VALIDATED
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Fields Panel */}
          <div className="col-lg-9">
            <div className="card border-0 bg-white shadow-sm p-4 h-100">

              {/* Profile sub-tabs */}
              <ul className="nav nav-tabs border-bottom mb-4 gap-2 flex-wrap">
                {tabItems.map((item) => (
                  <li key={item.id} className="nav-item">
                    <button
                      type="button"
                      onClick={() => handleTabClick(item.id)}
                      className={`nav-link border-0 fw-semibold py-2 px-3 d-flex align-items-center gap-2 ${activeTab === item.id ? 'active text-primary bg-light' : 'text-secondary'
                        }`}
                      style={{ borderRadius: '8px' }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab: Personal */}
              {activeTab === 'personal' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label text-secondary fw-semibold">Enrollment Number</label>
                    <input type="text" className={`form-control ${errors.enrollmentNumber ? 'is-invalid' : ''}`} {...register('enrollmentNumber', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Date Of Birth</label>
                    <input type="date" className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} {...register('dateOfBirth', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Gender</label>
                    <select className="form-select" {...register('gender', { required: true })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Primary Pincode</label>
                    <input type="text" className={`form-control ${errors.pincode ? 'is-invalid' : ''}`} {...register('pincode', { required: true })} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label text-secondary fw-semibold">Street Address (Address Line 1)</label>
                    <input type="text" className={`form-control ${errors.addressLine1 ? 'is-invalid' : ''}`} {...register('addressLine1', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">City</label>
                    <input type="text" className={`form-control ${errors.city ? 'is-invalid' : ''}`} {...register('city', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">State</label>
                    <input type="text" className={`form-control ${errors.state ? 'is-invalid' : ''}`} {...register('state', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Country</label>
                    <input type="text" className={`form-control ${errors.country ? 'is-invalid' : ''}`} {...register('country', { required: true })} />
                  </div>
                </motion.div>
              )}

              {/* Tab: Academic */}
              {activeTab === 'academic' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold">Enrollment Department</label>
                    <select className={`form-select ${errors.department ? 'is-invalid' : ''}`} {...register('department', { required: true })}>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary fw-semibold">Current Semester</label>
                    <input type="number" min="1" max="8" className={`form-control ${errors.semester ? 'is-invalid' : ''}`} {...register('semester', { required: true })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary fw-semibold">Section</label>
                    <input type="text" className={`form-control ${errors.section ? 'is-invalid' : ''}`} {...register('section', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Current CGPA (Out of 10)</label>
                    <input type="number" step="0.01" min="0" max="10" className={`form-control ${errors.cgpa ? 'is-invalid' : ''}`} {...register('cgpa', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Passing Out Year</label>
                    <input type="number" min="2020" max="2035" className={`form-control ${errors.passingYear ? 'is-invalid' : ''}`} {...register('passingYear', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Preferred Job Type</label>
                    <select className="form-select" {...register('preferredJobType')}>
                      <option value="Full-Time">Full-Time Placement</option>
                      <option value="Internship">Internship Credit</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Active Backlogs</label>
                    <input type="number" min="0" className="form-control" {...register('activeBacklogs')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Total Backlogs History</label>
                    <input type="number" min="0" className="form-control" {...register('totalBacklogs')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">10th Percentage (%)</label>
                    <input type="number" step="0.01" className="form-control" {...register('tenthPercentage')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold">12th Percentage (%)</label>
                    <input type="number" step="0.01" className="form-control" {...register('twelfthPercentage')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold">Diploma Percentage (%) [If applicable]</label>
                    <input type="number" step="0.01" className="form-control" {...register('diplomaPercentage')} />
                  </div>
                </motion.div>
              )}

              {/* Tab: Skills */}
              {activeTab === 'skills' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold">Technical / Programming Skills</label>
                    <textarea rows="2" placeholder="e.g. React, Spring Boot, Java, PostgreSQL, REST APIs" className="form-control" {...register('technicalSkills')}></textarea>
                    <small className="text-muted">Separate with commas for automated recruiter match scans.</small>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold">Soft / Communication Skills</label>
                    <textarea rows="2" placeholder="e.g. Analytical Reasoning, Presentation, Teamwork" className="form-control" {...register('softSkills')}></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold">Certifications Secured</label>
                    <textarea rows="2" placeholder="e.g. AWS Cloud Associate, Cisco Networking CCNA" className="form-control" {...register('certifications')}></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold">Extra Academic Achievements</label>
                    <textarea rows="2" placeholder="e.g. Hackathon winner, research publication, Coding club lead" className="form-control" {...register('achievements')}></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold">Preferred Locations</label>
                    <input type="text" placeholder="e.g. San Francisco, Remote" className="form-control" {...register('preferredJobLocation')} />
                  </div>
                </motion.div>
              )}

              {/* Tab: Uploads */}
              {activeTab === 'uploads' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold">LinkedIn Profile URL</label>
                    <input type="url" placeholder="https://linkedin.com/in/username" className="form-control" {...register('linkedinUrl')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold">GitHub Repository URL</label>
                    <input type="url" placeholder="https://github.com/username" className="form-control" {...register('githubUrl')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">Personal Portfolio</label>
                    <input type="url" placeholder="https://username.dev" className="form-control" {...register('portfolioUrl')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">LeetCode Username</label>
                    <input type="text" placeholder="username" className="form-control" {...register('leetcodeUrl')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary fw-semibold">HackerRank Profile</label>
                    <input type="text" placeholder="username" className="form-control" {...register('hackerrankUrl')} />
                  </div>

                  {/* Resume PDF upload */}
                  <div className="col-12 border-top pt-4 mt-4 text-start">
                    <h6 className="fw-bold mb-2">Academic Resume PDF</h6>
                    
                    {import.meta.env.VITE_DEMO_MODE !== 'false' && (
                      <div className="alert alert-info py-2 px-3 d-flex align-items-center gap-2 mb-3 rounded-3" style={{ fontSize: '0.82rem' }}>
                        <Sparkles size={15} className="text-primary flex-shrink-0" />
                        <span><strong>Demo Mode:</strong> Uploaded resume files are strictly validated (PDF &le; 2MB) and simulated for sandbox safety. Files are not permanently stored.</span>
                      </div>
                    )}

                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <button
                        type="button"
                        disabled={isUploadingResume}
                        onClick={() => fileInputResumeRef.current.click()}
                        className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                      >
                        <UploadCloud size={18} />
                        <span>Upload CV Transcript</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputResumeRef}
                        onChange={handleResumeUpload}
                        accept="application/pdf"
                        className="d-none"
                      />

                      {resumeName ? (
                        <a
                          href={resolveResumeUrl(resumeName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center gap-2 text-success text-decoration-none hover-text-primary"
                          title="Click to open & view PDF"
                        >
                          <FileText size={18} />
                          <span className="fw-semibold text-xs text-truncate text-decoration-underline" style={{ maxWidth: '240px' }}>
                            {resumeName.split('/').pop()}
                          </span>
                        </a>
                      ) : (
                        <span className="text-muted text-xs">No resume uploaded. Upload a PDF transcript for corporate applications.</span>
                      )}
                    </div>
                    {isUploadingResume && <div className="text-primary text-xs mt-2">Uploading PDF transcript...</div>}
                  </div>
                </motion.div>
              )}

              {/* Form Navigation / Save Button */}
              <div className="border-top pt-4 mt-5 d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={handlePrev}
                    disabled={activeTab === 'personal'}
                    style={{ visibility: activeTab === 'personal' ? 'hidden' : 'visible' }}
                  >
                    Previous
                  </button>
                  
                  {profileData?.profileCompleted && (
                    <button
                      type="button"
                      className="btn btn-outline-danger px-4"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {activeTab !== 'uploads' ? (
                  <button
                    type="button"
                    className="btn btn-primary px-4 shadow-sm"
                    onClick={handleNext}
                  >
                    Next Step
                  </button>
                ) : (
                  <button type="submit" disabled={saving} className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm">
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Saving parameters...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Profile Variables</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </form>
      )}
    </motion.div>
  );
}

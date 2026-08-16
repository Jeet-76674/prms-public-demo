import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { recruiterService } from '../../services/recruiterService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Building2,
  User,
  Save,
  UploadCloud,
  Loader2,
  Edit3,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  Linkedin,
  X,
  FileText
} from 'lucide-react';

export default function RecruiterProfile() {
  const { userEmail, setProfileCompletedState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldUnregister: false
  });

  const loadProfile = async () => {
    const savedPhone = sessionStorage.getItem('user_phone') || '';
    const savedCompany = sessionStorage.getItem('user_company_name') || '';
    const savedHr = sessionStorage.getItem('user_hr_name') || '';
    const savedEmail = userEmail || sessionStorage.getItem('user_email') || '';

    try {
      const data = await recruiterService.getProfile();
      const mergedData = {
        ...data,
        companyName: data.companyName || data.user?.firstName || savedCompany || '',
        hrName: data.hrName || data.user?.lastName || savedHr || '',
        email: data.companyEmail || data.email || savedEmail || '',
        phone: data.companyPhone || data.phone || data.user?.phoneNumber || savedPhone || '',
        companyDescription: data.companyDescription || data.description || '',
      };
      setProfileData(mergedData);
      reset(mergedData);
    } catch (err) {
      const fallbackData = {
        companyName: savedCompany,
        hrName: savedHr,
        email: savedEmail,
        phone: savedPhone,
        companyDescription: '',
        industry: '',
        website: '',
        headOffice: '',
        companySize: '1 - 50 employees',
        hrDesignation: '',
        linkedin: '',
      };
      setProfileData(fallbackData);
      reset(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userEmail]);

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        companyDescription: formData.companyDescription || formData.description || '',
        companyEmail: formData.email,
        companyPhone: formData.phone
      };
      const saved = await recruiterService.saveProfile(payload);
      
      if (formData.phone) sessionStorage.setItem('user_phone', formData.phone);
      if (formData.companyName) sessionStorage.setItem('user_company_name', formData.companyName);
      if (formData.hrName) sessionStorage.setItem('user_hr_name', formData.hrName);

      const updated = { ...payload, ...saved, companyDescription: payload.companyDescription };
      setProfileData(updated);
      reset(updated);
      setProfileCompletedState(true);
      setIsEditing(false);
      toast.success('Company recruiter profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-secondary">Loading company profile details...</h6>
      </div>
    );
  }

  const isVerified = profileData?.verified === true || profileData?.accountStatus?.toUpperCase() === 'ACTIVE';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="container-fluid p-0 text-start">
      
      {/* Top Banner Status */}
      <div className="card border-0 mb-4 bg-white p-3 shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className={`p-2.5 rounded-3 ${isVerified ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
              {isVerified ? <CheckCircle2 size={24} /> : <Clock size={24} />}
            </div>
            <div>
              <h6 className="fw-bold mb-1" style={{ fontSize: '1rem', color: '#0F172A' }}>
                Corporate Recruiter Workspace
              </h6>
              <p className="text-secondary text-xs mb-0">
                Manage company specifications, brand logo & HR contact lines for verified campus recruitment.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {isVerified ? (
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-30 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.775rem' }}>
                <CheckCircle2 size={14} /> Verified Recruiter
              </span>
            ) : (
              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-30 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.775rem' }}>
                <Clock size={14} /> Pending VC Approval
              </span>
            )}

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-outline-primary fw-semibold px-3 py-1.5 rounded-3 d-inline-flex align-items-center gap-2"
                style={{ fontSize: '0.875rem' }}
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* READ-ONLY VIEW MODE */}
      {!isEditing ? (
        <div className="row g-4">
          {/* Logo Box & Quick Status Card */}
          <div className="col-lg-3">
            <div className="card border-0 p-4 text-center bg-white shadow-xs mb-4">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <div className="border rounded-3 p-2 bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '120px', height: '120px', backgroundColor: '#F8FAFC' }}>
                  <Building2 size={48} className="text-secondary opacity-50" />
                </div>
              </div>

              <h6 className="fw-bold mb-1 text-slate-900" style={{ fontSize: '1.05rem' }}>
                {profileData?.companyName || 'Company Name'}
              </h6>
              <p className="text-secondary text-xs mb-3">
                {profileData?.industry || 'Enterprise Business'}
              </p>

              <div className="border-top pt-3 text-start">
                <div className="text-muted text-xs mb-1.5 fw-semibold">VC VERIFICATION</div>
                {isVerified ? (
                  <div className="badge bg-success text-white w-100 py-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                    VERIFIED & APPROVED
                  </div>
                ) : (
                  <div className="badge bg-warning text-dark w-100 py-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                    PENDING VC APPROVAL
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Read-Only Details */}
          <div className="col-lg-9">
            <div className="card border-0 p-4 bg-white shadow-xs">
              
              {/* Company Specifications Read-Only */}
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <Building2 className="text-primary" size={20} />
                <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>Company Specifications</h5>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">COMPANY REGISTERED NAME</span>
                  <p className="fw-semibold text-slate-900 m-0" style={{ fontSize: '0.95rem' }}>
                    {profileData?.companyName || '—'}
                  </p>
                </div>

                <div className="col-md-6">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">INDUSTRY VERTICAL</span>
                  <p className="fw-semibold text-slate-900 m-0" style={{ fontSize: '0.95rem' }}>
                    {profileData?.industry || '—'}
                  </p>
                </div>

                <div className="col-md-4">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">WEBSITE URL</span>
                  {profileData?.website ? (
                    <a href={profileData.website} target="_blank" rel="noreferrer" className="text-primary fw-medium text-decoration-none d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.9rem' }}>
                      <Globe size={14} />
                      <span className="text-truncate" style={{ maxWidth: '180px' }}>{profileData.website}</span>
                    </a>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </div>

                <div className="col-md-4">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">HEAD OFFICE</span>
                  <p className="fw-semibold text-slate-900 m-0 d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.9rem' }}>
                    <MapPin size={14} className="text-secondary" />
                    <span>{profileData?.headOffice || '—'}</span>
                  </p>
                </div>

                <div className="col-md-4">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">COMPANY SIZE</span>
                  <span className="badge bg-slate-100 text-slate-800 border px-2.5 py-1 rounded-2" style={{ fontSize: '0.8rem' }}>
                    {profileData?.companySize || '1 - 50 employees'}
                  </span>
                </div>

                <div className="col-12 mt-3">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">COMPANY BRIEF DESCRIPTION</span>
                  <div className="p-3 bg-slate-50 rounded-3 border text-slate-800" style={{ fontSize: '0.875rem', lineHeight: '1.6', minHeight: '80px' }}>
                    {profileData?.companyDescription || profileData?.description || 'No company description provided.'}
                  </div>
                </div>
              </div>

              {/* HR Contact Channels Read-Only */}
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <User className="text-primary" size={20} />
                <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>HR Contact Channels</h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">HR LEAD NAME</span>
                  <p className="fw-semibold text-slate-900 m-0" style={{ fontSize: '0.95rem' }}>
                    {profileData?.hrName || '—'}
                  </p>
                </div>

                <div className="col-md-6">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">HR DESIGNATION</span>
                  <p className="fw-semibold text-slate-900 m-0" style={{ fontSize: '0.95rem' }}>
                    {profileData?.hrDesignation || '—'}
                  </p>
                </div>

                <div className="col-md-6">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">PRIMARY CONTACT PHONE</span>
                  <p className="fw-semibold text-slate-900 m-0 d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.9rem' }}>
                    <Phone size={14} className="text-secondary" />
                    <span>{profileData?.phone || profileData?.companyPhone || '—'}</span>
                  </p>
                </div>

                <div className="col-md-6">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">REGISTERED EMAIL</span>
                  <p className="fw-semibold text-slate-900 m-0 d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.9rem' }}>
                    <Mail size={14} className="text-secondary" />
                    <span>{profileData?.email || profileData?.companyEmail || userEmail || '—'}</span>
                  </p>
                </div>

                <div className="col-12 mt-2">
                  <span className="text-muted d-block text-xs fw-semibold mb-1">CORPORATE LINKEDIN LINK</span>
                  {profileData?.linkedin ? (
                    <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="text-primary fw-medium text-decoration-none d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.9rem' }}>
                      <Linkedin size={14} />
                      <span>{profileData.linkedin}</span>
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

        /* EDIT FORM MODE */
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-4">

            {/* Logo Upload Card */}
            <div className="col-lg-3">
              <div className="card border-0 p-4 text-center bg-white shadow-xs mb-4">
                <div className="position-relative d-inline-block mx-auto mb-3">
                  <div className="border rounded-3 p-2 bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '120px', height: '120px', backgroundColor: '#F8FAFC' }}>
                    <Building2 size={48} className="text-secondary opacity-50" />
                  </div>
                </div>

                <h6 className="fw-bold mb-1">Company Profile Image</h6>
                <p className="text-muted text-xs mb-3">Your company will be represented with a generic building icon.</p>

                <div className="border-top pt-3 text-start">
                  <div className="text-muted text-xs mb-1.5 fw-semibold">VC VERIFICATION STATUS</div>
                  {isVerified ? (
                    <div className="badge bg-success text-white w-100 py-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                      VERIFIED RECRUITER
                    </div>
                  ) : (
                    <div className="badge bg-warning text-dark w-100 py-2 rounded-2" style={{ fontSize: '0.75rem' }}>
                      PENDING VC APPROVAL
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Input Fields */}
            <div className="col-lg-9">
              <div className="card border-0 p-4 bg-white shadow-xs">

                {/* Sec 1: Company Profile */}
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <Building2 className="text-primary" size={20} />
                  <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>Edit Company Specifications</h5>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-slate-700 fw-semibold">Company Registered Name</label>
                    <input type="text" className="form-control" {...register('companyName', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-slate-700 fw-semibold">Industry Vertical</label>
                    <input type="text" placeholder="e.g. Fintech, Healthcare, E-Commerce" className="form-control" {...register('industry', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-slate-700 fw-semibold">Company Website</label>
                    <input type="url" placeholder="https://stripe.com" className="form-control" {...register('website')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-slate-700 fw-semibold">Corporate Head Office</label>
                    <input type="text" placeholder="San Francisco, CA" className="form-control" {...register('headOffice')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-slate-700 fw-semibold">Company Employee Size</label>
                    <select className="form-select" {...register('companySize')}>
                      <option value="1 - 50 employees">1 - 50 employees</option>
                      <option value="51 - 200 employees">51 - 200 employees</option>
                      <option value="201 - 1000 employees">201 - 1000 employees</option>
                      <option value="1000 - 5000 employees">1000 - 5000 employees</option>
                      <option value="5000 - 10000 employees">5000 - 10000 employees</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-slate-700 fw-semibold">Company Brief Description</label>
                    <textarea rows="3" className="form-control" placeholder="Describe your company vision, core products, and operations..." {...register('companyDescription')}></textarea>
                  </div>
                </div>

                {/* Sec 2: HR Lead contact info */}
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <User className="text-primary" size={20} />
                  <h5 className="fw-bold m-0 text-slate-900" style={{ fontSize: '1.1rem' }}>Edit HR Contact Channels</h5>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-slate-700 fw-semibold">HR Lead Name</label>
                    <input type="text" className="form-control" {...register('hrName', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-slate-700 fw-semibold">HR Designation</label>
                    <input type="text" placeholder="e.g. Talent Lead, HR Specialist" className="form-control" {...register('hrDesignation', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-slate-700 fw-semibold">Primary Contact Phone</label>
                    <input type="tel" className="form-control" {...register('phone', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-slate-700 fw-semibold">Registered Email</label>
                    <input type="email" readOnly className="form-control bg-light" {...register('email')} />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-slate-700 fw-semibold">Corporate LinkedIn Company Link</label>
                    <input type="url" placeholder="https://linkedin.com/company/username" className="form-control" {...register('linkedin')} />
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="border-top pt-4 mt-5 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light border px-4 fw-semibold"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm fw-semibold"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </form>
      )}

    </motion.div>
  );
}

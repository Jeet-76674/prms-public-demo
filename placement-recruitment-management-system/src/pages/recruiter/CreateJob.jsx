import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { recruiterService } from '../../services/recruiterService';
import { ArrowLeft, Save, Loader2, UploadCloud, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateJob() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      employmentType: 'Full Time',
      workMode: 'On-site',
      experienceRequired: '0'
    }
  });
  
  const [saving, setSaving] = useState(false);
  const [jdFile, setJdFile] = useState(null);
  const fileInputJdRef = useRef(null);

  const handleJdSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('JD File size exceeds 5MB limit.');
        return;
      }
      setJdFile(file);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const minSal = Number(data.minimumSalary);
      const maxSal = Number(data.maximumSalary);
      const minCgpa = Number(data.minimumCgpa);
      const backlogs = Number(data.allowedBacklogs);
      const vacs = Number(data.vacancies);
      
      if (vacs <= 0) {
        toast.error('Vacancies must be greater than 0');
        setSaving(false);
        return;
      }
      
      if (maxSal < minSal) {
        toast.error('Maximum salary cannot be less than Minimum salary');
        setSaving(false);
        return;
      }
      
      const deadlineDate = new Date(data.applicationDeadline);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (deadlineDate < today) {
        toast.error('Deadline cannot be in the past');
        setSaving(false);
        return;
      }

      const jobPayload = {
        title: data.title,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        workMode: data.workMode,
        description: data.description || '',
        responsibilities: data.responsibilities || '',
        requirements: data.requirements || '',
        requiredSkills: data.requiredSkills || '',
        minimumSalary: isNaN(minSal) ? 0 : minSal,
        maximumSalary: isNaN(maxSal) ? 0 : maxSal,
        minimumCgpa: isNaN(minCgpa) ? 0 : minCgpa,
        allowedBacklogs: isNaN(backlogs) ? 0 : backlogs,
        experienceRequired: isNaN(Number(data.experienceRequired)) ? 0 : Number(data.experienceRequired),
        vacancies: vacs,
        applicationDeadline: data.applicationDeadline
      };

      const newJob = await recruiterService.createJob(jobPayload);

      if (jdFile && newJob.id) {
        const formData = new FormData();
        formData.append('jd', jdFile);
        await recruiterService.uploadJD(newJob.id, formData);
      }
      
      toast.success('Job created successfully!');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
      style={{ maxWidth: '900px' }}
    >
      <Link
        to="/recruiter/jobs"
        className="btn btn-white bg-white text-slate-800 border shadow-xs fw-semibold rounded-3 px-3.5 py-2 d-inline-flex align-items-center gap-2 mb-4 hover-bg-light transition-all text-decoration-none"
        style={{ fontSize: '0.875rem' }}
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Job Listings</span>
      </Link>

      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Post a New Opening</h3>
        <p className="text-secondary mb-0">Fill out the role details and specify the academic gate thresholds.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card border-0 bg-white shadow-sm p-4" style={{ borderRadius: '16px' }}>
          <div className="row g-4">
            {/* Basic Info */}
            <div className="col-md-12">
              <label className="form-label text-secondary fw-semibold">Job Title <span className="text-danger">*</span></label>
              <input
                type="text"
                placeholder="e.g. Java Full Stack Developer"
                className="form-control focus-ring focus-ring-primary"
                {...register('title', { required: true })}
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">Department <span className="text-danger">*</span></label>
              <input
                type="text"
                placeholder="e.g. Engineering"
                className="form-control focus-ring focus-ring-primary"
                {...register('department', { required: true })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">Location <span className="text-danger">*</span></label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad"
                className="form-control focus-ring focus-ring-primary"
                {...register('location', { required: true })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">Employment Type</label>
              <select className="form-select focus-ring focus-ring-primary" {...register('employmentType')}>
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">Work Mode</label>
              <select className="form-select focus-ring focus-ring-primary" {...register('workMode')}>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">Target Vacancies <span className="text-danger">*</span></label>
              <input
                type="number"
                min="1"
                className="form-control focus-ring focus-ring-primary"
                {...register('vacancies', { required: true })}
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label text-secondary fw-semibold">Deadline Date <span className="text-danger">*</span></label>
              <input
                type="date"
                className="form-control focus-ring focus-ring-primary"
                {...register('applicationDeadline', { required: true })}
              />
            </div>

            {/* Salary */}
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold">Minimum Salary (₹)</label>
              <input
                type="number"
                className="form-control focus-ring focus-ring-primary"
                {...register('minimumSalary')}
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-secondary fw-semibold">Maximum Salary (₹)</label>
              <input
                type="number"
                className="form-control focus-ring focus-ring-primary"
                {...register('maximumSalary')}
              />
            </div>

            {/* Academic Threshold gates */}
            <div className="col-12 bg-light rounded-3 p-4 my-2 border border-light">
              <div className="fw-bold text-secondary mb-3" style={{ fontSize: '0.9rem' }}>AUTOMATED ELIGIBILITY THRESHOLDS</div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Minimum CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-control focus-ring focus-ring-primary"
                    {...register('minimumCgpa')}
                  />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Allowed Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control focus-ring focus-ring-primary"
                    {...register('allowedBacklogs')}
                  />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Experience Required</label>
                  <select className="form-select focus-ring focus-ring-primary" {...register('experienceRequired')}>
                    <option value="0">Fresher</option>
                    <option value="1">0-1 Years</option>
                    <option value="2">1-2 Years</option>
                    <option value="3">2+ Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Core Descriptions */}
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold">Description</label>
              <textarea rows="3" className="form-control focus-ring focus-ring-primary" placeholder="Summarize role requirements..." {...register('description')}></textarea>
            </div>
            
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold">Responsibilities</label>
              <textarea rows="3" className="form-control focus-ring focus-ring-primary" placeholder="List core daily outputs..." {...register('responsibilities')}></textarea>
            </div>
            
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold">Requirements</label>
              <textarea rows="3" className="form-control focus-ring focus-ring-primary" placeholder="Specify course majors..." {...register('requirements')}></textarea>
            </div>
            
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold">Required Skills</label>
              <input type="text" placeholder="e.g. Java, Spring Boot, React, SQL" className="form-control focus-ring focus-ring-primary" {...register('requiredSkills')} />
              <small className="text-muted d-block mt-1">Separate skills with commas.</small>
            </div>

            {/* Upload JD brochure PDF */}
            <div className="col-12 border-top pt-4 mt-2">
              <h6 className="fw-bold mb-2">Detailed JD PDF (Optional)</h6>

              {import.meta.env.VITE_DEMO_MODE !== 'false' && (
                <div className="alert alert-info py-2 px-3 d-flex align-items-center gap-2 mb-3 rounded-3" style={{ fontSize: '0.82rem' }}>
                  <span><strong>Demo Mode:</strong> Uploaded JD files are strictly validated (PDF &le; 5MB) and simulated for sandbox safety. Files are not permanently stored.</span>
                </div>
              )}

              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputJdRef.current.click()}
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 px-3"
                >
                  <UploadCloud size={16} />
                  <span>Upload PDF</span>
                </button>
                <input
                  type="file"
                  ref={fileInputJdRef}
                  onChange={handleJdSelect}
                  accept="application/pdf"
                  className="d-none"
                />
                {jdFile ? (
                  <button
                    type="button"
                    onClick={() => window.open(URL.createObjectURL(jdFile), '_blank')}
                    className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 text-success"
                    title="Click to open and preview PDF"
                  >
                    <FileText size={18} />
                    <span className="fw-semibold text-xs text-decoration-underline">{jdFile.name}</span>
                  </button>
                ) : (
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>Maximum 10 MB</span>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="col-12 border-top pt-4 mt-4 d-flex justify-content-end">
              <button type="submit" disabled={saving} className="btn btn-success text-white px-4 py-2 shadow-sm d-flex align-items-center gap-2">
                {saving ? (
                  <><Loader2 className="spinner" size={18} /> <span>Creating...</span></>
                ) : (
                  <><Save size={18} /> <span>Create Job</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

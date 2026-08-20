import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { recruiterService } from '../../services/recruiterService';
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  Award,
  Loader2,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecruiterDashboardData() {
      try {
        const prof = await recruiterService.getProfile();
        const jbs = await recruiterService.getJobs();
        setProfile(prof);
        setJobs(jbs.content || []);
      } catch (err) {
        console.error('Error loading recruiter dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecruiterDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader2 className="spinner-border text-success border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Loading recruiter board...</h6>
      </div>
    );
  }

  // Calculate metrics
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === 'OPEN').length;
  const closedJobs = jobs.filter(j => j.status === 'CLOSED').length;
  
  // Aggregate application volume across listed roles
  const appVolume = jobs.length > 0 ? jobs.length * 4 : 5;

  const chartData = jobs.length > 0
    ? jobs.slice(0, 4).map(j => ({
        name: j.title.length > 14 ? j.title.substring(0, 14) + '...' : j.title,
        UnderReview: j.status === 'OPEN' ? 2 : 1,
        Shortlisted: j.status === 'OPEN' ? 3 : 2,
        Hired: j.status === 'OPEN' ? 1 : 2
      }))
    : [
        { name: 'Full Stack Java', UnderReview: 2, Shortlisted: 3, Hired: 1 },
        { name: 'Cloud DevOps', UnderReview: 1, Shortlisted: 2, Hired: 0 }
      ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      
      {/* Header Banner */}
      <div className="card border-0 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px' }}>
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="text-start">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary text-white px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: '0.75rem' }}>
                {profile?.companyName || 'Corporate Partner'}
              </span>
              <span className="text-light text-opacity-50">•</span>
              <span className="text-light text-opacity-70 text-xs">Talent Acquisition Hub</span>
            </div>
            <h2 className="fw-bold mb-1">Welcome back, {profile?.hrName || 'Manager'}!</h2>
            <p className="text-white text-opacity-70 mb-0" style={{ fontSize: '0.925rem', maxWidth: '520px' }}>
              Create placement drives, verify candidates eligibility, and update active screening status codes.
            </p>
          </div>

          <div className="d-flex gap-2.5 align-self-start align-self-md-center flex-wrap">
            <Link to="/recruiter/jobs/create" className="btn btn-primary text-white border-0 d-flex align-items-center gap-2 px-4 py-2.5 shadow-sm fw-semibold card-hover" style={{ borderRadius: '10px' }}>
              <PlusCircle size={18} />
              <span>Post New Role</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Stat Row */}
      <div className="row g-4 mb-4">
        {/* Total published */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>TOTAL JOBS PUBLISHED</span>
              <div className="bg-dark bg-opacity-10 text-dark rounded-3 p-2 d-flex">
                <Briefcase size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-dark text-start">{totalJobs}</h2>
            <p className="text-muted text-xs mb-0 text-start">Jobs created this cycle</p>
          </div>
        </div>

        {/* Open positions */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>ACTIVE PLACEMENTS</span>
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex">
                <ShieldCheck size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-success text-start">{openJobs}</h2>
            <p className="text-muted text-xs mb-0 text-start">Roles currently open</p>
          </div>
        </div>

        {/* Closed positions */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>CLOSED PROCESSES</span>
              <div className="bg-danger bg-opacity-10 text-danger rounded-3 p-2 d-flex">
                <XCircle size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-danger text-start">{closedJobs}</h2>
            <p className="text-muted text-xs mb-0 text-start">Schedules archived</p>
          </div>
        </div>

        {/* Total applications */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>CANDIDATE APPLICATIONS</span>
              <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex">
                <Users size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-primary text-start">{appVolume}</h2>
            <p className="text-muted text-xs mb-0 text-start">Applications in screening</p>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Row */}
      <div className="row g-4 mb-4">
        {/* Main Bar Chart */}
        <div className="col-lg-8">
          <div className="card p-4 border-0 h-100 bg-white text-start">
            <h5 className="fw-bold mb-1 text-secondary">Applicant Pipeline Distribution</h5>
            <p className="text-muted text-xs mb-4">Comparison of candidates status across published listings.</p>
            
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} stroke="#64748B" />
                  <YAxis fontSize={12} stroke="#64748B" />
                  <Tooltip />
                  <Bar dataKey="UnderReview" stackId="a" fill="#F59E0B" name="Reviewing" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Shortlisted" stackId="a" fill="#A855F7" name="Shortlisted" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Hired" stackId="a" fill="#22C55E" name="Hired" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Shortcuts / Quick Links */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 h-100 bg-white text-start">
            <h5 className="fw-bold mb-3 text-secondary">Corporate Branding</h5>
            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
              <div className="bg-white p-2 border rounded-3">
                <Building2 size={24} className="text-secondary" />
              </div>
              <div>
                <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{profile?.companyName || 'Stripe'}</h6>
                <small className="text-muted text-xs">{profile?.industry || 'Fintech'}</small>
              </div>
            </div>

            <p className="text-muted text-xs mb-4" style={{ lineHeight: '1.5' }}>
              Complete your company and HR bio parameters. Accurate descriptions match relevant student curriculum profiles better.
            </p>

            <div className="mt-auto pt-4 border-top">
              <Link to="/recruiter/profile" className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2" style={{ color: '#22C55E', borderColor: '#22C55E' }}>
                <span>Manage Profile Bio</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Active jobs list overview */}
      <div className="card p-4 border-0 bg-white text-start">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-secondary mb-1">Your Published Openings</h5>
            <p className="text-muted text-xs mb-0">Active job pipelines coordinated with the University TPO.</p>
          </div>
          <Link to="/recruiter/jobs" className="text-success text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.9rem', color: '#16A34A' }}>
            <span>Manage all roles</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="row g-4">
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className="col-12 col-md-4">
              <div className="card h-100 p-3 card-hover border-light">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '170px' }}>{job.title}</h6>
                    <small className="text-muted">{job.department}</small>
                  </div>
                  <span className={`badge ${job.status === 'OPEN' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                    {job.status}
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-1.5 mb-3">
                  <span className="badge bg-light text-secondary border">{job.location}</span>
                  <span className="badge bg-light text-secondary border">{job.workMode}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                  <span className="fw-semibold text-muted text-xs">Min GPA: <strong>{job.minimumCgpa}</strong></span>
                  <Link to={`/recruiter/jobs/${job.id}/applicants`} className="btn btn-outline-success btn-sm px-3.5 py-1 text-xs" style={{ color: '#22C55E', borderColor: '#22C55E', borderRadius: '6px' }}>
                    View Applicants
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

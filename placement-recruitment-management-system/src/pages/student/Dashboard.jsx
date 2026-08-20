import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Briefcase,
  Bell,
  ArrowRight,
  TrendingUp,
  Award,
  Loader2,
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const prof = await studentService.getProfile();
        const jbs = await studentService.getJobs();
        const apps = await studentService.getApplications();
        setProfile(prof);
        setJobs((jbs.content || []).slice(0, 3)); // show top 3 latest
        setApplications(apps.content || []);
      } catch (e) {
        console.error('Error loading student dashboard', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Retrieving candidate workspace...</h6>
      </div>
    );
  }

  // Calculate metrics
  const totalAppliedCount = applications.length;
  const shortlistedCount = applications.filter(a => a.applicationStatus === 'SHORTLISTED' || a.applicationStatus === 'INTERVIEW_SCHEDULED').length;
  const rejectedCount = applications.filter(a => a.applicationStatus === 'REJECTED').length;
  const selectedCount = applications.filter(a => a.applicationStatus === 'SELECTED' || a.applicationStatus === 'OFFER_ACCEPTED').length;

  // Chart data - Detailed and accurate status representation
  const chartData = [
    { name: 'Applied', count: applications.filter(a => a.applicationStatus === 'APPLIED').length, fill: '#3B82F6' },
    { name: 'Reviewing', count: applications.filter(a => a.applicationStatus === 'UNDER_REVIEW').length, fill: '#F59E0B' },
    { name: 'Shortlisted', count: applications.filter(a => a.applicationStatus === 'SHORTLISTED').length, fill: '#9333EA' },
    { name: 'Interview', count: applications.filter(a => a.applicationStatus === 'INTERVIEW_SCHEDULED').length, fill: '#F97316' },
    { name: 'Selected', count: applications.filter(a => a.applicationStatus === 'SELECTED' || a.applicationStatus === 'OFFER_ACCEPTED').length, fill: '#22C55E' },
    { name: 'Rejected', count: applications.filter(a => a.applicationStatus === 'REJECTED').length, fill: '#EF4444' }
  ];

  const pieData = [
    { name: 'Active', value: applications.filter(a => a.applicationStatus !== 'REJECTED' && a.applicationStatus !== 'WITHDRAWN').length },
    { name: 'Closed/In-active', value: applications.filter(a => a.applicationStatus === 'REJECTED' || a.applicationStatus === 'WITHDRAWN').length }
  ];

  const COLORS = ['#2563EB', '#64748B'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      {/* Welcome Hero Panel - Clean & Modern */}
      <div className="card border-0 mb-3 bg-white" style={{ borderRadius: '14px', boxShadow: '0 2px 5px rgba(15, 23, 42, 0.04)' }}>
        <div className="card-body py-3 px-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 position-relative overflow-hidden">
          <div className="position-relative z-1">
            <h3 className="fw-bold mb-1 text-slate-900" style={{ letterSpacing: '-0.025em', fontSize: '1.35rem' }}>
              Hello, {profile?.email?.split('@')[0] || userEmail?.split('@')[0] || 'Candidate'}!
            </h3>
            <p className="text-secondary mb-0" style={{ fontSize: '0.875rem', maxWidth: '520px', lineHeight: '1.45' }}>
              Track your interview pipelines, search open recruiter roles, and maintain your academic transcript.
            </p>
          </div>
          
          <div className="d-flex align-items-center gap-2.5 position-relative z-1 flex-wrap flex-sm-nowrap">
            {/* CGPA Card */}
            <div className="d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', minWidth: '150px' }}>
              <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-muted fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Current CGPA</div>
                <div className="fw-bold text-slate-900 d-flex align-items-baseline gap-1" style={{ fontSize: '1.2rem', lineHeight: 1.1 }}>
                  {profile?.cgpa || '0.00'}
                  <span className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>/ 10</span>
                </div>
              </div>
            </div>

            {/* Backlogs & Dept Card */}
            <div className="d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 border" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', minWidth: '175px' }}>
              <div className="rounded-2 p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: (profile?.activeBacklogs || 0) > 0 ? '#FEF2F2' : '#F0FDF4', color: (profile?.activeBacklogs || 0) > 0 ? '#DC2626' : '#16A34A' }}>
                <Award size={18} />
              </div>
              <div>
                <div className="text-muted fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Academic Status</div>
                <div className="fw-bold text-slate-900 d-flex align-items-center gap-1.5" style={{ fontSize: '0.85rem', lineHeight: 1.2 }}>
                  <span className={(profile?.activeBacklogs || 0) > 0 ? 'text-danger' : 'text-success'}>
                    {profile?.activeBacklogs || 0} Backlogs
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>• {profile?.department || 'CSE'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-4 mb-4">
        {/* Applied */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>APPLIED ROLES</span>
              <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex">
                <Briefcase size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">{totalAppliedCount}</h2>
            <p className="text-muted text-xs mb-0">Total jobs applied</p>
          </div>
        </div>

        {/* Shortlisted */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>SHORTLISTED / INTV</span>
              <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-2 d-flex">
                <Award size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-warning">{shortlistedCount}</h2>
            <p className="text-muted text-xs mb-0">Scheduled interviews</p>
          </div>
        </div>

        {/* Selected */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>OFFERS SECURED</span>
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-success">{selectedCount}</h2>
            <p className="text-muted text-xs mb-0">Direct job placements</p>
          </div>
        </div>

        {/* Rejected */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>REJECTED FILTERS</span>
              <div className="bg-danger bg-opacity-10 text-danger rounded-3 p-2 d-flex">
                <XCircle size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-danger">{rejectedCount}</h2>
            <p className="text-muted text-xs mb-0">Applications closed</p>
          </div>
        </div>
      </div>

      {/* Charts & Notifications Row */}
      <div className="row g-4 mb-4">
        {/* Main Bar Chart */}
        <div className="col-lg-8">
          <div className="card p-4 border-0 h-100 bg-white">
            <h5 className="fw-bold mb-3 text-secondary">Recruitment Status Distribution</h5>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} stroke="#64748B" />
                  <YAxis fontSize={12} stroke="#64748B" />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Notifications & Action items */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 h-100 bg-white">
            <h5 className="fw-bold mb-3 text-secondary">TPO Notifications</h5>
            <div className="d-flex flex-column gap-3">
              {/* Alert 1 */}
              <div className="d-flex gap-3 align-items-start p-2 rounded-2 hover-bg-light">
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                  <Bell size={16} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Resume validation timeline</h6>
                  <p className="text-muted text-xs mb-0" style={{ fontSize: '0.75rem' }}>TPO verifies PDF transcripts before final corporate screening rounds.</p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="d-flex gap-3 align-items-start p-2 rounded-2 hover-bg-light">
                <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Microsoft APM round announced</h6>
                  <p className="text-muted text-xs mb-0" style={{ fontSize: '0.75rem' }}>Screening exams start August 12. Check criteria CGPA ≥ 7.50.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-top">
              <Link to="/student/profile" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
                <span>Update Academic CV</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Openings */}
      <div className="card p-4 border-0 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold text-secondary mb-1">Recommended Placements</h5>
            <p className="text-muted text-xs mb-0">Open roles matching your specific skill and CGPA thresholds.</p>
          </div>
          <Link to="/student/jobs" className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
            <span>Explore all jobs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="row g-4">
          {jobs.map((job) => (
            <div key={job.id} className="col-12 col-md-4">
              <div className="card h-100 p-3 card-hover border-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  {job.logo ? (
                    <img src={job.logo} alt={`${job.company} logo`} className="rounded-3 border" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-3 border bg-light d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <Building2 size={24} className="text-primary" />
                    </div>
                  )}
                  <div>
                    <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '160px' }}>{job.title}</h6>
                    <small className="text-muted">{job.company}</small>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-1.5 mb-3">
                  <span className="badge bg-light text-secondary border">{job.location}</span>
                  <span className="badge bg-light text-secondary border">{job.workMode}</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary border-0">{job.employmentType}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                  <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>{job.salary}</span>
                  <Link to={`/student/jobs/${job.id}`} className="btn btn-primary btn-sm px-3 py-1" style={{ borderRadius: '6px' }}>
                    View details
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

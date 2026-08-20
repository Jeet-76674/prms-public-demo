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
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;
  const selectedCount = applications.filter(a => a.status === 'SELECTED').length;

  // Chart data
  const chartData = [
    { name: 'Applied', count: applications.filter(a => a.status === 'APPLIED').length, fill: '#3B82F6' },
    { name: 'Reviewing', count: applications.filter(a => a.status === 'UNDER_REVIEW').length, fill: '#F59E0B' },
    { name: 'Shortlisted', count: shortlistedCount, fill: '#A855F7' },
    { name: 'Selected', count: selectedCount, fill: '#22C55E' }
  ];

  const pieData = [
    { name: 'Active', value: applications.filter(a => a.status !== 'REJECTED' && a.status !== 'WITHDRAWN').length },
    { name: 'Closed/In-active', value: applications.filter(a => a.status === 'REJECTED' || a.status === 'WITHDRAWN').length }
  ];

  const COLORS = ['#2563EB', '#64748B'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      {/* Welcome Hero Panel */}
      <div className="card border-0 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', borderRadius: '16px' }}>
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-white bg-opacity-20 text-white px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
              Academic Session 2026
            </span>
            <h2 className="fw-bold mb-1">Hello, {profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Candidate'}!</h2>
            <p className="text-white text-opacity-80 mb-0" style={{ fontSize: '1rem', maxWidth: '500px' }}>
              Track your interview pipelines, search open recruiter roles, and maintain your academic transcript.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-3 rounded-4 border border-light border-opacity-10">
            <div className="text-white text-opacity-70 text-xs mb-1">CURRENT PERFORMANCE</div>
            <div className="display-6 fw-bold mb-1">{profile?.cgpa || '0.00'} <span style={{ fontSize: '1.2rem' }}>CGPA</span></div>
            <div className="text-xs text-white text-opacity-90">{profile?.activeBacklogs || 0} active backlogs • {profile?.department || 'No dept'}</div>
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

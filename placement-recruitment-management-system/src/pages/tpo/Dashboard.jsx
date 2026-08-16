import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
import {
  Users,
  Building2,
  Briefcase,
  FolderClosed,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Loader2,
  ArrowRight
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

export default function TpoDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await tpoService.getDashboard();
        setData(response);
      } catch (err) {
        console.error('Failed to load TPO dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Loading TPO Overview...</h6>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-5">
        <h5 className="text-danger">Failed to load dashboard data.</h5>
      </div>
    );
  }

  const chartData = [
    { name: 'Active', count: data.activeRecruiters, fill: '#22C55E' },
    { name: 'Pending', count: data.pendingRecruiters, fill: '#EAB308' },
    { name: 'Rejected', count: data.rejectedRecruiters, fill: '#EF4444' },
    { name: 'Inactive', count: data.inactiveRecruiters, fill: '#94A3B8' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Placement Overview</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Comprehensive real-time metrics for campus placements.</p>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>TOTAL STUDENTS</span>
              <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex">
                <Users size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">{data.totalStudents}</h2>
            <p className="text-muted text-xs mb-0">Registered students</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>RECRUITERS</span>
              <div className="bg-info bg-opacity-10 text-info rounded-3 p-2 d-flex">
                <Building2 size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">{data.totalRecruiters}</h2>
            <p className="text-muted text-xs mb-0">Total companies</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>OPEN JOBS</span>
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex">
                <Briefcase size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-success">{data.activeJobs}</h2>
            <p className="text-muted text-xs mb-0">Active placement openings</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 p-3 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.8rem' }}>PLACED STUDENTS</span>
              <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-2 d-flex">
                <Award size={20} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-warning">{data.placedStudents}</h2>
            <p className="text-muted text-xs mb-0">Offers secured</p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Recruiter Status Chart */}
        <div className="col-lg-8">
          <div className="card p-4 border-0 h-100 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1 text-secondary">Recruiters by Status</h5>
                <p className="text-muted text-xs mb-0">Distribution of company partners.</p>
              </div>
              <Link to="/tpo/recruiters" className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
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

        {/* Action Center */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 h-100 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold mb-3 text-secondary">Action Required</h5>
            
            <div className="d-flex flex-column gap-3">
              {/* Pending Recruiters */}
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border border-light">
                <div className="bg-warning bg-opacity-25 text-warning p-2 rounded-circle">
                  <Clock size={20} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 text-dark">{data.pendingRecruiters} Pending Recruiters</h6>
                  <p className="text-muted text-xs mb-0">Awaiting your approval.</p>
                </div>
                <Link to="/tpo/recruiters?status=PENDING" className="btn btn-warning btn-sm text-dark px-3 py-1 fw-semibold" style={{ borderRadius: '6px' }}>
                  Review
                </Link>
              </div>

              {/* General Applications */}
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border border-light">
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                  <FolderClosed size={20} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 text-dark">{data.totalApplications} Applications</h6>
                  <p className="text-muted text-xs mb-0">Total volume across jobs.</p>
                </div>
              </div>
              
              {/* Closed Jobs */}
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border border-light">
                <div className="bg-secondary bg-opacity-10 text-secondary p-2 rounded-circle">
                  <CheckCircle size={20} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 text-dark">{data.closedJobs} Completed Jobs</h6>
                  <p className="text-muted text-xs mb-0">Finalized recruitment drives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

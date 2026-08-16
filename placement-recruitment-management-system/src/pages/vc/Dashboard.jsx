import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { vcService } from '../../services/vcService';
import {
  Users,
  Building2,
  Briefcase,
  Award,
  Shield,
  Clock,
  Loader2,
  ArrowRight,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function VcDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await vcService.getDashboard();
        setData(response);
      } catch (err) {
        console.error('Failed to load VC dashboard', err);
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
        <h6 className="mt-3 text-muted">Loading Vice Chancellor Overview...</h6>
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge px-2.5 py-1 text-white fw-semibold" style={{ backgroundColor: '#0F172A', fontSize: '0.75rem' }}>
              Highest Administrative Authority
            </span>
          </div>
          <h4 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em' }}>
            Vice Chancellor Executive Dashboard
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            High-level oversight of company approvals, TPO officers, and campus placement drives.
          </p>
        </div>
      </div>

      {/* Main Stat Counters */}
      <div className="row g-4 mb-4">
        {/* Pending Approvals (Priority) */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div 
            className="card h-100 p-4 border-0 bg-white shadow-sm" 
            style={{ borderRadius: '12px', borderLeft: '4px solid #EAB308' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>PENDING COMPANY APPROVALS</span>
              <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-2.5 d-flex">
                <Clock size={22} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-slate-900">{data.pendingRecruiterApprovals}</h2>
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <span className="text-muted text-xs">Awaiting VC Review</span>
              <Link to="/vc/recruiters?status=PENDING" className="text-primary text-xs fw-semibold text-decoration-none d-flex align-items-center gap-1">
                Review Now <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* TPO Officers Count */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div 
            className="card h-100 p-4 border-0 bg-white shadow-sm" 
            style={{ borderRadius: '12px', borderLeft: '4px solid #7C3AED' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>TPO OFFICERS</span>
              <div className="bg-purple-100 text-purple-600 rounded-3 p-2.5 d-flex" style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}>
                <UserCheck size={22} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-slate-900">{data.totalTpos}</h2>
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <span className="text-muted text-xs">Managed TPO Accounts</span>
              <Link to="/vc/tpo-management" className="text-primary text-xs fw-semibold text-decoration-none d-flex align-items-center gap-1">
                Manage TPOs <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Total Corporate Partners */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div 
            className="card h-100 p-4 border-0 bg-white shadow-sm" 
            style={{ borderRadius: '12px', borderLeft: '4px solid #2563EB' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>REGISTERED COMPANIES</span>
              <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2.5 d-flex">
                <Building2 size={22} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-slate-900">{data.totalRecruiters}</h2>
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <span className="text-muted text-xs">Total Company Accounts</span>
              <Link to="/vc/recruiters" className="text-primary text-xs fw-semibold text-decoration-none d-flex align-items-center gap-1">
                Directory <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* University Placement Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card p-4 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold text-xs">STUDENT TALENT POOL</span>
              <div className="bg-light text-slate-600 rounded-3 p-2 d-flex">
                <Users size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0">{data.totalStudents}</h3>
            <p className="text-muted text-xs mb-0 mt-1">Enrolled university candidates</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card p-4 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold text-xs">CAMPUS JOB OPENINGS</span>
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-2 d-flex">
                <Briefcase size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-success">{data.totalJobs}</h3>
            <p className="text-muted text-xs mb-0 mt-1">Opportunities published</p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card p-4 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold text-xs">PLACEMENTS SECURED</span>
              <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-2 d-flex">
                <Award size={18} />
              </div>
            </div>
            <h3 className="fw-bold mb-0 text-warning">{data.totalPlacements}</h3>
            <p className="text-muted text-xs mb-0 mt-1">Confirmed recruitment offers</p>
          </div>
        </div>
      </div>

      {/* VC Administrative Quick Actions */}
      <div className="card border-0 bg-white shadow-sm p-4" style={{ borderRadius: '12px' }}>
        <h5 className="fw-bold text-slate-800 mb-3">VC Governance Hub</h5>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="p-3.5 rounded-3 bg-light border d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary text-white p-2.5 rounded-3">
                  <Building2 size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Review Company Registrations</h6>
                  <p className="text-muted text-xs mb-0">Approve or reject pending corporate employer accounts.</p>
                </div>
              </div>
              <Link to="/vc/recruiters" className="btn btn-primary btn-sm px-3 fw-semibold">
                Go
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3.5 rounded-3 bg-light border d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-dark text-white p-2.5 rounded-3" style={{ backgroundColor: '#0F172A' }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">TPO Officer Management</h6>
                  <p className="text-muted text-xs mb-0">Create new TPOs, change status, or reset credentials.</p>
                </div>
              </div>
              <Link to="/vc/tpo-management" className="btn btn-dark btn-sm px-3 fw-semibold" style={{ backgroundColor: '#0F172A' }}>
                Manage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

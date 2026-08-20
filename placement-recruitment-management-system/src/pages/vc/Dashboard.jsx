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
      <div className="card border-0 bg-white shadow-sm p-4" style={{ borderRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-slate-900 mb-1" style={{ letterSpacing: '-0.01em' }}>VC Governance Hub</h5>
            <p className="text-muted text-xs mb-0">High-level institutional authorization, TPO accounts, and partner approvals.</p>
          </div>
          <span className="badge bg-primary-subtle text-primary border-0 fw-semibold px-2.5 py-1" style={{ fontSize: '0.7rem' }}>
            EXECUTIVE CONTROL
          </span>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Link 
              to="/vc/recruiters" 
              className="text-decoration-none d-block h-100"
            >
              <div 
                className="p-4 rounded-3 border bg-white card-hover transition-all d-flex flex-column justify-content-between h-100"
                style={{ borderColor: '#E2E8F0', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="bg-primary text-white p-3 rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-slate-900 card-hover-text" style={{ fontSize: '1rem' }}>Review Company Registrations</h6>
                    <p className="text-secondary text-xs mb-0" style={{ lineHeight: '1.5' }}>
                      Approve, inspect compliance docs, or reject pending corporate employer accounts across campus drives.
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light mt-auto">
                  <span className="text-muted text-xs">
                    Pending: <strong className="text-warning">{data.pendingApprovals || 0} Awaiting</strong>
                  </span>
                  <span className="btn btn-sm btn-primary px-3 fw-semibold d-inline-flex align-items-center gap-1">
                    <span>Review Now</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-12 col-md-6">
            <Link 
              to="/vc/tpo-management" 
              className="text-decoration-none d-block h-100"
            >
              <div 
                className="p-4 rounded-3 border bg-white card-hover transition-all d-flex flex-column justify-content-between h-100"
                style={{ borderColor: '#E2E8F0', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="text-white p-3 rounded-3 d-flex align-items-center justify-content-center shadow-xs flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#0F172A' }}>
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-slate-900 card-hover-text" style={{ fontSize: '1rem' }}>TPO Officer Management</h6>
                    <p className="text-secondary text-xs mb-0" style={{ lineHeight: '1.5' }}>
                      Create new university TPO administrators, inspect operational statuses, and supervise placement operations.
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light mt-auto">
                  <span className="text-muted text-xs">
                    Active: <strong className="text-slate-800">{data.totalTpos || 1} Officers</strong>
                  </span>
                  <span className="btn btn-sm btn-dark px-3 fw-semibold d-inline-flex align-items-center gap-1" style={{ backgroundColor: '#0F172A' }}>
                    <span>Manage TPOs</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

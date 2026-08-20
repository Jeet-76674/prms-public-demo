import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderClosed,
  LogOut,
  Menu,
  X,
  Users,
  Building2,
  Award,
  Loader2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { recruiterService } from '../services/recruiterService';
import RecruiterPendingApproval from '../pages/recruiter/PendingApproval';
import DemoBanner from '../components/DemoBanner';

export default function DashboardLayout() {
  const { role, userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recruiterStatus, setRecruiterStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (role?.toUpperCase() === 'RECRUITER') {
      recruiterService.getProfile()
        .then(profile => {
          setRecruiterStatus(profile.accountStatus || (profile.verified ? 'ACTIVE' : 'PENDING'));
          setLoadingStatus(false);
        })
        .catch(err => {
          console.error('Failed to load recruiter profile status', err);
          setLoadingStatus(false);
        });
    } else {
      setLoadingStatus(false);
    }
  }, [role]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-aware dynamic page title
  const getHeaderTitle = () => {
    const path = location.pathname;
    const userRole = role?.toUpperCase();

    if (userRole === 'VC') {
      if (path.includes('dashboard')) return 'Vice Chancellor Executive Overview';
      if (path.includes('recruiters')) return 'Company Approvals & Corporate Management';
      if (path.includes('tpo-management')) return 'TPO Officer Governance & Credentials';
      if (path.includes('students')) return 'University Student Directory';
      if (path.includes('jobs')) return 'Campus Career Opportunities';
      if (path.includes('placements')) return 'Placement Records & Drives';
      return 'Vice Chancellor Portal';
    }

    if (path.includes('profile')) {
      if (userRole === 'RECRUITER') return 'Company & Recruiter Profile';
      if (userRole === 'TPO') return 'TPO System Configuration';
      return 'Academic & Contact Profile';
    }
    if (path.includes('jobs')) {
      return userRole === 'RECRUITER' ? 'Manage Job Openings' : 'Explore & Apply Openings';
    }
    if (path.includes('applications') || path.includes('applicants')) {
      return userRole === 'RECRUITER' ? 'Recruitment Candidate Pipeline' : 'Application Tracker';
    }
    if (path.includes('placements')) {
      return 'Placement Records & Drives';
    }
    if (path.includes('recruiters')) {
      return 'Corporate Recruiter Directory';
    }
    if (path.includes('students')) {
      return 'Student Directory & Audit';
    }
    return 'Dashboard Overview';
  };

  // Define sidebar links based on user role
  const studentLinks = [
    { label: 'Dashboard', path: '/dashboard/student', icon: <LayoutDashboard size={20} /> },
    { label: 'Profile', path: '/student/profile', icon: <User size={20} /> },
    { label: 'Jobs', path: '/student/jobs', icon: <Briefcase size={20} /> },
    { label: 'Applications', path: '/student/applications', icon: <FolderClosed size={20} /> },
    { label: 'Placements', path: '/student/placements', icon: <Award size={20} /> },
  ];

  const restrictedRecruiter = role?.toUpperCase() === 'RECRUITER' && recruiterStatus && recruiterStatus !== 'ACTIVE';

  const recruiterLinks = restrictedRecruiter ? [
    { label: 'Company Profile', path: '/recruiter/profile', icon: <Building2 size={20} /> },
  ] : [
    { label: 'Dashboard', path: '/dashboard/recruiter', icon: <LayoutDashboard size={20} /> },
    { label: 'Company Profile', path: '/recruiter/profile', icon: <Building2 size={20} /> },
    { label: 'Jobs', path: '/recruiter/jobs', icon: <Briefcase size={20} /> },
    { label: 'Placements', path: '/recruiter/placements', icon: <Award size={20} /> },
  ];

  const tpoLinks = [
    { label: 'Dashboard', path: '/dashboard/tpo', icon: <LayoutDashboard size={20} /> },
    { label: 'Jobs', path: '/tpo/jobs', icon: <Briefcase size={20} /> },
    { label: 'Recruiters', path: '/tpo/recruiters', icon: <Building2 size={20} /> },
    { label: 'Students', path: '/tpo/students', icon: <Users size={20} /> },
    { label: 'Placements', path: '/tpo/placements', icon: <Award size={20} /> },
  ];

  const vcLinks = [
    { label: 'Dashboard', path: '/dashboard/vc', icon: <LayoutDashboard size={20} /> },
    { label: 'Company Approvals', path: '/vc/recruiters', icon: <Building2 size={20} /> },
    { label: 'TPO Officers', path: '/vc/tpo-management', icon: <UserCheck size={20} /> },
    { label: 'Students', path: '/tpo/students', icon: <Users size={20} /> },
    { label: 'Jobs', path: '/tpo/jobs', icon: <Briefcase size={20} /> },
    { label: 'Placements', path: '/tpo/placements', icon: <Award size={20} /> },
  ];

  const activeLinks = 
    role?.toUpperCase() === 'VC' 
      ? vcLinks 
      : role?.toUpperCase() === 'STUDENT' 
      ? studentLinks 
      : role?.toUpperCase() === 'TPO' 
      ? tpoLinks 
      : recruiterLinks;

  const getUserDisplayName = () => {
    const r = (role || '').toUpperCase();
    if (r === 'STUDENT') return 'Aarav Mehta';
    if (r === 'VC') return 'Dr. K.S. Verma';
    if (r === 'TPO') return 'Prof. Rajesh Sharma';
    if (r === 'RECRUITER') return 'Priya Nair';
    return userEmail ? userEmail.split('@')[0] : 'User Account';
  };

  const userDisplayName = getUserDisplayName();
  const userInitials = userDisplayName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const getWorkspaceTitle = () => {
    if (role?.toUpperCase() === 'VC') return 'VC Workspace';
    if (role?.toUpperCase() === 'TPO') return 'TPO Workspace';
    if (role?.toUpperCase() === 'STUDENT') return 'Student Workspace';
    if (role?.toUpperCase() === 'RECRUITER') return 'Recruiter Workspace';
    return 'Campus Portal';
  };

  const getRoleBadge = () => {
    switch (role?.toUpperCase()) {
      case 'VC':
        return <span className="badge bg-purple-subtle text-purple border-0 fw-semibold px-2.5 py-1" style={{ fontSize: '0.68rem', backgroundColor: '#F3E8FF', color: '#7E22CE', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>VICE CHANCELLOR</span>;
      case 'TPO':
        return <span className="badge bg-primary-subtle text-primary border-0 fw-semibold px-2.5 py-1" style={{ fontSize: '0.68rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>TPO OFFICER</span>;
      case 'RECRUITER':
        return <span className="badge bg-success-subtle text-success border-0 fw-semibold px-2.5 py-1" style={{ fontSize: '0.68rem', backgroundColor: '#ECFDF5', color: '#047857', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>CORPORATE HR</span>;
      default:
        return <span className="badge bg-info-subtle text-info border-0 fw-semibold px-2.5 py-1" style={{ fontSize: '0.68rem', backgroundColor: '#F0F9FF', color: '#0284C7', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>STUDENT SCHOLAR</span>;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light" style={{ overflowX: 'hidden' }}>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern High-End Sidebar */}
      <aside 
        className={`d-flex flex-column p-3 text-white transition-all position-fixed h-100 ${
          sidebarOpen ? 'start-0' : 'start-n100'
        } start-lg-0`}
        style={{ 
          width: '260px', 
          zIndex: 1050,
          backgroundColor: '#0F172A',
          boxShadow: '4px 0 24px 0 rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 px-2 pt-2">
          <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none text-white overflow-hidden">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-xs flex-shrink-0" style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}>
              P
            </div>
            <div className="d-flex flex-column overflow-hidden" style={{ minWidth: 0 }}>
              <span className="fw-bold tracking-tight text-white lh-1" style={{ fontSize: '1.15rem' }}>PRMS Pro</span>
              <span className="text-truncate text-secondary" style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '3px' }}>
                {getWorkspaceTitle()}
              </span>
            </div>
          </Link>
          <button 
            className="btn btn-link text-secondary d-lg-none p-1 text-decoration-none" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="d-flex flex-column justify-content-between flex-grow-1 overflow-y-auto">
          {/* Navigation Items */}
          <nav className="nav flex-column gap-1.5">
            {activeLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium transition-all ${
                    active 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-secondary hover-text-white'
                  }`}
                  style={{
                    fontSize: '0.9rem',
                    backgroundColor: active ? '#2563EB' : 'transparent',
                    color: active ? '#FFFFFF' : '#94A3B8'
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom User Profile Card & Sign Out */}
          <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex align-items-center gap-3 mb-3 p-2.5 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-xs" style={{ width: '36px', height: '36px', fontSize: '0.85rem', flexShrink: 0 }}>
                {userInitials}
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <p className="m-0 fw-semibold text-white text-truncate" style={{ fontSize: '0.85rem' }}>
                  {userDisplayName}
                </p>
                <p className="m-0 text-truncate" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {userEmail || 'user@prms.edu'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
              style={{ fontSize: '0.85rem', fontWeight: 600 }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container Stage - Offset 260px on desktop */}
      <div className="dashboard-main-stage d-flex flex-column min-vh-100">
        <DemoBanner />

        {/* Top Header Bar */}
        <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center sticky-top shadow-xs" style={{ zIndex: 10, height: '64px' }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light d-md-none p-1.5 rounded-3 border" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h4 className="m-0 fw-bold" style={{ fontSize: '1.25rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
              {getHeaderTitle()}
            </h4>
          </div>

          <div></div>
        </header>

        {/* Main Content Outlet */}
        <main className="flex-grow-1 p-3 p-md-4" style={{ backgroundColor: '#F8FAFC' }}>
          {loadingStatus ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5">
              <Loader2 size={36} className="text-primary animate-spin mb-3" />
              <p className="text-secondary text-sm">Initializing session workspace...</p>
            </div>
          ) : restrictedRecruiter && !location.pathname.includes('/profile') ? (
            <RecruiterPendingApproval status={recruiterStatus} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

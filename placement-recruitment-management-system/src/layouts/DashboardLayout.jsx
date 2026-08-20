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

  const userInitials = (userEmail || 'User').slice(0, 2).toUpperCase();

  const getWorkspaceTitle = () => {
    if (role?.toUpperCase() === 'VC') return 'VC Workspace';
    if (role?.toUpperCase() === 'TPO') return 'TPO Workspace';
    if (role?.toUpperCase() === 'STUDENT') return 'Student Workspace';
    return 'Recruiter Workspace';
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Fixed Dark Sidebar */}
      <aside
        className={`sidebar text-white d-flex flex-column position-fixed h-100 ${
          sidebarOpen ? 'd-flex' : 'd-none d-md-flex'
        }`}
        style={{
          width: '260px',
          left: 0,
          top: 0,
          backgroundColor: '#0F172A',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 1040,
        }}
      >
        {/* Brand Header - Vertically Centered matching 64px Top Header Bar */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ height: '64px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', flexShrink: 0 }}>
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none text-white">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '36px', height: '36px', fontSize: '1.15rem', flexShrink: 0 }}>
              P
            </div>
            <span className="fw-bold tracking-tight text-white m-0" style={{ fontSize: '1.2rem', whiteSpace: 'nowrap' }}>PRMS Pro</span>
          </Link>
          <button className="btn text-white p-0 d-md-none border-0" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Inner Sidebar Body with Spaced Padding */}
        <div className="d-flex flex-column flex-grow-1 p-3">
          {/* User Workspace Indicator Badge */}
          <div className="rounded-3 px-3 py-2 mb-3 d-flex align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', gap: '8px' }}>
            <span className="bg-success rounded-circle" style={{ width: '7px', height: '7px', flexShrink: 0 }}></span>
            <span className="fw-semibold text-uppercase text-truncate" style={{ fontSize: '0.68rem', letterSpacing: '0.04em', color: '#CBD5E1' }}>
              {getWorkspaceTitle()}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="nav flex-column flex-grow-1 gap-1.5">
            {activeLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-link text-decoration-none rounded-3 px-3 py-2.5 d-flex align-items-center gap-3 ${
                    active ? 'bg-primary text-white fw-semibold shadow-sm' : ''
                  }`}
                  style={{
                    fontSize: '0.9rem',
                    color: active ? '#FFFFFF' : '#CBD5E1',
                    backgroundColor: active ? '#2563EB' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ color: active ? '#FFFFFF' : '#94A3B8' }}>{link.icon}</span>
                  <span>{link.label}</span>
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
                  {userEmail ? userEmail.split('@')[0] : 'User Account'}
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

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guard
import ProtectedRoute from './ProtectedRoute';

// Common pages
import Landing from '../pages/Landing';
import Unauthorized from '../pages/common/Unauthorized';
import NotFound from '../pages/common/NotFound';

// Auth pages
import RoleSelection from '../pages/auth/RoleSelection';
import StudentLogin from '../pages/auth/StudentLogin';
import RecruiterLogin from '../pages/auth/RecruiterLogin';
import TpoLogin from '../pages/auth/TpoLogin';
import VcLogin from '../pages/auth/VcLogin';
import StudentSignup from '../pages/auth/StudentSignup';
import RecruiterSignup from '../pages/auth/RecruiterSignup';
import OTPVerification from '../pages/auth/OTPVerification';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Student Portal pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentProfile from '../pages/student/Profile';
import StudentJobs from '../pages/student/Jobs';
import StudentJobDetails from '../pages/student/JobDetails';
import StudentApplications from '../pages/student/Applications';
import StudentPlacements from '../pages/student/Placements';

// Recruiter Portal pages
import RecruiterDashboard from '../pages/recruiter/Dashboard';
import RecruiterProfile from '../pages/recruiter/Profile';
import RecruiterJobs from '../pages/recruiter/Jobs';
import RecruiterCreateJob from '../pages/recruiter/CreateJob';
import RecruiterEditJob from '../pages/recruiter/EditJob';
import RecruiterApplicants from '../pages/recruiter/Applicants';
import RecruiterPlacements from '../pages/recruiter/Placements';
import RecruiterPendingApproval from '../pages/recruiter/PendingApproval';

// TPO Portal pages
import TpoDashboard from '../pages/tpo/Dashboard';
import TpoRecruiters from '../pages/tpo/Recruiters';
import TpoRecruiterDetails from '../pages/tpo/RecruiterDetails';
import TpoStudents from '../pages/tpo/Students';
import TpoStudentDetails from '../pages/tpo/StudentDetails';
import TpoPlacements from '../pages/tpo/Placements';
import TpoPlacementDetails from '../pages/tpo/PlacementDetails';
import TpoJobs from '../pages/tpo/Jobs';
import TpoJobDetails from '../pages/tpo/JobDetails';

// VC Portal pages
import VcDashboard from '../pages/vc/Dashboard';
import VcRecruiters from '../pages/vc/Recruiters';
import VcRecruiterDetails from '../pages/vc/RecruiterDetails';
import VcTpoManagement from '../pages/vc/TpoManagement';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Auth Flow Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/tpo/login" element={<TpoLogin />} />
        <Route path="/vc/login" element={<VcLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/recruiter/signup" element={<RecruiterSignup />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Student Portal (Authenticated - Student & VC) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['student', 'VC']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/jobs" element={<StudentJobs />} />
        <Route path="/student/jobs/:id" element={<StudentJobDetails />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/placements" element={<StudentPlacements />} />
      </Route>

      {/* Recruiter Portal (Authenticated - Recruiter & VC) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['recruiter', 'VC']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
        <Route path="/recruiter/jobs/create" element={<RecruiterCreateJob />} />
        <Route path="/recruiter/jobs/edit/:id" element={<RecruiterEditJob />} />
        <Route path="/recruiter/jobs/:id/applicants" element={<RecruiterApplicants />} />
        <Route path="/recruiter/placements" element={<RecruiterPlacements />} />
      </Route>

      {/* TPO Portal (Authenticated - TPO & VC) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['TPO', 'VC']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/tpo" element={<TpoDashboard />} />
        <Route path="/tpo/recruiters" element={<TpoRecruiters />} />
        <Route path="/tpo/recruiters/:id" element={<TpoRecruiterDetails />} />
        <Route path="/tpo/students" element={<TpoStudents />} />
        <Route path="/tpo/students/:id" element={<TpoStudentDetails />} />
        <Route path="/tpo/jobs" element={<TpoJobs />} />
        <Route path="/tpo/jobs/:id" element={<TpoJobDetails />} />
        <Route path="/tpo/placements" element={<TpoPlacements />} />
        <Route path="/tpo/placements/:id" element={<TpoPlacementDetails />} />
      </Route>

      {/* VC Portal (Authenticated - VC Exclusive) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['VC']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/vc" element={<VcDashboard />} />
        <Route path="/vc/recruiters" element={<VcRecruiters />} />
        <Route path="/vc/recruiters/:id" element={<VcRecruiterDetails />} />
        <Route path="/vc/tpo-management" element={<VcTpoManagement />} />
      </Route>

      {/* Fallbacks */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

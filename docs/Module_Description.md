<div align="center">

# MODULE DESCRIPTION DOCUMENT

**Placement & Recruitment Management System (PRMS)**

</div>

---

## 1. Document Purpose
This document provides a detailed breakdown of every module implemented in the PRMS system. Each module describes its purpose, associated features, pages, backend infrastructure, APIs, and database tables.

---

## 2. Authentication Module
*   **Purpose:** Securely manages user identity, registration, login, and password recovery.
*   **User Roles:** Student, Recruiter, TPO
*   **Features:** User Registration, JWT-based Login, Email OTP Generation, Password Reset.
*   **Pages:** `Signup.jsx`, `Login.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `RoleSelection.jsx`
*   **Backend Components:** `AuthController`, `AuthService`
*   **APIs:** `/api/auth/signup`, `/api/auth/login`, `/api/auth/forgot-password/send-otp`, `/api/auth/forgot-password/reset`
*   **Database Tables:** `user`, `otp`
*   **Dependencies:** Spring Security, io.jsonwebtoken, Spring Boot Starter Mail

---

## 3. Student Profile Module
*   **Purpose:** Allows students to manage their personal, academic, and professional details, including document uploads.
*   **User Roles:** Student
*   **Features:** Profile creation/update, Resume upload (PDF), Profile picture upload (Image).
*   **Pages:** `StudentProfile.jsx`, `EditStudentProfile.jsx`
*   **Backend Components:** `StudentProfileController`, `StudentProfileService`
*   **APIs:** `/api/student/profile` (GET, POST, PUT), `/api/student/profile/resume`, `/api/student/profile/profile-image`
*   **Database Tables:** `student_profile`
*   **Dependencies:** Spring Web Multipart

---

## 4. Company Profile Module
*   **Purpose:** Allows recruiters to define their corporate identity and branding on the platform.
*   **User Roles:** Recruiter
*   **Features:** Company detail creation/update, Company logo upload.
*   **Pages:** `CompanyProfile.jsx`, `EditCompanyProfile.jsx`
*   **Backend Components:** `RecruiterProfileController`, `RecruiterProfileService`
*   **APIs:** `/api/recruiter/profile` (GET, POST, PUT), `/api/recruiter/profile/logo`
*   **Database Tables:** `recruiter_profile`
*   **Dependencies:** Spring Web Multipart

---

## 5. Job Management Module
*   **Purpose:** The core engine for broadcasting and discovering employment opportunities.
*   **User Roles:** Recruiter, Student, TPO
*   **Features:** Post jobs, Upload Job Description (JD), Search/Filter jobs with pagination, View job details, Update job status.
*   **Pages:** `PostJob.jsx`, `RecruiterJobs.jsx`, `StudentJobs.jsx`, `JobDetails.jsx`, `TpoJobs.jsx`
*   **Backend Components:** `RecruiterJobController`, `StudentJobController`, `TpoJobController`, `JobService`
*   **APIs:** `/api/recruiter/jobs`, `/api/student/jobs/search`, `/api/tpo/jobs`
*   **Database Tables:** `job`
*   **Dependencies:** Spring Data JPA (Pageable)

---

## 6. Application Management Module
*   **Purpose:** Facilitates the application process, applicant screening, and interview scheduling.
*   **User Roles:** Student, Recruiter, TPO
*   **Features:** Apply for job, View my applications, Track status, Withdraw, Accept/Reject offer, View applicants, Bulk update statuses, Bulk schedule interviews (with email alerts).
*   **Pages:** `StudentApplications.jsx`, `ApplicantsList.jsx`, `ManageApplications.jsx`
*   **Backend Components:** `StudentApplicationController`, `RecruiterApplicationController`, `JobApplicationService`
*   **APIs:** `/api/student/jobs/{jobId}/apply`, `/api/recruiter/applications/bulk-schedule`, `/api/recruiter/applications/bulk-status`
*   **Database Tables:** `job_application`
*   **Dependencies:** Spring Boot Starter Mail

---

## 7. TPO Administration Module
*   **Purpose:** Provides the administrative backbone for the institution to oversee and moderate the system.
*   **User Roles:** TPO
*   **Features:** View aggregate metrics, View/Moderate students, Approve/Reject recruiters, Suspend recruiter accounts.
*   **Pages:** `Dashboard.jsx`, `StudentsList.jsx`, `StudentDetails.jsx`, `RecruitersList.jsx`, `RecruiterDetails.jsx`
*   **Backend Components:** `TpoDashboardController`, `TpoStudentController`, `TpoRecruiterController`, corresponding services.
*   **APIs:** `/api/tpo/dashboard`, `/api/tpo/recruiters/{id}/approve`, `/api/tpo/students/{studentId}/placement-status`
*   **Database Tables:** Aggregates data from `user`, `student_profile`, `recruiter_profile`, `job`, `job_application`
*   **Dependencies:** Spring Data JPA

---

## 8. Placement Tracking Module
*   **Purpose:** Formalizes the end result of the recruitment cycle by securely logging placement records.
*   **User Roles:** TPO, Student, Recruiter
*   **Features:** Create placement record, Update offer status, View aggregate placements, View personal/company placements.
*   **Pages:** `Placements.jsx`, `PlacementDetails.jsx`, `StudentPlacements.jsx`, `CompanyPlacements.jsx`
*   **Backend Components:** `PlacementController`, `StudentPlacementController`, `RecruiterPlacementController`, `PlacementService`
*   **APIs:** `/api/tpo/placements` (GET, POST), `/api/student/placements`, `/api/recruiter/placements`
*   **Database Tables:** `placement`
*   **Dependencies:** Spring Data JPA

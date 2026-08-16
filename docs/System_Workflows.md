<div align="center">

# DETAILED SYSTEM WORKFLOWS

**Placement & Recruitment Management System (PRMS)**

</div>

---

## 1. Document Purpose
This document provides a highly detailed, step-by-step technical explanation of the workflows for every user role implemented in the Placement & Recruitment Management System (PRMS). Following the system's actual implementation, this document outlines the workflows for the **Student**, **Company (Recruiter)**, and **TPO (Admin)** roles. 

*(Note: In the PRMS implementation, the TPO effectively serves the function of the System Administrator. Therefore, an independent "Admin" workflow is omitted, and administrative capabilities are consolidated under the TPO workflow.)*

---

## 2. Student Workflow

The Student workflow dictates how undergraduates or postgraduates interact with the system to secure employment.

### 2.1. Registration and Authentication
*   **Action:** The student navigates to the signup page and submits their basic details.
*   **Backend Interaction:** The frontend sends a POST request with a `SignupRequest` DTO to `/api/auth/signup`. The `AuthService` encrypts the password, assigns `ROLE_STUDENT`, and persists the `User` entity to the MySQL database.
*   **Login:** The student logs in via `/api/auth/login`. Spring Security authenticates the credentials against the database. Upon success, a signed JWT (JSON Web Token) is generated and returned to the client.
*   **Frontend State:** The React frontend stores the JWT (typically in Local Storage or Context) and attaches it as a Bearer token in the `Authorization` header for all subsequent API calls.

### 2.2. Profile Initialization and Asset Upload
*   **Action:** The student navigates to their profile dashboard to complete their academic details and upload documents.
*   **Backend Interaction:** A POST request containing a `StudentProfileRequest` DTO is sent to `/api/student/profile`. 
*   **File Uploads:** The student uploads a Resume (PDF) and Profile Picture (Image) via `multipart/form-data` to `/api/student/profile/resume` and `/profile-image`.
*   **Database Operation:** The `StudentProfileService` writes the files to local server directories (`uploads/resumes`, `uploads/profile-images`) and updates the `StudentProfile` entity in the database with the absolute file paths.

### 2.3. Job Discovery
*   **Action:** The student visits the "Open Jobs" board and applies filters (e.g., Job Title, Location, Work Mode).
*   **Backend Interaction:** The frontend sends a GET request to `/api/student/jobs/search` with query parameters.
*   **Database Operation:** The `JobService` utilizes Spring Data JPA's Pageable interface to query the database, returning a paginated `Page<JobResponse>` object to the frontend, preventing client-side memory overload.

### 2.4. Job Application
*   **Action:** The student reviews a job description and clicks "Apply".
*   **Backend Interaction:** A POST request (`ApplyJobRequest`) is sent to `/api/student/jobs/{jobId}/apply`.
*   **Database Operation:** The `JobApplicationService` creates a new `JobApplication` entity linking the `Student` and the `Job`, setting the initial status to `APPLIED`.

### 2.5. Application Tracking and Offer Management
*   **Action:** The student checks the status of their applications on their dashboard.
*   **Backend Interaction:** The frontend polls `/api/student/applications`.
*   **Decision Action:** If the company marks the student as `SELECTED`, the student can accept or reject the offer. Clicking "Accept" triggers a PUT request to `/api/student/applications/{applicationId}/accept`. 
*   **Database Operation:** The application status changes to `ACCEPTED`, and this state is committed to the database, notifying the TPO.

### 2.6. Logout
*   **Action:** The student clicks "Logout".
*   **Frontend Action:** The React frontend deletes the JWT from local storage, destroying the session client-side, and redirects the user to the Landing page.

---

## 3. Company (Recruiter) Workflow

The Recruiter workflow manages corporate entities attempting to hire students from the institution.

### 3.1. Registration and TPO Approval
*   **Action:** The recruiter registers an account.
*   **Backend Interaction:** A POST request to `/api/auth/signup` creates a User with `ROLE_RECRUITER`. 
*   **Database Operation:** The user is saved, but their profile verification status is initially marked as `PENDING_APPROVAL`. The recruiter cannot post jobs until the TPO verifies their corporate identity.

### 3.2. Authentication and Profile Management
*   **Action:** Following TPO approval, the recruiter logs in, receives their JWT, and completes their company profile.
*   **File Upload:** The recruiter uploads their corporate branding via `multipart/form-data` to `/api/recruiter/profile/logo`. The `RecruiterProfileService` stores this in `uploads/company-logos`.

### 3.3. Job Posting and JD Upload
*   **Action:** The recruiter drafts a new job opening.
*   **Backend Interaction:** A POST request with a `JobRequest` DTO is sent to `/api/recruiter/jobs`.
*   **Database Operation:** The `JobService` persists the `Job` entity.
*   **JD Upload:** The recruiter uploads a detailed Job Description document (PDF/Word) via `/api/recruiter/jobs/{jobId}/jd`. This is saved in `uploads/job-descriptions`.

### 3.4. Applicant Screening and Bulk Operations
*   **Action:** The recruiter views applicants for a specific job.
*   **Backend Interaction:** The frontend requests `/api/recruiter/jobs/{jobId}/applications`.
*   **Bulk Status Updates:** The recruiter selects multiple candidates and clicks "Shortlist". A PUT request (`BulkUpdateApplicationStatusRequest`) is dispatched to `/api/recruiter/applications/bulk-status`, updating multiple rows in the database in a single transaction.
*   **Bulk Interview Scheduling:** The recruiter schedules interviews for shortlisted candidates. A POST request to `/api/recruiter/applications/bulk-schedule` is executed.
*   **Notification Engine:** The `JobApplicationService` updates the database and triggers the `JavaMailSender` to dispatch automated interview invitation emails to all selected students.

### 3.5. Finalizing Candidates
*   **Action:** Post-interview, the recruiter marks candidates as `SELECTED` via `/api/recruiter/applications/{applicationId}/status`.
*   **Database Operation:** The application state is updated, which becomes visible to both the Student (to accept/reject) and the TPO (for final placement records).

---

## 4. TPO (Admin) Workflow

The Training and Placement Officer (TPO) acts as the system administrator, overseeing all operations and managing final placement records.

### 4.1. Authentication and Dashboard Aggregation
*   **Action:** The TPO logs into the portal using pre-configured administrative credentials.
*   **Backend Interaction:** Upon successful login and JWT assignment, the frontend calls `/api/tpo/dashboard`.
*   **Database Operation:** The `TpoDashboardService` runs multiple aggregate queries (e.g., `COUNT` on students, active jobs, and finalized placements) and returns a consolidated `TpoDashboardResponse` DTO to render high-level analytics charts on the frontend.

### 4.2. Recruiter Moderation (Gatekeeping)
*   **Action:** The TPO reviews newly registered companies.
*   **Backend Interaction:** The TPO fetches the list via `/api/tpo/recruiters?verified=false`.
*   **Decision Action:** The TPO clicks "Approve" for a legitimate company. A PUT request is sent to `/api/tpo/recruiters/{id}/approve`.
*   **Database Operation:** The `TpoRecruiterService` updates the recruiter's verification flag to `TRUE` in the database, unlocking job-posting capabilities for that company. The TPO can also suspend accounts using `/api/tpo/recruiters/{id}/status`.

### 4.3. Student Management
*   **Action:** The TPO monitors student progress and updates global placement statuses.
*   **Backend Interaction:** The TPO views a paginated list of students via `/api/tpo/students`. 
*   **Database Operation:** If a student secures a job off-campus or violates placement policies, the TPO can manually update their status (e.g., `PLACED`, `DEBARRED`) via a PUT request to `/api/tpo/students/{studentId}/placement-status`.

### 4.4. Oversight of Jobs and Applications
*   **Action:** The TPO audits job postings to ensure they meet university standards.
*   **Backend Interaction:** The frontend fetches all system-wide jobs via `/api/tpo/jobs`.
*   **Tracking Selected Candidates:** The TPO continuously monitors the `/api/tpo/jobs/applications/selected` endpoint to see which students have received offers from recruiters.

### 4.5. Creating Placement Records
*   **Action:** When a student formally accepts an offer (either on-platform or off-platform), the TPO formalizes the placement.
*   **Backend Interaction:** The TPO submits a `CreatePlacementRequest` to `/api/tpo/placements`.
*   **Database Operation:** The `PlacementService` generates a permanent `Placement` entity linking the student, the company, and the salary package. This data feeds directly back into the TPO Dashboard statistics and marks the end of the student's recruitment cycle.

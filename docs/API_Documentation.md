<div align="center">

# COMPLETE API DOCUMENTATION

**Placement & Recruitment Management System (PRMS)**

</div>

---

## 1. Authentication & OTP Module

### 1.1 User Registration
*   **Endpoint:** `/api/auth/signup`
*   **HTTP Method:** POST
*   **Authentication Required:** No
*   **Request Body:** `SignupRequest`
*   **Response Body:** `SignupResponse`
*   **Status Codes:** 201 Created

### 1.2 User Login
*   **Endpoint:** `/api/auth/login`
*   **HTTP Method:** POST
*   **Authentication Required:** No
*   **Request Body:** `LoginRequest`
*   **Response Body:** `LoginResponse`
*   **Status Codes:** 200 OK

### 1.3 Request Forgot Password OTP
*   **Endpoint:** `/api/auth/forgot-password/send-otp`
*   **HTTP Method:** POST
*   **Authentication Required:** No
*   **Request Body:** `ForgotPasswordRequest`
*   **Response Body:** `ApiResponse`
*   **Status Codes:** 200 OK

### 1.4 Reset Password
*   **Endpoint:** `/api/auth/forgot-password/reset`
*   **HTTP Method:** POST
*   **Authentication Required:** No
*   **Request Body:** `ResetPasswordRequest`
*   **Response Body:** `ApiResponse`
*   **Status Codes:** 200 OK

### 1.5 Send General OTP
*   **Endpoint:** `/api/otp/send`
*   **HTTP Method:** POST
*   **Authentication Required:** No
*   **Request Body:** `OtpRequest`
*   **Response Body:** `ApiResponse`
*   **Status Codes:** 200 OK

### 1.6 Verify General OTP
*   **Endpoint:** `/api/otp/verify`
*   **HTTP Method:** POST
*   **Authentication Required:** No
*   **Request Body:** `OtpVerifyRequest`
*   **Response Body:** `ApiResponse`
*   **Status Codes:** 200 OK

---

## 2. Student Module

### 2.1 Create Student Profile
*   **Endpoint:** `/api/student/profile`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Body:** `StudentProfileRequest`
*   **Response Body:** `StudentProfileResponse`
*   **Status Codes:** 201 Created

### 2.2 Get My Profile
*   **Endpoint:** `/api/student/profile`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Response Body:** `StudentProfileResponse`
*   **Status Codes:** 200 OK

### 2.3 Update Student Profile
*   **Endpoint:** `/api/student/profile`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Body:** `StudentProfileRequest`
*   **Response Body:** `StudentProfileResponse`
*   **Status Codes:** 200 OK

### 2.4 Upload Resume
*   **Endpoint:** `/api/student/profile/resume`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Parameters:** `resume` (MultipartFile)
*   **Response Body:** `FileUploadResponse`
*   **Status Codes:** 200 OK

### 2.5 Upload Profile Image
*   **Endpoint:** `/api/student/profile/profile-image`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Parameters:** `image` (MultipartFile)
*   **Response Body:** `FileUploadResponse`
*   **Status Codes:** 200 OK

### 2.6 Get All Open Jobs
*   **Endpoint:** `/api/student/jobs`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<JobResponse>`
*   **Status Codes:** 200 OK

### 2.7 Get Job by ID
*   **Endpoint:** `/api/student/jobs/{jobId}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Response Body:** `JobResponse`
*   **Status Codes:** 200 OK

### 2.8 Search Jobs
*   **Endpoint:** `/api/student/jobs/search`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Parameters:** `title`, `location`, `department`, `employmentType`, `workMode`, `page`, `size`
*   **Response Body:** `Page<JobResponse>`
*   **Status Codes:** 200 OK

### 2.9 Apply for Job
*   **Endpoint:** `/api/student/jobs/{jobId}/apply`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Body:** `ApplyJobRequest`
*   **Response Body:** `ApplicationResponse`
*   **Status Codes:** 201 Created

### 2.10 Get My Applications
*   **Endpoint:** `/api/student/applications`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<ApplicationResponse>`
*   **Status Codes:** 200 OK

### 2.11 Get Application by ID
*   **Endpoint:** `/api/student/applications/{applicationId}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Response Body:** `ApplicationResponse`
*   **Status Codes:** 200 OK

### 2.12 Withdraw Application
*   **Endpoint:** `/api/student/applications/{applicationId}/withdraw`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Response Body:** String message
*   **Status Codes:** 200 OK

### 2.13 Accept Offer
*   **Endpoint:** `/api/student/applications/{applicationId}/accept`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Response Body:** String message
*   **Status Codes:** 200 OK

### 2.14 Reject Offer
*   **Endpoint:** `/api/student/applications/{applicationId}/reject`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Response Body:** String message
*   **Status Codes:** 200 OK

### 2.15 Get My Placements
*   **Endpoint:** `/api/student/placements`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_STUDENT)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<PlacementResponse>`
*   **Status Codes:** 200 OK

---

## 3. Recruiter Module

### 3.1 Create Company Profile
*   **Endpoint:** `/api/recruiter/profile`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `RecruiterProfileRequest`
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 201 Created

### 3.2 Get My Company Profile
*   **Endpoint:** `/api/recruiter/profile`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 200 OK

### 3.3 Update Company Profile
*   **Endpoint:** `/api/recruiter/profile`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `RecruiterProfileRequest`
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 200 OK

### 3.4 Upload Company Logo
*   **Endpoint:** `/api/recruiter/profile/logo`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Parameters:** `logo` (MultipartFile)
*   **Response Body:** `FileUploadResponse`
*   **Status Codes:** 200 OK

### 3.5 Create Job
*   **Endpoint:** `/api/recruiter/jobs`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `JobRequest`
*   **Response Body:** `JobResponse`
*   **Status Codes:** 201 Created

### 3.6 Get My Jobs
*   **Endpoint:** `/api/recruiter/jobs`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<JobResponse>`
*   **Status Codes:** 200 OK

### 3.7 Get Job by ID
*   **Endpoint:** `/api/recruiter/jobs/{jobId}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Response Body:** `JobResponse`
*   **Status Codes:** 200 OK

### 3.8 Update Job
*   **Endpoint:** `/api/recruiter/jobs/{jobId}`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `JobRequest`
*   **Response Body:** `JobResponse`
*   **Status Codes:** 200 OK

### 3.9 Delete Job
*   **Endpoint:** `/api/recruiter/jobs/{jobId}`
*   **HTTP Method:** DELETE
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Response Body:** None
*   **Status Codes:** 204 No Content

### 3.10 Upload Job Description (JD)
*   **Endpoint:** `/api/recruiter/jobs/{jobId}/jd`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Parameters:** `jd` (MultipartFile)
*   **Response Body:** `FileUploadResponse`
*   **Status Codes:** 200 OK

### 3.11 Change Job Status
*   **Endpoint:** `/api/recruiter/jobs/{jobId}/status`
*   **HTTP Method:** PATCH
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Parameters:** `status`
*   **Response Body:** `JobResponse`
*   **Status Codes:** 200 OK

### 3.12 Get Applicants for Job
*   **Endpoint:** `/api/recruiter/jobs/{jobId}/applications`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<ApplicationResponse>`
*   **Status Codes:** 200 OK

### 3.13 Update Application Status
*   **Endpoint:** `/api/recruiter/applications/{applicationId}/status`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `UpdateApplicationStatusRequest`
*   **Response Body:** `ApplicationResponse`
*   **Status Codes:** 200 OK

### 3.14 Bulk Schedule Interviews
*   **Endpoint:** `/api/recruiter/applications/bulk-schedule`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `ScheduleInterviewRequest`
*   **Response Body:** String message
*   **Status Codes:** 200 OK

### 3.15 Bulk Update Application Status
*   **Endpoint:** `/api/recruiter/applications/bulk-status`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Body:** `BulkUpdateApplicationStatusRequest`
*   **Response Body:** String message
*   **Status Codes:** 200 OK

### 3.16 Get My Company Placements
*   **Endpoint:** `/api/recruiter/placements`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_RECRUITER)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<PlacementResponse>`
*   **Status Codes:** 200 OK

---

## 4. TPO Module

### 4.1 Get TPO Dashboard
*   **Endpoint:** `/api/tpo/dashboard`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `TpoDashboardResponse`
*   **Status Codes:** 200 OK

### 4.2 Get All Students
*   **Endpoint:** `/api/tpo/students`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Parameters:** `search`, `department`, `semester`, `placementStatus`, `page`, `size`
*   **Response Body:** `Page<StudentProfileResponse>`
*   **Status Codes:** 200 OK

### 4.3 Get Student by ID
*   **Endpoint:** `/api/tpo/students/{studentId}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `StudentProfileResponse`
*   **Status Codes:** 200 OK

### 4.4 Update Student Placement Status
*   **Endpoint:** `/api/tpo/students/{studentId}/placement-status`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Body:** `UpdatePlacementStatusRequest`
*   **Response Body:** `StudentProfileResponse`
*   **Status Codes:** 200 OK

### 4.5 Delete Student
*   **Endpoint:** `/api/tpo/students/{studentId}`
*   **HTTP Method:** DELETE
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** String message
*   **Status Codes:** 200 OK

### 4.6 Get Student Applications
*   **Endpoint:** `/api/tpo/students/{studentId}/applications`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `List<ApplicationResponse>`
*   **Status Codes:** 200 OK

### 4.7 Get All Recruiters
*   **Endpoint:** `/api/tpo/recruiters`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Parameters:** `search`, `status`, `verified`, `page`, `size`
*   **Response Body:** `Page<RecruiterProfileResponse>`
*   **Status Codes:** 200 OK

### 4.8 Get Recruiter by ID
*   **Endpoint:** `/api/tpo/recruiters/{id}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 200 OK

### 4.9 Approve Recruiter
*   **Endpoint:** `/api/tpo/recruiters/{id}/approve`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 200 OK

### 4.10 Reject Recruiter
*   **Endpoint:** `/api/tpo/recruiters/{id}/reject`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 200 OK

### 4.11 Update Recruiter Account Status
*   **Endpoint:** `/api/tpo/recruiters/{id}/status`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Body:** `UpdateRecruiterAccountStatusRequest`
*   **Response Body:** `RecruiterProfileResponse`
*   **Status Codes:** 200 OK

### 4.12 Get Recruiter Jobs
*   **Endpoint:** `/api/tpo/recruiters/{id}/jobs`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `List<JobResponse>`
*   **Status Codes:** 200 OK

### 4.13 Get All Jobs
*   **Endpoint:** `/api/tpo/jobs`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Parameters:** `title`, `location`, `department`, `employmentType`, `workMode`, `status`, `page`, `size`
*   **Response Body:** `Page<JobResponse>`
*   **Status Codes:** 200 OK

### 4.14 Get Job by ID (TPO)
*   **Endpoint:** `/api/tpo/jobs/{id}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `JobResponse`
*   **Status Codes:** 200 OK

### 4.15 Get Job Applications
*   **Endpoint:** `/api/tpo/jobs/{id}/applications`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<ApplicationResponse>`
*   **Status Codes:** 200 OK

### 4.16 Get Selected Applications
*   **Endpoint:** `/api/tpo/jobs/applications/selected`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Parameters:** `page`, `size`
*   **Response Body:** `Page<ApplicationResponse>`
*   **Status Codes:** 200 OK

### 4.17 Create Placement
*   **Endpoint:** `/api/tpo/placements`
*   **HTTP Method:** POST
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Body:** `CreatePlacementRequest`
*   **Response Body:** `PlacementResponse`
*   **Status Codes:** 200 OK

### 4.18 Get All Placements
*   **Endpoint:** `/api/tpo/placements`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Parameters:** `search`, `company`, `offerStatus`, `department`, `passingYear`, `page`, `size`
*   **Response Body:** `Page<PlacementResponse>`
*   **Status Codes:** 200 OK

### 4.19 Get Placement by ID
*   **Endpoint:** `/api/tpo/placements/{id}`
*   **HTTP Method:** GET
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Response Body:** `PlacementResponse`
*   **Status Codes:** 200 OK

### 4.20 Update Placement
*   **Endpoint:** `/api/tpo/placements/{id}`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Body:** `UpdatePlacementRequest`
*   **Response Body:** `PlacementResponse`
*   **Status Codes:** 200 OK

### 4.21 Update Placement Offer Status
*   **Endpoint:** `/api/tpo/placements/{id}/offer-status`
*   **HTTP Method:** PUT
*   **Authentication Required:** Yes (ROLE_TPO)
*   **Request Body:** `UpdateOfferStatusRequest`
*   **Response Body:** `PlacementResponse`
*   **Status Codes:** 200 OK

# Changed Files

## Added Files

- (No files were added)

## Modified Files

- `src/main/java/com/prms/service/auth/AuthServiceImpl.java`
  - **What changed:** Implemented `resetPassword(ResetPasswordRequest request)`.
  - **Why it changed:** To complete the Forgot Password flow, verifying the OTP natively via `OtpService` and securely updating the database via `BCryptPasswordEncoder`.

- `src/main/java/com/prms/repository/JobRepository.java`
  - **What changed:** Refactored various `findBy...` and dynamic search methods to accept `Pageable` and return `Page<Job>`.
  - **Why it changed:** To introduce pagination at the database level for the entire Job module.

- `src/main/java/com/prms/service/job/JobService.java` & `src/main/java/com/prms/service/job/JobServiceImpl.java`
  - **What changed:** Refactored `getMyJobs`, `getAllOpenJobs`, and `searchJobs` to accept `page` and `size` parameters and return `Page<JobResponse>`.
  - **Why it changed:** To process and pass pagination metadata cleanly from the controller to the repository.

- `src/main/java/com/prms/controller/recruiter/RecruiterJobController.java` & `src/main/java/com/prms/controller/student/StudentJobController.java`
  - **What changed:** Injected `@RequestParam(defaultValue = "0") Integer page` and `@RequestParam(defaultValue = "10") Integer size` to `GET` mapping endpoints.
  - **Why it changed:** To allow API consumers to natively request paginated job listings.

- `src/main/java/com/prms/repository/JobApplicationRepository.java`
  - **What changed:** Refactored `findByStudentOrderByAppliedAtDesc` and `findByJobOrderByAppliedAtDesc` to accept `Pageable` and return `Page<JobApplication>`.
  - **Why it changed:** To introduce pagination at the database level for the Application module.

- `src/main/java/com/prms/service/application/JobApplicationService.java` & `src/main/java/com/prms/service/application/JobApplicationServiceImpl.java`
  - **What changed:** Refactored `getMyApplications` and `getApplicantsForJob` to accept pagination arguments and map to `Page<ApplicationResponse>`.
  - **Why it changed:** To handle paginated response encapsulation for students tracking applications and recruiters tracking applicants.

- `src/main/java/com/prms/controller/recruiter/RecruiterApplicationController.java` & `src/main/java/com/prms/controller/student/StudentApplicationController.java`
  - **What changed:** Upgraded all multi-resource GET endpoints to accept `page`/`size` parameters and return a paginated `ResponseEntity`.
  - **Why it changed:** To finalize standard pagination APIs.

## Deleted Files

- (No files were deleted)

## Repository Methods Added / Modified
- `JobRepository.findByRecruiterAndStatusNot(RecruiterProfile recruiter, String status, Pageable pageable)`
- `JobRepository.findByStatusOrderByCreatedAtDesc(String status, Pageable pageable)`
- `JobRepository.findByStatusAndTitleContainingIgnoreCase(String status, String title, Pageable pageable)`
- `JobRepository.findByStatusAndLocationContainingIgnoreCase(String status, String location, Pageable pageable)`
- `JobRepository.findByStatusAndDepartmentContainingIgnoreCase(String status, String department, Pageable pageable)`
- `JobRepository.findByStatusAndEmploymentType(String status, String employmentType, Pageable pageable)`
- `JobRepository.findByStatusAndWorkMode(String status, String workMode, Pageable pageable)`
- `JobApplicationRepository.findByStudentOrderByAppliedAtDesc(StudentProfile student, Pageable pageable)`
- `JobApplicationRepository.findByJobOrderByAppliedAtDesc(Job job, Pageable pageable)`

## Controller Endpoints Updated
- `GET /api/recruiter/jobs` (Added Pagination)
- `GET /api/student/jobs` (Added Pagination)
- `GET /api/student/jobs/search` (Added Pagination)
- `GET /api/recruiter/jobs/{jobId}/applications` (Added Pagination)
- `GET /api/student/applications` (Added Pagination)

## Forgot Password Implementation Summary
- Connected the empty `resetPassword()` method directly to the `OtpService.verifyOtp()` function.
- Successfully verified OTPs immediately allow a user lookup via email.
- The new password payload is secured via `passwordEncoder.encode()` before persisting back to the database.
- Previous passwords are intrinsically invalidated upon `save()`.

## Pagination Changes Summary
- Transitioned heavily populated tables (`jobs`, `job_applications`) away from fetching `List<T>` which risks memory overflow.
- Controllers now default to `page=0` and `size=10`.
- All list-mapping logic (`.stream().map().toList()`) safely transitions to `.map()` available natively on Spring's `Page<T>` object, keeping overhead minimal.

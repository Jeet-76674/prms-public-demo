<div align="center">

# REQUIREMENT ANALYSIS DOCUMENT

**Project Title:** Placement & Recruitment Management System (PRMS)

**Course / Degree:** [Insert Degree/Course Name]

**Prepared By:** [Insert Student/Team Name]

**Date:** July 2026

</div>

---

## 2. Document Version

| Version | Date | Description | Author |
| :--- | :--- | :--- | :--- |
| 1.0 | July 26, 2026 | Initial Baseline Document | System Architect |

---

## 3. Table of Contents

1. [Cover Page](#1-cover-page)
2. [Document Version](#2-document-version)
3. [Table of Contents](#3-table-of-contents)
4. [Project Overview](#4-project-overview)
5. [Problem Statement](#5-problem-statement)
6. [Existing System Analysis](#6-existing-system-analysis)
7. [Proposed System](#7-proposed-system)
8. [Objectives](#8-objectives)
9. [Scope of the Project](#9-scope-of-the-project)
10. [Stakeholders](#10-stakeholders)
11. [User Roles](#11-user-roles)
12. [Functional Requirements](#12-functional-requirements-module-wise)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Assumptions](#14-assumptions)
15. [Constraints](#15-constraints)
16. [Technology Stack](#16-technology-stack)
17. [Module Descriptions](#17-module-descriptions)
18. [System Workflow](#18-system-workflow)
19. [System Architecture](#19-system-architecture)
20. [Security Features](#20-security-features)
21. [Future Scope](#21-future-scope)
22. [Conclusion](#22-conclusion)

---

## 4. Project Overview

The **Placement & Recruitment Management System (PRMS)** is a comprehensive web-based application designed to bridge the gap between students seeking employment, corporate recruiters offering opportunities, and the university's Training and Placement Officer (TPO) who facilitates this transition. The system streamlines the entire recruitment lifecycle—from job posting and application tracking to interview scheduling and final placement record management. 

## 5. Problem Statement

In many educational institutions, the placement process is heavily reliant on manual processes, disparate spreadsheets, and disjointed communication channels like notice boards or bulk emails. 
This manual approach results in:
*   **Data Redundancy and Errors:** Managing student profiles, resumes, and placement statuses manually is prone to inconsistencies.
*   **Communication Gaps:** Students frequently miss out on relevant job postings, and recruiters face delays in receiving applicant shortlists.
*   **Inefficient Tracking:** Tracking the progress of hundreds of applications across various interview stages is highly tedious for the TPO.
*   **Lack of Analytics:** Generating consolidated reports on placement statistics is a time-consuming manual task.

## 6. Existing System Analysis

The current operational baseline in institutions lacking a PRMS typically involves:
*   Students submitting physical resumes or emailing them to a generic placement cell address.
*   TPOs manually verifying academic credentials and manually maintaining a database of eligible students in spreadsheet software.
*   Recruiters communicating job descriptions (JDs) over email, which the TPO then forwards to students.
*   Interview scheduling handled via endless email threads or phone calls.
There is a clear absence of a unified, secure platform offering real-time data access and automated workflows.

## 7. Proposed System

The proposed PRMS replaces manual workflows with a centralized, secure digital platform. It features a three-tier architecture connecting the frontend (React-based Single Page Application) with a robust backend API (Spring Boot). 
Key features include automated email notifications for OTP verification, digital file storage for resumes and JDs, dynamic dashboard analytics for the TPO, and an automated application status tracking pipeline.

## 8. Objectives

*   **Automation:** Automate routine tasks such as job posting, application submission, and status updates.
*   **Centralization:** Provide a single source of truth for student records, company profiles, and placement statistics.
*   **Transparency:** Allow students real-time visibility into their application status (e.g., Applied, Shortlisted, Selected).
*   **Efficiency:** Enable recruiters to perform bulk actions (e.g., bulk scheduling interviews, bulk status updates).
*   **Oversight:** Empower the TPO with comprehensive controls to moderate recruiters, oversee applications, and manage final placements.

## 9. Scope of the Project

The scope encompasses the complete campus recruitment lifecycle:
*   Secure user registration and authentication for Students and Recruiters.
*   Profile management with digital asset uploads (Resumes, Profile Pictures, Company Logos).
*   Job creation, filtering, searching, and application management.
*   Interview scheduling and offer management (Accept/Reject).
*   System administration and placement record-keeping by the TPO.
*   The system currently operates as a web application and manages internal campus placements.

## 10. Stakeholders

1.  **University Administration / TPO:** The primary facilitators managing the campus drive.
2.  **Students:** The end-users seeking employment and tracking their applications.
3.  **Recruiters (Companies):** The corporate entities posting jobs and managing applicant pipelines.

## 11. User Roles

1.  **TPO (Training and Placement Officer):** Acts as the system administrator. Has universal access to monitor students, approve/reject recruiter registrations, oversee all job postings, track all applications, and manage finalized placements.
2.  **Recruiter:** Represents a hiring company. Can manage their corporate profile, post job openings, upload Job Descriptions (JDs), review applicants, schedule interviews, and update application statuses.
3.  **Student:** Can create and maintain an academic and professional profile, upload their resume, browse active job postings, apply for jobs, track application statuses, and accept or reject final job offers.

---

## 12. Functional Requirements (Module-Wise)

### 12.1 Authentication Module
*   **FR-AUTH-01:** The system shall allow Students and Recruiters to register for a new account.
*   **FR-AUTH-02:** The system shall authenticate users using secure credentials and issue a JSON Web Token (JWT) for session management.
*   **FR-AUTH-03:** The system shall provide a "Forgot Password" mechanism that sends a time-bound, 6-digit OTP (valid for 5 minutes) to the user's registered email address.
*   **FR-AUTH-04:** The system shall allow users to securely reset their password upon successful OTP verification.

### 12.2 Profile Management Module
*   **FR-PROF-01:** Students shall be able to create, view, and update their personal and academic profiles.
*   **FR-PROF-02:** Students shall be able to upload profile images and PDF resumes (up to 10MB).
*   **FR-PROF-03:** Recruiters shall be able to create, view, and update their company profile.
*   **FR-PROF-04:** Recruiters shall be able to upload a company logo.

### 12.3 Job Management Module
*   **FR-JOB-01:** Recruiters shall be able to post new job openings detailing title, location, department, employment type, and work mode.
*   **FR-JOB-02:** Recruiters shall be able to upload a Job Description (JD) document for each job.
*   **FR-JOB-03:** Recruiters shall be able to update job details, delete jobs, and toggle job status (e.g., Open, Closed).
*   **FR-JOB-04:** Students shall be able to view a paginated list of all currently open jobs.
*   **FR-JOB-05:** Students shall be able to search and filter jobs based on title, location, department, employment type, and work mode.

### 12.4 Application Management Module
*   **FR-APP-01:** Students shall be able to apply for open jobs.
*   **FR-APP-02:** Students shall be able to view all their applications and their current statuses.
*   **FR-APP-03:** Students shall be able to withdraw a pending application.
*   **FR-APP-04:** Students shall be able to explicitly Accept or Reject a final job offer.
*   **FR-APP-05:** Recruiters shall be able to view a paginated list of applicants for their posted jobs.
*   **FR-APP-06:** Recruiters shall be able to update the status of individual applications (e.g., Shortlisted, Interviewing, Selected, Rejected).
*   **FR-APP-07:** Recruiters shall be able to perform bulk status updates for multiple applicants simultaneously.
*   **FR-APP-08:** Recruiters shall be able to schedule bulk interviews, which triggers automated notifications.

### 12.5 TPO Administration Module
*   **FR-TPO-01:** The TPO shall have access to a centralized dashboard aggregating system statistics.
*   **FR-TPO-02:** The TPO shall be able to view and search all registered students and filter them by department, semester, and placement status.
*   **FR-TPO-03:** The TPO shall be able to update a student's placement status and delete student records if necessary.
*   **FR-TPO-04:** The TPO shall be able to view all registered recruiters and approve or reject pending recruiter accounts.
*   **FR-TPO-05:** The TPO shall be able to suspend or update the account status of existing recruiters.
*   **FR-TPO-06:** The TPO shall be able to view all jobs posted across the system and view applications for any specific job.

### 12.6 Placement Tracking Module
*   **FR-PLC-01:** The TPO shall be able to manually create placement records for students.
*   **FR-PLC-02:** The TPO shall be able to update existing placement details and offer statuses.
*   **FR-PLC-03:** The TPO shall be able to view all placements with filtering options (search, company, offer status, department, passing year).
*   **FR-PLC-04:** Students and Recruiters shall be able to view their respective placement records.

---

## 13. Non-Functional Requirements

*   **Security:** All API endpoints (except authentication) must be secured via JWT. Passwords must be hashed before database storage. Cross-Origin Resource Sharing (CORS) must be configured to allow safe frontend-backend communication.
*   **Performance:** The system shall utilize pagination for all list-based data retrievals (Jobs, Applications, Students, Recruiters) to ensure fast load times and reduced server load.
*   **Usability:** The user interface shall be responsive, modern, and accessible, leveraging TailwindCSS and Bootstrap for a seamless experience across desktop and mobile devices.
*   **Reliability:** The system shall handle file uploads safely, restricted to a 10MB maximum request size, preventing server overflow.
*   **Maintainability:** The backend code shall adhere to MVC (Model-View-Controller) architecture, separating controllers, services, and repositories for easier future maintenance.

## 14. Assumptions

*   Users (Students, Recruiters, TPOs) have access to modern web browsers and a stable internet connection.
*   The email address provided by users during registration is valid and accessible for receiving OTPs.
*   The TPO account is pre-configured or created via database seeding, as TPOs do not self-register.

## 15. Constraints

*   File uploads are strictly constrained to the local file system (`uploads/resumes`, `uploads/company-logos`, etc.) and a maximum size of 10MB.
*   The system relies on an external SMTP server (Gmail) for email dispatch; rate limits imposed by the SMTP provider apply.

---

## 16. Technology Stack

**Frontend Layer:**
*   **Library:** React 19
*   **Build Tool:** Vite
*   **Routing:** React Router DOM
*   **Styling:** TailwindCSS 4, Bootstrap 5
*   **State / Data Fetching:** Axios, TanStack React Query, React Hook Form
*   **UI Assets:** Lucide React (Icons), Recharts (Charts), Motion (Animations)

**Backend Layer:**
*   **Framework:** Spring Boot 3.x (Java 21)
*   **Security:** Spring Security with io.jsonwebtoken (JWT API)
*   **Data Access:** Spring Data JPA / Hibernate
*   **Mail:** Spring Boot Starter Mail

**Database Layer:**
*   **Database:** MySQL 8
*   **Driver:** MySQL Connector/J

---

## 17. Module Descriptions

### Authentication Module
Serves as the gateway to the system. It handles the processing of `SignupRequest` and `LoginRequest` DTOs. Upon successful login, the `AuthService` generates a JWT token holding the user's role and identity. It also utilizes JavaMailSender to dispatch a 6-digit OTP for password recovery, verifying it against a time-constrained validation logic.

### Profile Management
Maintained by `StudentProfileController` and `RecruiterProfileController`. These controllers accept multipart files for digital assets. The `StudentProfileService` handles the storage of Resumes and Profile Images into dedicated local directories, linking the file path to the corresponding database entity.

### Job Management
Centralized around the `JobService`. Recruiters create jobs which are then persisted in the database. Students access these via `StudentJobController`, which implements robust searching and pagination logic using Spring Data JPA's Pageable interface, allowing students to filter results efficiently without loading the entire database into memory.

### Application Processing
Facilitated by the `JobApplicationService`. When a student applies, an application entity linking the Student and Job is created. Recruiters interact with this via `RecruiterApplicationController`, where they can execute bulk operations (like `BulkUpdateApplicationStatusRequest`). Scheduling interviews triggers automated email notifications to the shortlisted students.

### TPO Administration
The `TpoDashboardController`, `TpoStudentController`, and `TpoRecruiterController` provide the administrative backbone. The TPO dashboard aggregates metrics (total students, total placements, active jobs) for a macroscopic view. The TPO can also intercept recruiter registrations, requiring an explicit approval step before a recruiter can post jobs, ensuring corporate authenticity.

---

## 18. System Workflow

1.  **Onboarding:** A Recruiter registers an account. The TPO reviews the registration in their dashboard and approves it. A Student registers directly and builds their profile, including uploading their resume.
2.  **Job Posting:** The approved Recruiter logs in, completes their company profile (uploading a logo), and creates a new Job posting, attaching a Job Description (JD) file.
3.  **Application:** The Student logs in, navigates to the open jobs board, searches for relevant positions, and clicks "Apply".
4.  **Screening:** The Recruiter reviews the paginated list of applicants. They select multiple candidates and perform a "Bulk Schedule Interview" action.
5.  **Interview & Offer:** Following offline or external interview processes, the Recruiter updates the application status to "Selected". The Student is notified and logs in to click "Accept Offer".
6.  **Placement Finalization:** The TPO oversees this acceptance, formally creating a Placement Record in the system, updating the student's status to "Placed", and the system dashboard metrics automatically update to reflect the successful recruitment.

## 19. System Architecture

The PRMS implements a standard **Three-Tier Architecture**:

1.  **Presentation Tier (Client):** A React-based Single Page Application (SPA). It manages the user interface, client-side routing, and form validations. It communicates asynchronously with the backend via RESTful HTTP calls using Axios, appending the JWT token in the Authorization header.
2.  **Application Tier (Server):** A Spring Boot REST API. It intercepts incoming requests via Controllers, enforces role-based access control via Spring Security filters, and delegates business logic to Service classes. The Services perform necessary computations, handle file I/O operations, and map Data Transfer Objects (DTOs) to Database Entities.
3.  **Data Tier (Database):** A MySQL relational database interacting with the Application Tier via Spring Data JPA. It ensures data persistence, integrity, and handles complex relational queries for data retrieval.

## 20. Security Features

*   **Authentication Validation:** Passwords are encrypted before storage. Authentication is entirely stateless, utilizing HMAC SHA-256 signed JSON Web Tokens (JWT).
*   **Role-Based Access Control (RBAC):** API endpoints are secured using Spring Security's `@PreAuthorize` annotations or filter chains, ensuring, for example, that a Student cannot access TPO-exclusive `/api/tpo/**` endpoints.
*   **Input Validation:** The backend utilizes `jakarta.validation.Valid` to strictly validate incoming payloads (e.g., ensuring emails are formatted correctly and mandatory fields are present) preventing malformed data injection.
*   **Secure File Handling:** File uploads are restricted by size (10MB max) preventing Denial of Service (DoS) attacks via memory exhaustion. 

## 21. Future Scope

*   **Cloud Storage Integration:** Migrating file storage (Resumes, Logos) from the local filesystem to cloud storage (e.g., AWS S3) for higher scalability.
*   **In-App Messaging/Chat:** Introducing WebSockets to allow real-time communication between recruiters and students.
*   **Advanced Analytics:** Implementing AI-based resume parsing and candidate ranking based on job descriptions.
*   **Export Functionality:** Allowing the TPO to export placement records and student lists directly to Excel or CSV formats for external reporting.

## 22. Conclusion

The Placement & Recruitment Management System provides a highly structured, automated, and centralized solution to campus recruitments. By leveraging a modern tech stack encompassing React and Spring Boot, the system eliminates the redundancies of manual data entry, secures sensitive academic and corporate data, and provides an efficient, transparent communication channel between all stakeholders. The robust API and scalable architecture ensure the system can effectively manage the rigorous demands of high-volume campus placement drives.

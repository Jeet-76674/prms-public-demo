<div align="center">

# LITERATURE REVIEW

**Placement & Recruitment Management System (PRMS)**

</div>

---

## 1. Introduction

The transition from academic environments to corporate employment is a critical phase for students and educational institutions. Traditionally, Training and Placement Offices (TPOs) have relied on manual record-keeping, disparate spreadsheets, and fragmented communication channels to manage this process. A review of existing literature and market solutions highlights a significant evolution from manual registries to cloud-based, automated Placement and Recruitment Management Systems. 

This literature review evaluates ten existing systems and research implementations to identify their purposes, feature sets, advantages, and inherent limitations. By analyzing these existing solutions, this document establishes the necessity for the proposed Placement & Recruitment Management System (PRMS) and outlines how it addresses the shortcomings of current paradigms.

---

## 2. Review of Existing Systems and Research Papers

### 2.1. Handshake (Commercial University Recruitment Platform)
*   **Purpose:** To connect college students with employers through a centralized university partnership model.
*   **Features:** Extensive job boards, virtual career fairs, algorithmic job recommendations, and messaging systems.
*   **Advantages:** Massive scale, access to millions of students and thousands of Fortune 500 employers, highly polished UI.
*   **Limitations:** High licensing costs for universities, overwhelming for small-scale institutions, and limited customization for niche university workflows. The platform often feels detached from specific internal academic tracking.

### 2.2. Symplicity CSM (Career Services Management)
*   **Purpose:** A comprehensive enterprise software designed for university career centers to manage student employability.
*   **Features:** Advising management, experiential learning tracking, employer CRM, and interview scheduling.
*   **Advantages:** Deeply feature-rich and highly compliant with global educational standards (e.g., FERPA).
*   **Limitations:** The sheer volume of features results in a steep learning curve and a cluttered interface. It is notorious for slow load times and requires dedicated IT staff for maintenance.

### 2.3. Web-Based Training and Placement System (Srinivas et al., 2018)
*   **Purpose:** A research-based prototype aimed at digitizing student records for local engineering colleges.
*   **Features:** Basic CRUD (Create, Read, Update, Delete) operations for student details and simple job postings.
*   **Advantages:** Reduces paper waste and centralizes data on a local server. Highly lightweight.
*   **Limitations:** Lacks an interactive module for recruiters. TPOs must manually input job details sent by recruiters. It lacks automated status tracking and email notifications.

### 2.4. Automated Campus Placement Management System (Patil et al., 2019)
*   **Purpose:** To automate the matching process of student skills with job requirements.
*   **Features:** Rule-based filtering of students based on CGPA and technical skills, automated generation of eligible student lists.
*   **Advantages:** Saves significant time for TPOs during the shortlisting phase.
*   **Limitations:** The system is completely localized (desktop application), lacking a web interface for students and recruiters to interact dynamically. No real-time updates.

### 2.5. Cloud-Based Recruitment Management System (Sharma & Singh, 2020)
*   **Purpose:** To transition campus recruitment from local intranet servers to cloud environments for better accessibility.
*   **Features:** Cloud database integration, remote access for off-campus recruiters, and online application submissions.
*   **Advantages:** Highly accessible; recruiters can view student profiles from anywhere in the world.
*   **Limitations:** Security vulnerabilities. The paper highlights issues with unauthorized data access due to poor role-based access control (RBAC). It lacks a secure authentication layer like JWT.

### 2.6. Superset (Modern Campus Recruitment Platform)
*   **Purpose:** An end-to-end placement automation platform widely used in Indian universities.
*   **Features:** Video assessments, offer letter generation, automated data verification, and complex workflow automation.
*   **Advantages:** Streamlines the entire process from pre-placement talks to joining. Reduces TPO workload by 80%.
*   **Limitations:** Closed-source and highly expensive. Smaller institutions cannot afford the subscription models. The UI can be overly complex for a student simply trying to track a single application.

### 2.7. A Centralized Placement Portal for Educational Institutes (Kumar et al., 2017)
*   **Purpose:** To create a unified portal linking multiple colleges under a single university umbrella.
*   **Features:** Centralized job broadcasting, combined student talent pools.
*   **Advantages:** Increases the visibility of students to top-tier recruiters by pooling resources.
*   **Limitations:** Extremely difficult to maintain data privacy between competing colleges. Heavy database load leads to significant performance bottlenecks during peak application periods.

### 2.8. Taleo (Oracle Applicant Tracking System)
*   **Purpose:** A corporate enterprise ATS adapted by some universities for campus hiring.
*   **Features:** Deep HRIS (Human Resources Information System) integration, robust compliance tracking, complex applicant workflows.
*   **Advantages:** Enterprise-grade security and reliability.
*   **Limitations:** Designed for corporate HR, not academic TPOs. The terminology and workflows do not align with campus terms (e.g., semesters, backlogs, TPO approvals).

### 2.9. Smart Placement Management System using Data Analytics (Rao et al., 2021)
*   **Purpose:** To predict student placement probabilities based on historical data.
*   **Features:** Predictive modeling, interactive dashboards, student skill gap analysis.
*   **Advantages:** Helps institutions identify at-risk students before the placement season begins.
*   **Limitations:** Focuses heavily on analytics while neglecting the actual operational workflow (interview scheduling, resume parsing, recruiter interactions). It is an analytical tool rather than a management system.

### 2.10. Integrated Campus Recruitment System with Notification Engine (Desai et al., 2022)
*   **Purpose:** To solve communication gaps during campus drives using SMS and Email triggers.
*   **Features:** Automated email alerts for every stage of the application process.
*   **Advantages:** Keeps students highly engaged and reduces missed interview opportunities.
*   **Limitations:** Over-notification leads to alert fatigue. The system lacks a dedicated recruiter portal, requiring TPOs to act as middlemen for all communications.

---

## 3. Improvements Proposed by the Current PRMS Project

The proposed **Placement & Recruitment Management System (PRMS)** is designed to synthesize the advantages of the systems mentioned above while explicitly resolving their limitations. 

**How PRMS improves upon existing limitations:**
1.  **Cost & Accessibility (vs. Handshake/Superset):** Unlike commercial giants, PRMS is a custom-built, lightweight solution tailored specifically to the institution's exact workflow, eliminating exorbitant licensing fees and bloated, unused features.
2.  **Dedicated Recruiter Portal (vs. Srinivas et al. / Desai et al.):** PRMS removes the TPO from being a bottleneck. Recruiters have their own portal to post jobs, upload JDs, view applicants, and update statuses directly, while the TPO retains oversight.
3.  **Modern Web Architecture (vs. Patil et al.):** Instead of a desktop app, PRMS uses a React-based SPA frontend and a Spring Boot backend, ensuring it is universally accessible via web browsers with zero installation.
4.  **Robust Security (vs. Sharma & Singh):** PRMS implements stateless JWT (JSON Web Token) authentication and strict Spring Security Role-Based Access Control (RBAC), ensuring that students cannot access recruiter data, and unauthorized users cannot breach the system.
5.  **Targeted Functionality (vs. Taleo/Symplicity):** PRMS speaks the language of the campus. Features are tailored for academic recruitment (e.g., managing student profiles, tracking placements, TPO dashboards) rather than corporate HR compliance.
6.  **Pagination and Performance (vs. Kumar et al.):** To prevent database bottlenecks during peak placement season, PRMS implements robust server-side pagination for Jobs and Applications using Spring Data JPA, ensuring optimal load times.

---

## 4. Comparison Table

The following table summarizes the comparison between existing solutions and the proposed PRMS:

| System / Research Model | Target Audience | Key Feature | Primary Limitation | How PRMS Resolves This |
| :--- | :--- | :--- | :--- | :--- |
| **Handshake** | Global Universities | Massive employer network | High cost, low customizability | Custom-built, zero licensing cost, tailored workflow. |
| **Symplicity CSM** | Large Universities | Extensive FERPA compliance | Cluttered UI, steep learning curve | Clean, modern UI (React/Tailwind) focused only on core placement needs. |
| **Srinivas et al. (2018)** | Local Colleges | Basic CRUD operations | No recruiter portal | Dedicated recruiter dashboard for direct job management. |
| **Patil et al. (2019)** | Local Colleges | Automated eligibility filtering | Desktop-only application | Web-based architecture (Spring Boot + React). |
| **Sharma & Singh (2020)**| General Campuses | Cloud accessibility | Poor role-based security | Strict RBAC using Spring Security and JWTs. |
| **Superset** | Indian Universities | End-to-end automation | Expensive, closed-source | Developed in-house, highly maintainable and cost-effective. |
| **Kumar et al. (2017)** | Multi-College | Centralized talent pool | Performance bottlenecks | Server-side pagination ensures smooth database querying. |
| **Taleo (Oracle)** | Corporate HR | Enterprise ATS integrations | Not built for academic workflows | Built specifically around Student, TPO, and Recruiter dynamics. |
| **Rao et al. (2021)** | Academic Researchers| Placement prediction algorithms | Lacks operational workflows | Focuses on end-to-end operational workflow (applying, tracking, offers). |
| **Desai et al. (2022)** | Local Colleges | Notification engine | TPO acts as a bottleneck | Direct Recruiter-to-Student status tracking pipeline. |

---

## 5. Conclusion

The literature review demonstrates that while numerous placement systems exist—ranging from multi-million dollar commercial platforms to localized academic prototypes—there remains a critical gap for mid-sized institutions. They require systems that are modern, highly secure, easy to navigate, and free from corporate HR bloat, yet robust enough to handle hundreds of concurrent users without the TPO acting as a manual intermediary. 

The proposed **Placement & Recruitment Management System (PRMS)** successfully addresses these gaps. By utilizing a modern technology stack (React, Spring Boot, MySQL) and focusing on dedicated workflows for Students, Recruiters, and TPOs, PRMS offers a secure, scalable, and highly efficient alternative to both manual processes and overpriced commercial software.

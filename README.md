# Placement & Recruitment Management System (PRMS) — Public Demo

PRMS is an enterprise campus recruitment and placement automation platform tailored for universities, placement officers, corporate recruiters, and graduating students.

---

## 🌟 Key Features & Role Architecture

- **Vice Chancellor (VC) Portal (Executive Authority)**
  - Highest university governance authority.
  - Review and approve/reject corporate recruiter registrations.
  - Manage and create Training & Placement Officers (TPO) with credential management.
  - Comprehensive high-level placement statistics and campus analytics.

- **Training & Placement Officer (TPO) Portal**
  - Student candidate directory auditing and verification.
  - Campus job posting coordination and drive management.
  - Track placement offers and verify recruitment drive results.
  - *Strict separation of duties*: TPOs cannot approve/reject companies (governed by VC).

- **Corporate Recruiter Portal**
  - Post multi-disciplinary job openings with salary ranges, criteria, and optional PDF job brochures.
  - Candidate pipeline review across stages: `APPLIED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `INTERVIEW_SCHEDULED` $\rightarrow$ `SELECTED`.
  - Automated interview scheduling and real-time status management.

- **Student Portal**
  - Academic and skill profile management with GPA, backlog tracking, and certifications.
  - Resume upload with strict magic-byte PDF inspection and safe sandbox simulation.
  - 1-click job applications and real-time candidate stage tracking.

---

## 🔒 Security & Safe Public Demo Sandbox

1. **Controlled Baseline Dataset & Reset Engine**:
   - Initialized with realistic fictional datasets: 5 students, 4 companies, 4 jobs, and active placement records.
   - On-demand non-destructive restoration via `POST /api/demo/reset` (or the top banner in the web UI).
2. **Backend Rate Limiting**:
   - In-memory Token Bucket rate limiting on authentication, OTP generation, and upload endpoints.
3. **Upload Protection**:
   - Magic byte header inspection (`%PDF-`, JPEG, PNG) and file size enforcement.
   - Sample files served safely during public demonstration.
4. **Strict Authorization & Role Elevation Guard**:
   - Spring Security endpoint role mapping. Public registration of VC and TPO accounts is blocked by backend policy.
5. **Sanitized Configuration**:
   - Externalized environment variables for database, SMTP, and JWT keys (`.env.example`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 21+** (e.g. OpenJDK / Eclipse Temurin)
- **Node.js 18+** & npm
- **MySQL 8.0+**

---

### 1. Backend Setup (`prms-backend`)

1. Navigate to the backend directory:
   ```bash
   cd prms-backend
   ```
2. Copy `.env.example` to `.env` or set environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend starts on `http://localhost:8080` and automatically initializes the baseline demo dataset.*

---

### 2. Frontend Setup (`placement-recruitment-management-system`)

1. Navigate to the frontend directory:
   ```bash
   cd placement-recruitment-management-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend starts on `http://localhost:3000` (or `3001`).*

---

## 🔑 Predefined Demo Accounts

All fictional demo accounts share the password: **`Demo@1234`**

| Role | Email | Name / Organization |
| :--- | :--- | :--- |
| **Vice Chancellor (VC)** | `vc.demo@indus.edu` | Dr. K.S. Verma |
| **Training & Placement Officer (TPO)** | `tpo.demo@indus.edu` | Prof. Rajesh Sharma |
| **Corporate Recruiter** | `recruiter.demo@techcorp.com` | Priya Nair (TechCorp Solutions) |
| **Student Candidate** | `student.demo@indus.edu` | Alex Mercer (CSE, 9.2 CGPA) |

---

## 📁 Repository Structure

```
├── prms-backend/                          # Spring Boot REST API
│   ├── src/main/java/com/prms/            # Application source code
│   │   ├── config/                        # Security, CORS, Rate limiting, Demo configs
│   │   ├── controller/                    # REST controllers (VC, TPO, Recruiter, Student, Auth, Demo)
│   │   ├── entity/                        # JPA domain entities
│   │   ├── repository/                    # Spring Data JPA repositories
│   │   ├── security/                      # JWT auth filter & rate limiting token bucket
│   │   └── service/                       # Business logic services
│   ├── uploads/samples/                   # Safe sample demo PDFs (resume & JD)
│   └── .env.example                       # Backend environment template
│
├── placement-recruitment-management-system/ # React + Vite Frontend
│   ├── src/                               # Components, Layouts, Context, Pages, Services
│   │   ├── components/                    # DemoBanner, UI components
│   │   ├── pages/auth/                    # RoleSelection, Logins, Signups
│   │   ├── pages/vc/                      # VC Dashboard, TPO & Recruiter management
│   │   ├── pages/tpo/                     # TPO Portal, Student & Job management
│   │   ├── pages/recruiter/               # Recruiter Dashboard, Job creation & Pipeline
│   │   └── pages/student/                 # Student Profile, Applications, Placements
│   └── .env.example                       # Frontend environment template
│
└── docs/                                  # Architecture, workflows & API documentation
```

---

## 📄 License
This project is open-source for educational and demonstration purposes.

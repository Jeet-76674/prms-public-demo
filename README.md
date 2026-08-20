# Placement & Recruitment Management System (PRMS) — Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://prms-public-demo.vercel.app/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**Live Application URL**: [https://prms-public-demo.vercel.app/](https://prms-public-demo.vercel.app/)

PRMS is a production-ready, full-stack enterprise campus placement and recruitment automation platform tailored for universities, Training & Placement Officers (TPOs), corporate hiring partners, and graduating students.

---

## 🌟 Key Features & Role Architecture

- **🏛️ Vice Chancellor (VC) Portal (Executive Authority)**
  - Highest university governance and compliance authority.
  - Review and approve/reject corporate recruiter corporate registrations.
  - Create and manage Training & Placement Officers (TPO) with full credential provisioning.
  - Institutional high-level placement statistics and campus analytics.

- **🎓 Training & Placement Officer (TPO) Portal**
  - Student candidate directory verification and academic profile auditing.
  - Campus job posting coordination, drive scheduling, and student application monitoring.
  - **Conversion Queue**: 1-click conversion from selected candidates into official university placement records with recruiter auto-resolution and joining date retention.
  - Track institutional placement offers, drive analytics, and package distribution.

- **💼 Corporate Recruiter Portal**
  - Post multi-disciplinary campus job openings with salary ranges, criteria, and optional PDF job brochures.
  - Full candidate pipeline review across 5 standardized stages: `APPLIED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `INTERVIEW_SCHEDULED` $\rightarrow$ `SELECTED`.
  - Automated interview scheduling and real-time status management.

- **👨‍🎓 Student Portal**
  - Academic profile management with GPA, backlog tracking, and skill certifications.
  - Resume upload with strict magic-byte PDF inspection and safe sandbox simulation.
  - **Interactive Company Profiles**: Explore verified corporate partners, company facts, perks, and recruitment contacts.
  - **Instant Job Search & Multi-Field Filters**: Search by role title, company, skills, employment type, and work mode.
  - **Application Pipeline Tracker**: Live progress tracking across review, interview, and offer acceptance workflows.

---

## 🔒 Security & Public Sandbox Architecture

1. **Controlled Baseline Dataset & Reset Engine**:
   - Initialized with realistic fictional datasets: 5 students, 4 companies, 4 jobs, and active placement records.
   - Non-destructive demo reset available on-demand via `POST /api/demo/reset` or top navigation banner.
2. **Backend Rate Limiting**:
   - In-memory Token Bucket rate limiting on authentication, OTP generation, and upload endpoints.
3. **Upload Protection**:
   - Magic byte header inspection (`%PDF-`, JPEG, PNG) and strict file size enforcement.
   - Safe sample PDFs served dynamically for public demo testing.
4. **Role-Based Access Control (RBAC)**:
   - Spring Security endpoint role mapping with JWT stateless authentication.
5. **TiDB Cloud Connection Management**:
   - Optimized HikariCP connection pool with proactive keep-alive and lifetime expiration guards for resilient serverless cloud databases.

---

## 🔑 Predefined Demo Accounts

All fictional demo accounts share the password: **`Demo@1234`**

| Role | Email | Name / Organization |
| :--- | :--- | :--- |
| **Vice Chancellor (VC)** | `vc.demo@indus.edu` | Dr. K.S. Verma |
| **Training & Placement Officer (TPO)** | `tpo.demo@indus.edu` | Prof. Rajesh Sharma |
| **Corporate Recruiter** | `recruiter.demo@techcorp.com` | Priya Nair (TechCorp Solutions) |
| **Student Candidate** | `student.demo@indus.edu` | Aarav Mehta (CSE, 9.2 CGPA) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 21+** (e.g. OpenJDK / Eclipse Temurin)
- **Node.js 18+** & npm
- **MySQL 8.0+** or **TiDB Cloud**

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
   *The backend starts on `http://localhost:8080` and automatically seeds the demo dataset.*

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
   *The frontend starts on `http://localhost:3000`.*

---

## 📁 Repository Structure

```
├── prms-backend/                          # Spring Boot REST API (Java 21)
│   ├── src/main/java/com/prms/            # Source Code
│   │   ├── config/                        # Security, CORS, Rate limiting, Demo configs
│   │   ├── controller/                    # REST controllers (VC, TPO, Recruiter, Student, Auth, Demo)
│   │   ├── entity/                        # JPA domain entities
│   │   ├── repository/                    # Spring Data JPA repositories
│   │   ├── security/                      # JWT auth filter & rate limiting token bucket
│   │   └── service/                       # Business logic services
│   ├── uploads/samples/                   # Safe sample demo PDFs (resume & JD)
│   └── .env.example                       # Backend environment template
│
├── placement-recruitment-management-system/ # React 18 + Vite Frontend
│   ├── src/                               # Components, Layouts, Context, Pages, Services
│   │   ├── components/                    # DemoBanner, CompanyProfileModal, UI components
│   │   ├── pages/auth/                    # RoleSelection, Logins, Signups
│   │   ├── pages/vc/                      # VC Dashboard, TPO & Recruiter management
│   │   ├── pages/tpo/                     # TPO Portal, Student, Job & Placement management
│   │   ├── pages/recruiter/               # Recruiter Dashboard, Job creation & Pipeline
│   │   └── pages/student/                 # Student Profile, Applications, Placements
│   └── .env.example                       # Frontend environment template
│
└── README.md                              # Main documentation & architecture guide
```

---

## 👨‍💻 Developer & Author

**Developed with ❤️ and lots of ☕ by [Jeet Tetar](https://portfolio-mocha-nine-99.vercel.app/)**  
*Java Full Stack Developer & UI Designer*

- 🌐 **Live Demo**: [https://prms-public-demo.vercel.app/](https://prms-public-demo.vercel.app/)
- 💼 **Portfolio**: [portfolio-mocha-nine-99.vercel.app](https://portfolio-mocha-nine-99.vercel.app/)
- 💻 **GitHub**: [@Jeet-76674](https://github.com/Jeet-76674)

---

## 📄 License
This project is open-source for educational and demonstration purposes.

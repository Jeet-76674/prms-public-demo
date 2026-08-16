<div align="center">

# PROJECT FOLDER STRUCTURE

**Placement & Recruitment Management System (PRMS)**

</div>

---

## 1. Document Purpose
This document provides a comprehensive structural breakdown of both the frontend (React) and backend (Spring Boot) repositories of the PRMS project. It defines the responsibilities of key directories and explains the communication paradigm between the two layers.

---

## 2. Frontend Folder Structure
**Path:** `placement-&-recruitment-management-system/src/`

*   `assets/`
    *   **Purpose:** Stores static resources.
    *   **Contents:** Images, global SVGs, and brand logos.
    *   **Responsibilities:** Served globally across the application.
*   `common/`
    *   **Purpose:** Houses reusable UI components.
    *   **Contents:** Generic buttons, modals, input fields, and navbar components.
    *   **Responsibilities:** Ensures design consistency and prevents code duplication.
*   `pages/`
    *   **Purpose:** Contains the primary view components rendered by routes.
    *   **Contents:** Grouped logically by domain (`auth`, `student`, `recruiter`, `tpo`, `otp`).
    *   **Responsibilities:** Mounts the UI, manages local component state, and triggers API calls.
*   `routes/`
    *   **Purpose:** Handles client-side routing.
    *   **Contents:** `AppRoutes.jsx`.
    *   **Responsibilities:** Defines URL paths and wraps components in Protected Route wrappers to enforce Role-Based Access Control (RBAC) on the frontend.
*   `services/`
    *   **Purpose:** API interaction layer.
    *   **Contents:** Files like `authService.js` and custom Axios instances.
    *   **Responsibilities:** Manages backend communication, sets authorization headers (JWT), and handles API responses/errors.
*   `index.css`
    *   **Purpose:** Global stylesheet.
    *   **Contents:** Tailwind CSS directives and custom root variables.

---

## 3. Backend Folder Structure
**Path:** `prms-backend/src/main/java/com/prms/`

*   `config/`
    *   **Purpose:** Global application configuration.
    *   **Contents:** `DataInitializer.java`, WebMvc/CORS configurations.
    *   **Responsibilities:** Pre-seeds database data and manages global HTTP rules.
*   `controller/`
    *   **Purpose:** The entry point for HTTP requests.
    *   **Contents:** Grouped by role (`auth`, `student`, `recruiter`, `tpo`).
    *   **Responsibilities:** Maps endpoints, validates incoming Request DTOs, and returns Response Entities.
*   `dto/`
    *   **Purpose:** Data Transfer Objects.
    *   **Contents:** `request/` (e.g., `JobRequest`) and `response/` (e.g., `JobResponse`).
    *   **Responsibilities:** Prevents over-posting and separates database entities from API contracts.
*   `entity/`
    *   **Purpose:** Database schema definitions.
    *   **Contents:** `User.java`, `Job.java`, `JobApplication.java`.
    *   **Responsibilities:** Maps Java classes to MySQL tables via Hibernate annotations.
*   `repository/`
    *   **Purpose:** Database interaction layer.
    *   **Contents:** JPA interfaces (e.g., `JobRepository`).
    *   **Responsibilities:** Performs optimized SQL operations (CRUD and pagination) without boilerplate SQL.
*   `security/`
    *   **Purpose:** Core security enforcement.
    *   **Contents:** `JwtAuthenticationFilter`, `SecurityConfig`.
    *   **Responsibilities:** Verifies JWT signatures, extracts user roles, and protects endpoints.
*   `service/`
    *   **Purpose:** Business logic execution.
    *   **Contents:** Grouped by domain (`job`, `application`, `auth`). Contains interfaces and their implementations (`*ServiceImpl`).
    *   **Responsibilities:** Executes core rules, processes data from repositories, and orchestrates file uploads.

---

## 4. Cross-Module Communication
1.  **Frontend to Backend (Client-Server):**
    The frontend `services/` layer uses the **Axios** HTTP client to dispatch RESTful requests. Requests that require authentication automatically append `Authorization: Bearer <JWT>` to the HTTP headers. The backend intercepts this at the `security/` layer before passing it to the `controller/`.
2.  **Controller to Service (Intra-Backend):**
    Controllers (`controller/`) are intentionally kept thin. They immediately delegate validated DTOs to the `service/` layer, ensuring business logic is never exposed to the HTTP handling mechanism.
3.  **Service to Repository (Data Retrieval):**
    Services orchestrate data by injecting interfaces from the `repository/` layer. The repository uses Spring Data JPA to communicate with the MySQL database, translating entity operations into optimized SQL queries.
4.  **Database to Frontend (Response Flow):**
    Once data is fetched via the repository, the service maps the `entity` to a `dto/response`. The controller returns this DTO as JSON, which the frontend's React components then capture and render into the DOM.

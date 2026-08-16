<div align="center">

# SYSTEM ARCHITECTURE DOCUMENT

**Placement & Recruitment Management System (PRMS)**

</div>

---

## 1. Document Purpose
This document provides a comprehensive technical overview of the system architecture for the Placement & Recruitment Management System (PRMS). It details the architectural patterns, security mechanisms, data flow, and structural organization of both the frontend and backend applications, exactly as implemented in the source code.

---

## 2. Frontend Architecture
The frontend is implemented as a **Single Page Application (SPA)** utilizing a component-based architecture. 
*   **Core Framework:** Built with **React 19** and bundled using **Vite**, ensuring rapid hot-module replacement and optimized production builds.
*   **Routing:** Managed by **React Router DOM**, which intercepts URL changes and dynamically renders components without triggering full page reloads, providing a seamless user experience.
*   **State & Data Fetching:** **Axios** is used as the primary HTTP client to interact with the backend APIs. External data fetching and state synchronization are supplemented by **TanStack React Query**, which handles caching, loading states, and background data synchronization.
*   **Styling:** A hybrid approach using **Tailwind CSS 4** for highly customizable utility-first styling, alongside **Bootstrap 5** for standardized layout components.
*   **UI Assets:** Icons are rendered via **Lucide React**, and complex interactive charts on the TPO dashboard are powered by **Recharts**.

## 3. Backend Architecture
The backend employs a strict **Layered (N-Tier) Architecture** built on top of **Spring Boot 3 (Java 21)**. This separation of concerns ensures that business logic is isolated from HTTP request handling and database operations.
*   **Controller Layer:** Located in `com.prms.controller.*`. These classes intercept incoming HTTP requests, validate input payloads (using `jakarta.validation`), and map requests to the appropriate service methods.
*   **Service Layer:** Located in `com.prms.service.*`. This layer contains the core business logic. It processes rules (e.g., verifying if a recruiter is approved before posting a job), interacts with repositories, and maps database entities to Data Transfer Objects (DTOs) before returning them to the controller.
*   **Repository Layer:** Located in `com.prms.repository.*`. Utilizes **Spring Data JPA** interfaces extending `JpaRepository` to perform CRUD operations without writing boilerplate SQL.
*   **File Storage System:** A localized file storage architecture is implemented. The application properties dictate specific directories (`uploads/resumes`, `uploads/company-logos`, `uploads/job-descriptions`) for handling multipart file uploads directly on the server's file system.

## 4. Database Architecture
The system utilizes a relational database management system (**MySQL 8**), mapped to the Java application via **Hibernate (JPA)**. 
*   **Entity Mapping:** Database tables are automatically managed via Spring JPA (`spring.jpa.hibernate.ddl-auto=update`), translating Java classes annotated with `@Entity` directly into MySQL tables.
*   **Core Entities & Relationships:**
    *   `User`: The root authentication entity. Has a One-to-One relationship with either a `StudentProfile` or `RecruiterProfile` based on the user's role.
    *   `Job`: Posted by a Recruiter (Many-to-One relationship to `User`).
    *   `JobApplication`: The transactional entity linking a `User` (Student) and a `Job` (Many-to-One to both). It stores the evolving status of the application.
    *   `Placement`: The final record entity linking a student, a company, and a job profile.
*   **Pagination:** To prevent database overload, lists (like Jobs and Applications) are queried using JPA's `Pageable` interface, returning chunks of data rather than complete table dumps.

## 5. Authentication Flow
The system implements a stateless authentication mechanism using **JSON Web Tokens (JWT)**.
1.  **Registration:** A user submits a signup payload. Passwords are encrypted using Spring Security's `PasswordEncoder` (BCrypt) before saving to the database.
2.  **Login:** The client sends credentials to `/api/auth/login`. 
3.  **Token Generation:** If credentials are valid, the `AuthService` leverages the `io.jsonwebtoken` library to generate a JWT signed with a secret HMAC key (defined in `application.properties`). The payload includes the user's ID, email, and Role.
4.  **Session Maintenance:** The frontend stores this JWT securely (typically in local storage) and attaches it to the `Authorization: Bearer <token>` header for all subsequent API requests.
5.  **Password Recovery:** Uses an Email OTP mechanism. A 6-digit OTP is generated, saved in the database with a 5-minute expiration timestamp, and dispatched via `JavaMailSender`.

## 6. Authorization
Authorization is strictly enforced using **Spring Security** via Role-Based Access Control (RBAC).
*   **Role Mapping:** Every authenticated user holds a specific authority (`ROLE_STUDENT`, `ROLE_RECRUITER`, or `ROLE_TPO`).
*   **Endpoint Protection:** The `SecurityFilterChain` configuration dictates global access rules. Furthermore, specific controllers and methods are locked down using method-level security annotations (e.g., `@PreAuthorize("hasRole('TPO')")`). If a Student attempts to access a TPO endpoint, the security filter intercepts the request and returns a `403 Forbidden` response before the controller is even reached.

## 7. REST API Communication
*   **Protocol:** Communication happens exclusively over HTTP/HTTPS using RESTful principles.
*   **Payload Formatting:** Data is exchanged via JSON. Incoming JSON is mapped to Request DTOs (e.g., `JobRequest`), and outgoing data is mapped to Response DTOs (e.g., `JobResponse`, `ApiResponse`). This prevents database entities from leaking directly to the frontend.
*   **CORS Configuration:** Cross-Origin Resource Sharing is enabled on the backend (`@CrossOrigin(origins = "*")`) to allow the Vite development server (port 3000) or the production frontend host to securely interact with the Spring Boot server (port 8080).

## 8. Request Lifecycle
A standard API request (e.g., a student fetching jobs) follows this exact lifecycle:
1.  **Client Dispatch:** The React frontend calls `axios.get('/api/student/jobs')`, attaching the JWT in the headers.
2.  **CORS Filter:** The Spring Boot server verifies the origin.
3.  **JWT Authentication Filter:** A custom security filter intercepts the request, extracts the Bearer token, verifies its signature and expiration, and sets the `Authentication` context in the `SecurityContextHolder`.
4.  **Dispatcher Servlet:** Spring routes the request to `StudentJobController`.
5.  **Validation:** `@Validated` and `@Valid` annotations trigger payload checks.
6.  **Service Invocation:** The controller calls `JobService.getAllOpenJobs()`.
7.  **Data Access:** The service calls the injected `JobRepository.findAll(Pageable)`. Hibernate translates this to an optimized SQL `SELECT` query.
8.  **DTO Mapping:** The service transforms the `Job` entities into `JobResponse` DTOs.
9.  **HTTP Response:** The controller wraps the DTOs in a `ResponseEntity` and returns a `200 OK` JSON response to the client.

## 9. Project Folder Organization

### 9.1 Backend Structure (`prms-backend/src/main/java/com/prms`)
*   `config/`: Contains global configuration classes (e.g., CORS setup, Data Initializers).
*   `controller/`: Grouped by role (`auth`, `student`, `recruiter`, `tpo`). Defines HTTP endpoints.
*   `dto/`: Contains `request` and `response` objects to decouple API contracts from database models.
*   `entity/`: Contains JPA mapped database models.
*   `repository/`: Contains Spring Data JPA interfaces for database interaction.
*   `security/`: Contains JWT filters, security configurations, and user detail services.
*   `service/`: Grouped by domain (e.g., `job`, `application`, `tpo`). Contains business logic interfaces and their implementations.

### 9.2 Frontend Structure (`placement-&-recruitment-management-system/src`)
*   `assets/`: Static resources like images and fonts.
*   `common/`: Reusable UI components used across different roles.
*   `pages/`: The core view components, segregated by domain (`auth`, `student`, `recruiter`, `tpo`, `otp`).
*   `routes/`: Contains `AppRoutes.jsx` to define role-protected frontend routing logic.
*   `services/`: Axios configuration and API wrapper functions corresponding to backend endpoints.
*   `index.css`: Global styles including Tailwind configurations.

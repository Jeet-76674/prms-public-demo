package com.prms.service.demo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prms.config.DemoProperties;
import com.prms.entity.Company;
import com.prms.entity.Job;
import com.prms.entity.JobApplication;
import com.prms.entity.PlacementRecord;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.StudentProfile;
import com.prms.entity.User;
import com.prms.repository.CompanyRepository;
import com.prms.repository.JobApplicationRepository;
import com.prms.repository.JobRepository;
import com.prms.repository.PlacementRecordRepository;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.repository.StudentProfileRepository;
import com.prms.repository.UserRepository;

@Service
public class DemoDataServiceImpl implements DemoDataService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private PlacementRecordRepository placementRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DemoProperties demoProperties;

    @Override
    public boolean isDemoEnabled() {
        return demoProperties.isEnabled();
    }

    @Override
    @Transactional
    public void seedBaselineIfEmpty() {
        if (!demoProperties.isEnabled()) {
            return;
        }

        if (userRepository.findByEmail("vc.demo@indus.edu").isPresent()
                && studentProfileRepository.count() > 0
                && jobRepository.count() > 0) {
            // Already seeded
            return;
        }

        resetToBaseline();
    }

    @Override
    @Transactional
    public void resetToBaseline() {
        if (!demoProperties.isEnabled()) {
            throw new RuntimeException("Demo reset is disabled in non-demo mode.");
        }

        // Delete in foreign key reverse order
        placementRecordRepository.deleteAllInBatch();
        jobApplicationRepository.deleteAllInBatch();
        jobRepository.deleteAllInBatch();
        studentProfileRepository.deleteAllInBatch();
        recruiterProfileRepository.deleteAllInBatch();
        companyRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        buildBaselineData();
    }

    private void buildBaselineData() {
        String commonPassword = passwordEncoder.encode("Demo@1234");

        // 1. Vice Chancellor (VC) - Highest administrative authority
        User vcUser = new User();
        vcUser.setFirstName("Dr. K.S.");
        vcUser.setLastName("Verma");
        vcUser.setEmail("vc.demo@indus.edu");
        vcUser.setPhoneNumber("9990001111");
        vcUser.setPassword(commonPassword);
        vcUser.setRole("VC");
        vcUser.setAccountStatus("ACTIVE");
        userRepository.save(vcUser);

        // 2. Training & Placement Officer (TPO)
        User tpoUser = new User();
        tpoUser.setFirstName("Prof. Rajesh");
        tpoUser.setLastName("Sharma");
        tpoUser.setEmail("tpo.demo@indus.edu");
        tpoUser.setPhoneNumber("8880002222");
        tpoUser.setPassword(commonPassword);
        tpoUser.setRole("TPO");
        tpoUser.setAccountStatus("ACTIVE");
        userRepository.save(tpoUser);

        // 3. Recruiters & Companies

        // 3a. TechCorp Solutions (Approved & Active)
        User techcorpUser = new User();
        techcorpUser.setFirstName("Priya");
        techcorpUser.setLastName("Nair");
        techcorpUser.setEmail("recruiter.demo@techcorp.com");
        techcorpUser.setPhoneNumber("7770003333");
        techcorpUser.setPassword(commonPassword);
        techcorpUser.setRole("RECRUITER");
        techcorpUser.setAccountStatus("ACTIVE");
        userRepository.save(techcorpUser);

        RecruiterProfile techcorpProfile = new RecruiterProfile();
        techcorpProfile.setUser(techcorpUser);
        techcorpProfile.setCompanyName("TechCorp Solutions");
        techcorpProfile.setCompanyEmail("contact@techcorp.com");
        techcorpProfile.setCompanyPhone("+91 98765 43210");
        techcorpProfile.setWebsite("https://techcorp.example.com");
        techcorpProfile.setIndustry("Information Technology & Cloud");
        techcorpProfile.setCompanyDescription("Leading global enterprise software and digital transformation solutions provider.");
        techcorpProfile.setCompanySize("1000-5000");
        techcorpProfile.setHeadOffice("Bengaluru, Karnataka");
        techcorpProfile.setHrName("Priya Nair");
        techcorpProfile.setHrDesignation("Senior Talent Acquisition Lead");
        techcorpProfile.setLinkedin("https://linkedin.com/company/techcorp-demo");
        techcorpProfile.setVerified(true);
        recruiterProfileRepository.save(techcorpProfile);

        Company techcorpCompany = new Company();
        techcorpCompany.setCompanyName("TechCorp Solutions");
        techcorpCompany.setIndustry("Information Technology");
        techcorpCompany.setWebsite("https://techcorp.example.com");
        techcorpCompany.setDescription("Enterprise software systems and engineering services.");
        techcorpCompany.setHrEmail("recruiter.demo@techcorp.com");
        techcorpCompany.setHrPhone("7770003333");
        techcorpCompany.setAddressLine1("Tech Park Tower B");
        techcorpCompany.setCity("Bengaluru");
        techcorpCompany.setState("Karnataka");
        techcorpCompany.setCountry("India");
        techcorpCompany.setPincode("560100");
        techcorpCompany.setCompanyStatus("APPROVED");
        techcorpCompany.setApprovedBy(vcUser.getId());
        techcorpCompany.setApprovalDate(LocalDateTime.now().minusDays(10));
        companyRepository.save(techcorpCompany);

        // 3b. CloudScale Inc. (Approved & Active)
        User cloudscaleUser = new User();
        cloudscaleUser.setFirstName("Vikram");
        cloudscaleUser.setLastName("Seth");
        cloudscaleUser.setEmail("hr@cloudscale.io");
        cloudscaleUser.setPhoneNumber("7770004444");
        cloudscaleUser.setPassword(commonPassword);
        cloudscaleUser.setRole("RECRUITER");
        cloudscaleUser.setAccountStatus("ACTIVE");
        userRepository.save(cloudscaleUser);

        RecruiterProfile cloudscaleProfile = new RecruiterProfile();
        cloudscaleProfile.setUser(cloudscaleUser);
        cloudscaleProfile.setCompanyName("CloudScale Inc.");
        cloudscaleProfile.setCompanyEmail("recruitment@cloudscale.io");
        cloudscaleProfile.setCompanyPhone("+91 98765 54321");
        cloudscaleProfile.setWebsite("https://cloudscale.example.com");
        cloudscaleProfile.setIndustry("Cloud Infrastructure & AI");
        cloudscaleProfile.setCompanyDescription("Hyper-scale cloud DevOps and modern distributed platform infrastructure.");
        cloudscaleProfile.setCompanySize("500-1000");
        cloudscaleProfile.setHeadOffice("Hyderabad, Telangana");
        cloudscaleProfile.setHrName("Vikram Seth");
        cloudscaleProfile.setHrDesignation("Director of Human Resources");
        cloudscaleProfile.setLinkedin("https://linkedin.com/company/cloudscale-demo");
        cloudscaleProfile.setVerified(true);
        recruiterProfileRepository.save(cloudscaleProfile);

        Company cloudscaleCompany = new Company();
        cloudscaleCompany.setCompanyName("CloudScale Inc.");
        cloudscaleCompany.setIndustry("Cloud & DevOps");
        cloudscaleCompany.setWebsite("https://cloudscale.example.com");
        cloudscaleCompany.setDescription("Pioneering resilient distributed cloud infrastructure.");
        cloudscaleCompany.setHrEmail("hr@cloudscale.io");
        cloudscaleCompany.setHrPhone("7770004444");
        cloudscaleCompany.setAddressLine1("HITEC City Phase 2");
        cloudscaleCompany.setCity("Hyderabad");
        cloudscaleCompany.setState("Telangana");
        cloudscaleCompany.setCountry("India");
        cloudscaleCompany.setPincode("500081");
        cloudscaleCompany.setCompanyStatus("APPROVED");
        cloudscaleCompany.setApprovedBy(vcUser.getId());
        cloudscaleCompany.setApprovalDate(LocalDateTime.now().minusDays(5));
        companyRepository.save(cloudscaleCompany);

        // 3c. CyberNex Labs (Pending VC Approval - Demonstrates VC Approval Flow)
        User cybernexUser = new User();
        cybernexUser.setFirstName("Sameer");
        cybernexUser.setLastName("Joshi");
        cybernexUser.setEmail("talent@cybernex.com");
        cybernexUser.setPhoneNumber("7770005555");
        cybernexUser.setPassword(commonPassword);
        cybernexUser.setRole("RECRUITER");
        cybernexUser.setAccountStatus("PENDING");
        userRepository.save(cybernexUser);

        RecruiterProfile cybernexProfile = new RecruiterProfile();
        cybernexProfile.setUser(cybernexUser);
        cybernexProfile.setCompanyName("CyberNex Labs");
        cybernexProfile.setCompanyEmail("info@cybernex.com");
        cybernexProfile.setCompanyPhone("+91 98765 65432");
        cybernexProfile.setWebsite("https://cybernex.example.com");
        cybernexProfile.setIndustry("Cybersecurity & Forensics");
        cybernexProfile.setCompanyDescription("Specialized next-gen zero trust threat prevention and cybersecurity operations.");
        cybernexProfile.setCompanySize("100-500");
        cybernexProfile.setHeadOffice("Pune, Maharashtra");
        cybernexProfile.setHrName("Sameer Joshi");
        cybernexProfile.setHrDesignation("Recruitment Specialist");
        cybernexProfile.setVerified(false);
        recruiterProfileRepository.save(cybernexProfile);

        Company cybernexCompany = new Company();
        cybernexCompany.setCompanyName("CyberNex Labs");
        cybernexCompany.setIndustry("Cybersecurity");
        cybernexCompany.setWebsite("https://cybernex.example.com");
        cybernexCompany.setDescription("Enterprise Threat Intelligence and Zero-Trust defense systems.");
        cybernexCompany.setHrEmail("talent@cybernex.com");
        cybernexCompany.setHrPhone("7770005555");
        cybernexCompany.setAddressLine1("Magarpatta Cybercity");
        cybernexCompany.setCity("Pune");
        cybernexCompany.setState("Maharashtra");
        cybernexCompany.setCountry("India");
        cybernexCompany.setPincode("411028");
        cybernexCompany.setCompanyStatus("PENDING");
        companyRepository.save(cybernexCompany);

        // 4. Students

        // 4a. Alex Mercer (Primary Student Demo - CSE 9.2 CGPA)
        User std1User = new User();
        std1User.setFirstName("Alex");
        std1User.setLastName("Mercer");
        std1User.setEmail("student.demo@indus.edu");
        std1User.setPhoneNumber("6660001111");
        std1User.setPassword(commonPassword);
        std1User.setRole("STUDENT");
        std1User.setAccountStatus("ACTIVE");
        userRepository.save(std1User);

        StudentProfile std1 = new StudentProfile();
        std1.setUser(std1User);
        std1.setEnrollmentNumber("IU-2022-CSE-042");
        std1.setDepartment("Computer Science & Engineering");
        std1.setSemester(8);
        std1.setSection("A");
        std1.setCgpa(new BigDecimal("9.20"));
        std1.setPassingYear(2026);
        std1.setGender("Male");
        std1.setDateOfBirth(LocalDate.of(2003, 5, 14));
        std1.setAddressLine1("42 Innovation Drive");
        std1.setCity("Ahmedabad");
        std1.setState("Gujarat");
        std1.setCountry("India");
        std1.setPincode("380054");
        std1.setActiveBacklogs(0);
        std1.setTotalBacklogs(0);
        std1.setTenthPercentage(new BigDecimal("94.50"));
        std1.setTwelfthPercentage(new BigDecimal("91.20"));
        std1.setTechnicalSkills("Java, Spring Boot, React, MySQL, Docker, Microservices, Python");
        std1.setSoftSkills("Leadership, Team Collaboration, Problem Solving, Communication");
        std1.setCertifications("Oracle Certified Professional Java SE, AWS Certified Solutions Architect Associate");
        std1.setAchievements("1st Place in University Hackathon 2025, Top 5% on LeetCode");
        std1.setLinkedinUrl("https://linkedin.com/in/alex-mercer-demo");
        std1.setGithubUrl("https://github.com/alex-mercer-demo");
        std1.setResumeUrl("uploads/samples/sample-resume.pdf");
        std1.setPlacementStatus("SHORTLISTED");
        std1.setPreferredJobLocation("Bengaluru / Pune");
        std1.setPreferredJobType("Full-Time");
        std1.setProfileCompleted(true);
        std1.setResumeUploaded(true);
        studentProfileRepository.save(std1);

        // 4b. Emma Watson (ECE 8.8 CGPA - Placed)
        User std2User = new User();
        std2User.setFirstName("Emma");
        std2User.setLastName("Watson");
        std2User.setEmail("emma.w@indus.edu");
        std2User.setPhoneNumber("6660002222");
        std2User.setPassword(commonPassword);
        std2User.setRole("STUDENT");
        std2User.setAccountStatus("ACTIVE");
        userRepository.save(std2User);

        StudentProfile std2 = new StudentProfile();
        std2.setUser(std2User);
        std2.setEnrollmentNumber("IU-2022-ECE-018");
        std2.setDepartment("Electronics & Communication");
        std2.setSemester(8);
        std2.setSection("B");
        std2.setCgpa(new BigDecimal("8.80"));
        std2.setPassingYear(2026);
        std2.setGender("Female");
        std2.setDateOfBirth(LocalDate.of(2003, 8, 22));
        std2.setCity("Gandhinagar");
        std2.setState("Gujarat");
        std2.setCountry("India");
        std2.setPincode("382010");
        std2.setActiveBacklogs(0);
        std2.setTotalBacklogs(0);
        std2.setTenthPercentage(new BigDecimal("96.00"));
        std2.setTwelfthPercentage(new BigDecimal("93.50"));
        std2.setTechnicalSkills("React, JavaScript, TypeScript, Embedded Systems, IoT, Node.js");
        std2.setSoftSkills("Agile Development, Analytical Thinking");
        std2.setResumeUrl("uploads/samples/sample-resume.pdf");
        std2.setPlacementStatus("PLACED");
        std2.setProfileCompleted(true);
        std2.setResumeUploaded(true);
        studentProfileRepository.save(std2);

        // 4c. Rahul Sharma (IT 7.9 CGPA - Offered)
        User std3User = new User();
        std3User.setFirstName("Rahul");
        std3User.setLastName("Sharma");
        std3User.setEmail("rahul.s@indus.edu");
        std3User.setPhoneNumber("6660003333");
        std3User.setPassword(commonPassword);
        std3User.setRole("STUDENT");
        std3User.setAccountStatus("ACTIVE");
        userRepository.save(std3User);

        StudentProfile std3 = new StudentProfile();
        std3.setUser(std3User);
        std3.setEnrollmentNumber("IU-2022-IT-029");
        std3.setDepartment("Information Technology");
        std3.setSemester(8);
        std3.setSection("A");
        std3.setCgpa(new BigDecimal("7.90"));
        std3.setPassingYear(2026);
        std3.setGender("Male");
        std3.setCity("Vadodara");
        std3.setState("Gujarat");
        std3.setCountry("India");
        std3.setPincode("390001");
        std3.setActiveBacklogs(0);
        std3.setTotalBacklogs(0);
        std3.setTenthPercentage(new BigDecimal("88.00"));
        std3.setTwelfthPercentage(new BigDecimal("85.00"));
        std3.setTechnicalSkills("Java, Spring Boot, SQL, Git, Linux");
        std3.setResumeUrl("uploads/samples/sample-resume.pdf");
        std3.setPlacementStatus("OFFERED");
        std3.setProfileCompleted(true);
        std3.setResumeUploaded(true);
        studentProfileRepository.save(std3);

        // 4d. Priya Patel (Mechanical 8.4 CGPA - Unplaced)
        User std4User = new User();
        std4User.setFirstName("Priya");
        std4User.setLastName("Patel");
        std4User.setEmail("priya.p@indus.edu");
        std4User.setPhoneNumber("6660004444");
        std4User.setPassword(commonPassword);
        std4User.setRole("STUDENT");
        std4User.setAccountStatus("ACTIVE");
        userRepository.save(std4User);

        StudentProfile std4 = new StudentProfile();
        std4.setUser(std4User);
        std4.setEnrollmentNumber("IU-2022-MECH-012");
        std4.setDepartment("Mechanical Engineering");
        std4.setSemester(8);
        std4.setSection("A");
        std4.setCgpa(new BigDecimal("8.40"));
        std4.setPassingYear(2026);
        std4.setGender("Female");
        std4.setCity("Surat");
        std4.setState("Gujarat");
        std4.setCountry("India");
        std4.setPincode("395007");
        std4.setActiveBacklogs(0);
        std4.setTotalBacklogs(0);
        std4.setTenthPercentage(new BigDecimal("91.00"));
        std4.setTwelfthPercentage(new BigDecimal("89.00"));
        std4.setTechnicalSkills("AutoCAD, SolidWorks, Python, MATLAB, Data Analysis");
        std4.setResumeUrl("uploads/samples/sample-resume.pdf");
        std4.setPlacementStatus("UNPLACED");
        std4.setProfileCompleted(true);
        std4.setResumeUploaded(true);
        studentProfileRepository.save(std4);

        // 4e. Rohan Gupta (CSE 6.5 CGPA, 1 Backlog - Unplaced)
        User std5User = new User();
        std5User.setFirstName("Rohan");
        std5User.setLastName("Gupta");
        std5User.setEmail("rohan.g@indus.edu");
        std5User.setPhoneNumber("6660005555");
        std5User.setPassword(commonPassword);
        std5User.setRole("STUDENT");
        std5User.setAccountStatus("ACTIVE");
        userRepository.save(std5User);

        StudentProfile std5 = new StudentProfile();
        std5.setUser(std5User);
        std5.setEnrollmentNumber("IU-2022-CSE-089");
        std5.setDepartment("Computer Science & Engineering");
        std5.setSemester(6);
        std5.setSection("C");
        std5.setCgpa(new BigDecimal("6.50"));
        std5.setPassingYear(2027);
        std5.setGender("Male");
        std5.setCity("Rajkot");
        std5.setState("Gujarat");
        std5.setCountry("India");
        std5.setPincode("360001");
        std5.setActiveBacklogs(1);
        std5.setTotalBacklogs(2);
        std5.setTenthPercentage(new BigDecimal("78.00"));
        std5.setTwelfthPercentage(new BigDecimal("74.00"));
        std5.setTechnicalSkills("HTML, CSS, JavaScript, Basic Java, MySQL");
        std5.setResumeUrl("uploads/samples/sample-resume.pdf");
        std5.setPlacementStatus("UNPLACED");
        std5.setProfileCompleted(true);
        std5.setResumeUploaded(true);
        studentProfileRepository.save(std5);

        // 5. Jobs

        // 5a. TechCorp - Full Stack Java Developer
        Job job1 = new Job();
        job1.setRecruiter(techcorpProfile);
        job1.setTitle("Full Stack Java Developer");
        job1.setDepartment("Engineering");
        job1.setLocation("Bengaluru / Hybrid");
        job1.setDescription("Build enterprise cloud applications utilizing Java 21, Spring Boot, and modern React architectures.");
        job1.setResponsibilities("Design microservices, write clean unit-tested code, collaborate with UI/UX engineers.");
        job1.setRequirements("Strong proficiency in Core Java, Spring Boot, JPA, REST APIs, and SQL.");
        job1.setEmploymentType("Full-Time");
        job1.setWorkMode("Hybrid");
        job1.setMinimumSalary(new BigDecimal("850000.00"));
        job1.setMaximumSalary(new BigDecimal("1200000.00"));
        job1.setMinimumCgpa(new BigDecimal("7.50"));
        job1.setAllowedBacklogs(0);
        job1.setExperienceRequired(0);
        job1.setRequiredSkills("Java, Spring Boot, MySQL, REST APIs");
        job1.setVacancies(10);
        job1.setJdFileUrl("uploads/samples/sample-jd.pdf");
        job1.setApplicationDeadline(LocalDate.now().plusDays(30));
        job1.setStatus("OPEN");
        jobRepository.save(job1);

        // 5b. TechCorp - Cloud DevOps Engineer
        Job job2 = new Job();
        job2.setRecruiter(techcorpProfile);
        job2.setTitle("Cloud DevOps Engineer");
        job2.setDepartment("Infrastructure");
        job2.setLocation("Bengaluru / On-Site");
        job2.setDescription("Manage CI/CD pipelines, containerized Kubernetes deployments, and cloud infrastructure monitoring.");
        job2.setResponsibilities("Automate deployment workflows, configure Terraform infrastructure, monitor uptime.");
        job2.setRequirements("Knowledge of Linux, Docker, Kubernetes, AWS/Azure, and Shell scripting.");
        job2.setEmploymentType("Full-Time");
        job2.setWorkMode("On-Site");
        job2.setMinimumSalary(new BigDecimal("1000000.00"));
        job2.setMaximumSalary(new BigDecimal("1500000.00"));
        job2.setMinimumCgpa(new BigDecimal("8.00"));
        job2.setAllowedBacklogs(0);
        job2.setExperienceRequired(0);
        job2.setRequiredSkills("Linux, Docker, Kubernetes, AWS, CI/CD");
        job2.setVacancies(5);
        job2.setJdFileUrl("uploads/samples/sample-jd.pdf");
        job2.setApplicationDeadline(LocalDate.now().plusDays(20));
        job2.setStatus("OPEN");
        jobRepository.save(job2);

        // 5c. CloudScale - Frontend React Specialist
        Job job3 = new Job();
        job3.setRecruiter(cloudscaleProfile);
        job3.setTitle("Frontend React Specialist");
        job3.setDepartment("Product Engineering");
        job3.setLocation("Hyderabad / Remote");
        job3.setDescription("Craft state-of-the-art responsive user interfaces and high-performance Web applications.");
        job3.setResponsibilities("Develop responsive React components, optimize bundle sizes, write maintainable CSS.");
        job3.setRequirements("Deep understanding of JavaScript (ES6+), React Hooks, CSS/SCSS, and state management.");
        job3.setEmploymentType("Full-Time");
        job3.setWorkMode("Remote");
        job3.setMinimumSalary(new BigDecimal("700000.00"));
        job3.setMaximumSalary(new BigDecimal("1050000.00"));
        job3.setMinimumCgpa(new BigDecimal("7.00"));
        job3.setAllowedBacklogs(1);
        job3.setExperienceRequired(0);
        job3.setRequiredSkills("React, JavaScript, HTML5, CSS3, Redux/Context");
        job3.setVacancies(8);
        job3.setJdFileUrl("uploads/samples/sample-jd.pdf");
        job3.setApplicationDeadline(LocalDate.now().plusDays(25));
        job3.setStatus("OPEN");
        jobRepository.save(job3);

        // 5d. CloudScale - Data Platform Analyst
        Job job4 = new Job();
        job4.setRecruiter(cloudscaleProfile);
        job4.setTitle("Data Platform Analyst");
        job4.setDepartment("Data Science");
        job4.setLocation("Hyderabad / Hybrid");
        job4.setDescription("Analyze enterprise datasets, build automated ETL reporting pipelines, and assist ML model deployments.");
        job4.setResponsibilities("Write advanced SQL queries, build dashboards, automate daily data pipelines.");
        job4.setRequirements("Proficiency in Python, SQL, Tableau/PowerBI, and Data warehousing concepts.");
        job4.setEmploymentType("Full-Time");
        job4.setWorkMode("Hybrid");
        job4.setMinimumSalary(new BigDecimal("1100000.00"));
        job4.setMaximumSalary(new BigDecimal("1400000.00"));
        job4.setMinimumCgpa(new BigDecimal("8.50"));
        job4.setAllowedBacklogs(0);
        job4.setExperienceRequired(0);
        job4.setRequiredSkills("Python, SQL, Data Analysis, PowerBI");
        job4.setVacancies(4);
        job4.setJdFileUrl("uploads/samples/sample-jd.pdf");
        job4.setApplicationDeadline(LocalDate.now().plusDays(15));
        job4.setStatus("OPEN");
        jobRepository.save(job4);

        // 6. Job Applications across exact stages

        // 6a. Alex Mercer -> Full Stack Java Developer (SHORTLISTED)
        JobApplication app1 = new JobApplication();
        app1.setStudent(std1);
        app1.setJob(job1);
        app1.setApplicationStatus("SHORTLISTED");
        app1.setCoverLetter("Excited to apply for Java Developer position with hands-on Spring Boot project expertise.");
        jobApplicationRepository.save(app1);

        // 6b. Alex Mercer -> Cloud DevOps Engineer (INTERVIEW_SCHEDULED)
        JobApplication app2 = new JobApplication();
        app2.setStudent(std1);
        app2.setJob(job2);
        app2.setApplicationStatus("INTERVIEW_SCHEDULED");
        app2.setInterviewDate(LocalDate.now().plusDays(3).toString());
        app2.setInterviewTime("14:30 IST");
        app2.setInterviewLink("https://meet.google.com/prms-demo-interview");
        app2.setInterviewInstructions("Please have your Docker / Linux architecture diagram ready for screen share.");
        app2.setCoverLetter("Passionate about cloud architecture and Kubernetes orchestration.");
        jobApplicationRepository.save(app2);

        // 6c. Emma Watson -> Frontend React Specialist (OFFER_ACCEPTED)
        JobApplication app3 = new JobApplication();
        app3.setStudent(std2);
        app3.setJob(job3);
        app3.setApplicationStatus("OFFER_ACCEPTED");
        app3.setJoiningDate(LocalDate.now().plusDays(45).toString());
        app3.setCoverLetter("Proficient in React component design and modern frontend animations.");
        jobApplicationRepository.save(app3);

        // 6d. Emma Watson -> Data Platform Analyst (UNDER_REVIEW)
        JobApplication app4 = new JobApplication();
        app4.setStudent(std2);
        app4.setJob(job4);
        app4.setApplicationStatus("UNDER_REVIEW");
        app4.setCoverLetter("Eager to contribute analytical problem-solving skills.");
        jobApplicationRepository.save(app4);

        // 6e. Rahul Sharma -> Full Stack Java Developer (SELECTED)
        JobApplication app5 = new JobApplication();
        app5.setStudent(std3);
        app5.setJob(job1);
        app5.setApplicationStatus("SELECTED");
        app5.setJoiningDate(LocalDate.now().plusDays(60).toString());
        app5.setCoverLetter("Proven track record in building REST API microservices with JPA.");
        jobApplicationRepository.save(app5);

        // 6f. Rahul Sharma -> Frontend React Specialist (APPLIED)
        JobApplication app6 = new JobApplication();
        app6.setStudent(std3);
        app6.setJob(job3);
        app6.setApplicationStatus("APPLIED");
        app6.setCoverLetter("Looking forward to learning and expanding React skills.");
        jobApplicationRepository.save(app6);

        // 6g. Priya Patel -> Cloud DevOps Engineer (REJECTED)
        JobApplication app7 = new JobApplication();
        app7.setStudent(std4);
        app7.setJob(job2);
        app7.setApplicationStatus("REJECTED");
        app7.setCoverLetter("Interested in exploring industrial automation and cloud systems.");
        jobApplicationRepository.save(app7);

        // 6h. Rohan Gupta -> Frontend React Specialist (APPLIED)
        JobApplication app8 = new JobApplication();
        app8.setStudent(std5);
        app8.setJob(job3);
        app8.setApplicationStatus("APPLIED");
        app8.setCoverLetter("Enthusiastic beginner web developer.");
        jobApplicationRepository.save(app8);

        // 7. Placement Records

        // 7a. Emma Watson -> CloudScale Inc. (ACCEPTED)
        PlacementRecord place1 = new PlacementRecord();
        place1.setStudent(std2);
        place1.setRecruiter(cloudscaleProfile);
        place1.setJob(job3);
        place1.setCompanyName("CloudScale Inc.");
        place1.setJobTitle("Frontend React Specialist");
        place1.setPackageAmount(new BigDecimal("950000.00"));
        place1.setEmploymentType("Full-Time");
        place1.setWorkLocation("Hyderabad / Remote");
        place1.setOfferDate(LocalDate.now().minusDays(5));
        place1.setJoiningDate(LocalDate.now().plusDays(45));
        place1.setOfferStatus("ACCEPTED");
        place1.setRemarks("Selected following stellar technical performance in React assignment.");
        placementRecordRepository.save(place1);

        // 7b. Rahul Sharma -> TechCorp Solutions (OFFERED)
        PlacementRecord place2 = new PlacementRecord();
        place2.setStudent(std3);
        place2.setRecruiter(techcorpProfile);
        place2.setJob(job1);
        place2.setCompanyName("TechCorp Solutions");
        place2.setJobTitle("Full Stack Java Developer");
        place2.setPackageAmount(new BigDecimal("850000.00"));
        place2.setEmploymentType("Full-Time");
        place2.setWorkLocation("Bengaluru / Hybrid");
        place2.setOfferDate(LocalDate.now().minusDays(2));
        place2.setJoiningDate(LocalDate.now().plusDays(60));
        place2.setOfferStatus("OFFERED");
        place2.setRemarks("Official offer letter issued.");
        placementRecordRepository.save(place2);
    }

    @Override
    public Map<String, Object> getDemoAccountsInfo() {
        Map<String, Object> accounts = new LinkedHashMap<>();

        accounts.put("student", Map.of(
                "role", "STUDENT",
                "email", "student.demo@indus.edu",
                "password", "Demo@1234",
                "name", "Alex Mercer",
                "details", "Final Year CSE (9.2 CGPA)"
        ));

        accounts.put("recruiter", Map.of(
                "role", "RECRUITER",
                "email", "recruiter.demo@techcorp.com",
                "password", "Demo@1234",
                "name", "Priya Nair",
                "details", "TechCorp Solutions HR"
        ));

        accounts.put("tpo", Map.of(
                "role", "TPO",
                "email", "tpo.demo@indus.edu",
                "password", "Demo@1234",
                "name", "Prof. Rajesh Sharma",
                "details", "Training & Placement Officer"
        ));

        accounts.put("vc", Map.of(
                "role", "VC",
                "email", "vc.demo@indus.edu",
                "password", "Demo@1234",
                "name", "Dr. K.S. Verma",
                "details", "Vice Chancellor (Highest Authority)"
        ));

        return accounts;
    }
}

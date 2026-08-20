package com.prms.service.file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.prms.validation.FileValidator;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.job-description.dir:uploads/job-descriptions}")
    private String jobDescriptionDirectory;

    @Value("${app.resume.dir:uploads/resumes}")
    private String resumeDirectory;

    @Value("${app.profile-image.dir:uploads/profile-images}")
    private String profileImageDirectory;

    @Value("${app.company-logo.dir:uploads/company-logos}")
    private String companyLogoDirectory;

    @Value("${app.demo.enabled:false}")
    private boolean demoEnabled;

    @Autowired
    private FileValidator fileValidator;

    @PostConstruct
    public void initSampleFiles() {
        try {
            Path samplesPath = Paths.get("uploads", "samples");
            if (!Files.exists(samplesPath)) {
                Files.createDirectories(samplesPath);
            }
            
            // Create formatted sample resume PDF
            Path sampleResume = samplesPath.resolve("sample-resume.pdf");
            String resumeStream = "BT\n"
                    + "/F1 18 Tf\n50 780 Td\n(PRMS DEMO SANDBOX - CANDIDATE RESUME) Tj\n"
                    + "0 -22 Td\n/F1 10 Tf\n(========================================================================) Tj\n"
                    + "0 -28 Td\n/F1 14 Tf\n(NAME: Aarav Mehta) Tj\n"
                    + "0 -20 Td\n/F1 11 Tf\n(EMAIL: student.demo@indus.edu  |  PHONE: +91 6660001111) Tj\n"
                    + "0 -18 Td\n(ENROLLMENT: IU-2022-CSE-042  |  DEPT: Computer Science & Engineering) Tj\n"
                    + "0 -18 Td\n(ACADEMIC RECORD: CGPA: 9.20 / 10  |  10th: 94.5%  |  12th: 91.2%  |  Active Backlogs: 0) Tj\n"
                    + "0 -30 Td\n/F1 13 Tf\n(TECHNICAL SKILLS & CERTIFICATIONS) Tj\n"
                    + "0 -18 Td\n/F1 11 Tf\n(Core Java, Spring Boot, Microservices, React.js, MySQL, Docker, REST APIs, Python) Tj\n"
                    + "0 -18 Td\n(AWS Certified Solutions Architect Associate | Oracle Certified Professional Java SE) Tj\n"
                    + "0 -30 Td\n/F1 13 Tf\n(CAMPUS PLACEMENT WORKFLOW VERIFICATION) Tj\n"
                    + "0 -18 Td\n/F1 11 Tf\n(Status: VERIFIED DEMO CANDIDATE - Simulates Full 4-Stage Interview & Placement Flow) Tj\n"
                    + "0 -18 Td\n(Target Roles: Full Stack Java Developer / Cloud DevOps Engineer) Tj\n"
                    + "ET";
            byte[] resumePdf = createPdfDocument(resumeStream);
            Files.write(sampleResume, resumePdf);

            // Create formatted sample job description PDF
            Path sampleJd = samplesPath.resolve("sample-jd.pdf");
            String jdStream = "BT\n"
                    + "/F1 18 Tf\n50 780 Td\n(PRMS DEMO SANDBOX - JOB DESCRIPTION) Tj\n"
                    + "0 -22 Td\n/F1 10 Tf\n(========================================================================) Tj\n"
                    + "0 -28 Td\n/F1 14 Tf\n(POSITION: Cloud DevOps Engineer / Full Stack Java Developer) Tj\n"
                    + "0 -20 Td\n/F1 11 Tf\n(COMPANY: TechCorp Solutions  |  LOCATION: Bengaluru / Pune / Hybrid) Tj\n"
                    + "0 -18 Td\n(COMPENSATION: Rs. 8,50,000 - Rs. 14,00,000 LPA  |  TYPE: Full-Time Permanent) Tj\n"
                    + "0 -18 Td\n(ELIGIBILITY CRITERIA: Minimum CGPA >= 7.50  |  Max Backlogs Allowed: 0) Tj\n"
                    + "0 -30 Td\n/F1 13 Tf\n(ROLE OVERVIEW & RESPONSIBILITIES) Tj\n"
                    + "0 -18 Td\n/F1 11 Tf\n(Design, develop, and maintain high-performance cloud infrastructure and microservices.) Tj\n"
                    + "0 -18 Td\n(Collaborate with Agile teams across sprint cycles and automated CI/CD pipelines.) Tj\n"
                    + "0 -30 Td\n/F1 13 Tf\n(DEMO SIMULATION SPECIFICATION) Tj\n"
                    + "0 -18 Td\n/F1 11 Tf\n(This document represents an official demo sandbox job specification for placement drives.) Tj\n"
                    + "ET";
            byte[] jdPdf = createPdfDocument(jdStream);
            Files.write(sampleJd, jdPdf);
        } catch (Exception ignored) {
        }
    }

    private byte[] createPdfDocument(String streamContent) {
        int streamLength = streamContent.getBytes(java.nio.charset.StandardCharsets.UTF_8).length;
        StringBuilder sb = new StringBuilder();
        sb.append("%PDF-1.4\n");
        sb.append("1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n");
        sb.append("2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n");
        sb.append("3 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>\nendobj\n");
        sb.append("4 0 obj\n<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>\nendobj\n");
        sb.append("5 0 obj\n<</Length ").append(streamLength).append(">>\nstream\n");
        sb.append(streamContent).append("\nendstream\nendobj\n");
        sb.append("xref\n0 6\n");
        sb.append("0000000000 65535 f \n");
        sb.append("0000000009 00000 n \n");
        sb.append("0000000058 00000 n \n");
        sb.append("0000000115 00000 n \n");
        sb.append("0000000234 00000 n \n");
        sb.append("0000000302 00000 n \n");
        sb.append("trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n");
        sb.append(360 + streamLength).append("\n%%EOF\n");
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    @Override
    public String uploadResume(MultipartFile file) {
        fileValidator.validateResume(file);
        if (demoEnabled) {
            return "uploads/samples/sample-resume.pdf";
        }
        return saveFile(file, resumeDirectory);
    }

    @Override
    public String uploadJobDescription(MultipartFile file) {
        fileValidator.validateJobDescription(file);
        if (demoEnabled) {
            return "uploads/samples/sample-jd.pdf";
        }
        return saveFile(file, jobDescriptionDirectory);
    }

    @Override
    public String uploadProfileImage(MultipartFile file) {
        fileValidator.validateImage(file, "Profile Image");
        return saveFile(file, profileImageDirectory);
    }

    @Override
    public String uploadCompanyLogo(MultipartFile file) {
        fileValidator.validateImage(file, "Company Logo");
        return saveFile(file, companyLogoDirectory);
    }

    private String saveFile(MultipartFile file, String directory) {
        try {
            Path uploadPath = Paths.get(directory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase()
                    : "";

            String fileName = UUID.randomUUID() + extension;
            Path destination = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return destination.toString().replace("\\", "/");
        } catch (IOException e) {
            throw new RuntimeException("Failed to save uploaded file.");
        }
    }
}
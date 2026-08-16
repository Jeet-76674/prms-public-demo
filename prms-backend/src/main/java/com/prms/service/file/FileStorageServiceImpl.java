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
            // Create dummy sample pdf files if not existing
            Path sampleResume = samplesPath.resolve("sample-resume.pdf");
            if (!Files.exists(sampleResume)) {
                byte[] minimalPdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000102 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n180\n%%EOF".getBytes();
                Files.write(sampleResume, minimalPdf);
            }
            Path sampleJd = samplesPath.resolve("sample-jd.pdf");
            if (!Files.exists(sampleJd)) {
                byte[] minimalPdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000102 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n180\n%%EOF".getBytes();
                Files.write(sampleJd, minimalPdf);
            }
        } catch (Exception ignored) {
        }
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
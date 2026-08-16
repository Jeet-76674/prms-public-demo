package com.prms.service.studentprofile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.StudentProfileRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.StudentProfileResponse;
import com.prms.entity.StudentProfile;
import com.prms.entity.User;
import com.prms.repository.StudentProfileRepository;
import com.prms.repository.UserRepository;
import com.prms.security.SecurityUtil;
import com.prms.service.file.FileStorageService;

@Service
public class StudentProfileServiceImpl implements StudentProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SecurityUtil securityUtil;
    
    @Autowired
	private FileStorageService fileStorageService;

    @Override
    public StudentProfileResponse createProfile(
            StudentProfileRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        if (!"STUDENT".equalsIgnoreCase(currentUser.getRole())) {
            throw new RuntimeException(
                    "Only students can create profile."
            );
        }

        if (studentProfileRepository.findByUserId(currentUser.getId()).isPresent()) {
            throw new RuntimeException(
                    "Profile already exists."
            );
        }

        if (studentProfileRepository.existsByEnrollmentNumber(
                request.getEnrollmentNumber())) {

            throw new RuntimeException(
                    "Enrollment number already exists."
            );
        }

        StudentProfile profile = new StudentProfile();

        profile.setUser(currentUser);

        profile.setEnrollmentNumber(request.getEnrollmentNumber());
        profile.setDepartment(request.getDepartment());
        profile.setSemester(request.getSemester());
        profile.setSection(request.getSection());
        profile.setCgpa(request.getCgpa());
        profile.setPassingYear(request.getPassingYear());

        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setAddressLine1(request.getAddressLine1());
        profile.setAddressLine2(request.getAddressLine2());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setCountry(request.getCountry());
        profile.setPincode(request.getPincode());

        profile.setActiveBacklogs(request.getActiveBacklogs());
        profile.setTotalBacklogs(request.getTotalBacklogs());

        profile.setTenthPercentage(request.getTenthPercentage());
        profile.setTwelfthPercentage(request.getTwelfthPercentage());
        profile.setDiplomaPercentage(request.getDiplomaPercentage());

        profile.setTechnicalSkills(request.getTechnicalSkills());
        profile.setSoftSkills(request.getSoftSkills());

        profile.setCertifications(request.getCertifications());
        profile.setAchievements(request.getAchievements());

        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setLeetcodeUrl(request.getLeetcodeUrl());
        profile.setHackerrankUrl(request.getHackerrankUrl());

        profile.setPreferredJobLocation(
                request.getPreferredJobLocation());

        profile.setPreferredJobType(
                request.getPreferredJobType());

        profile.setProfileCompleted(true);

        StudentProfile savedProfile =
                studentProfileRepository.save(profile);

        return mapToResponse(savedProfile);
    }
    
    private StudentProfileResponse mapToResponse(StudentProfile profile) {

        StudentProfileResponse response = new StudentProfileResponse();

        response.setId(profile.getId());

        // User Details
        response.setFirstName(profile.getUser().getFirstName());
        response.setLastName(profile.getUser().getLastName());
        response.setEmail(profile.getUser().getEmail());
        response.setPhoneNumber(profile.getUser().getPhoneNumber());

        // Academic Details
        response.setEnrollmentNumber(profile.getEnrollmentNumber());
        response.setDepartment(profile.getDepartment());
        response.setSemester(profile.getSemester());
        response.setSection(profile.getSection());
        response.setCgpa(profile.getCgpa());
        response.setPassingYear(profile.getPassingYear());

        // Personal Details
        response.setGender(profile.getGender());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setAddressLine1(profile.getAddressLine1());
        response.setAddressLine2(profile.getAddressLine2());
        response.setCity(profile.getCity());
        response.setState(profile.getState());
        response.setCountry(profile.getCountry());
        response.setPincode(profile.getPincode());

        // Education
        response.setActiveBacklogs(profile.getActiveBacklogs());
        response.setTotalBacklogs(profile.getTotalBacklogs());

        response.setTenthPercentage(profile.getTenthPercentage());
        response.setTwelfthPercentage(profile.getTwelfthPercentage());
        response.setDiplomaPercentage(profile.getDiplomaPercentage());

        // Skills
        response.setTechnicalSkills(profile.getTechnicalSkills());
        response.setSoftSkills(profile.getSoftSkills());

        response.setCertifications(profile.getCertifications());
        response.setAchievements(profile.getAchievements());

        // Links
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setGithubUrl(profile.getGithubUrl());
        response.setPortfolioUrl(profile.getPortfolioUrl());
        response.setLeetcodeUrl(profile.getLeetcodeUrl());
        response.setHackerrankUrl(profile.getHackerrankUrl());

        // Resume and Image
        response.setProfileImageUrl(profile.getProfileImageUrl());
        response.setResumeUrl(profile.getResumeUrl());

        // Placement
        response.setPlacementStatus(profile.getPlacementStatus());
        response.setPreferredJobLocation(profile.getPreferredJobLocation());
        response.setPreferredJobType(profile.getPreferredJobType());

        // Status
        response.setProfileCompleted(profile.getProfileCompleted());
        response.setResumeUploaded(profile.getResumeUploaded());

        return response;
    }
    
    @Override
    public StudentProfileResponse getMyProfile() {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile profile = studentProfileRepository
                .findByUserId(currentUser.getId())
                .orElseThrow(() ->
                        new RuntimeException("Profile not found."));

        return mapToResponse(profile);

    }

    @Override
    public StudentProfileResponse updateProfile(
            StudentProfileRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile profile = studentProfileRepository
                .findByUserId(currentUser.getId())
                .orElseThrow(() ->
                        new RuntimeException("Profile not found."));

        if (request.getEnrollmentNumber() != null 
                && !request.getEnrollmentNumber().equals(profile.getEnrollmentNumber())
                && studentProfileRepository.existsByEnrollmentNumber(
                        request.getEnrollmentNumber())) {

            throw new RuntimeException(
                    "Enrollment number already exists.");
        }

        profile.setEnrollmentNumber(request.getEnrollmentNumber());

        profile.setDepartment(request.getDepartment());
        profile.setSemester(request.getSemester());
        profile.setSection(request.getSection());

        profile.setCgpa(request.getCgpa());
        profile.setPassingYear(request.getPassingYear());

        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());

        profile.setAddressLine1(request.getAddressLine1());
        profile.setAddressLine2(request.getAddressLine2());

        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setCountry(request.getCountry());
        profile.setPincode(request.getPincode());

        profile.setActiveBacklogs(request.getActiveBacklogs());
        profile.setTotalBacklogs(request.getTotalBacklogs());

        profile.setTenthPercentage(request.getTenthPercentage());
        profile.setTwelfthPercentage(request.getTwelfthPercentage());
        profile.setDiplomaPercentage(request.getDiplomaPercentage());

        profile.setTechnicalSkills(request.getTechnicalSkills());
        profile.setSoftSkills(request.getSoftSkills());

        profile.setCertifications(request.getCertifications());
        profile.setAchievements(request.getAchievements());

        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setLeetcodeUrl(request.getLeetcodeUrl());
        profile.setHackerrankUrl(request.getHackerrankUrl());

        profile.setPreferredJobLocation(
                request.getPreferredJobLocation());

        profile.setPreferredJobType(
                request.getPreferredJobType());

        profile.setProfileCompleted(true);

        StudentProfile updatedProfile =
                studentProfileRepository.save(profile);

        return mapToResponse(updatedProfile);
    }
    
    @Override
    public FileUploadResponse uploadResume(
            MultipartFile file) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile profile = studentProfileRepository
                .findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(currentUser);
                    return studentProfileRepository.save(newProfile);
                });

        String filePath =
                fileStorageService.uploadResume(file);

        profile.setResumeUrl(filePath);

        profile.setResumeUploaded(true);

        studentProfileRepository.save(profile);

        return new FileUploadResponse(
                true,
                "Resume uploaded successfully.",
                filePath
        );

    }
    
    @Override
    public FileUploadResponse uploadProfileImage(
            MultipartFile file) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile profile = studentProfileRepository
                .findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(currentUser);
                    return studentProfileRepository.save(newProfile);
                });

        String filePath =
                fileStorageService
                        .uploadProfileImage(file);

        profile.setProfileImageUrl(filePath);

        studentProfileRepository.save(profile);

        return new FileUploadResponse(
                true,
                "Profile image uploaded successfully.",
                filePath
        );

    }

}
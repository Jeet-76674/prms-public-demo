package com.prms.service.recruiterprofile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.RecruiterProfileRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.User;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.repository.UserRepository;
import com.prms.security.SecurityUtil;
import com.prms.service.file.FileStorageService;

@Service
public class RecruiterProfileServiceImpl
        implements RecruiterProfileService {

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public RecruiterProfileResponse createProfile(
            RecruiterProfileRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        if (!"RECRUITER".equalsIgnoreCase(currentUser.getRole())) {
            throw new RuntimeException(
                    "Only recruiters can create company profile."
            );
        }

        if (recruiterProfileRepository
                .findByUserId(currentUser.getId())
                .isPresent()) {

            throw new RuntimeException(
                    "Company profile already exists."
            );
        }

        if (recruiterProfileRepository.existsByCompanyEmail(
                request.getCompanyEmail())) {

            throw new RuntimeException(
                    "Company email already registered."
            );
        }

        if (recruiterProfileRepository.existsByCompanyPhone(
                request.getCompanyPhone())) {

            throw new RuntimeException(
                    "Company phone already registered."
            );
        }

        RecruiterProfile recruiterProfile =
                new RecruiterProfile();

        recruiterProfile.setUser(currentUser);

        recruiterProfile.setCompanyName(
                request.getCompanyName());

        recruiterProfile.setCompanyEmail(
                request.getCompanyEmail());

        recruiterProfile.setCompanyPhone(
                request.getCompanyPhone());

        recruiterProfile.setWebsite(
                request.getWebsite());

        recruiterProfile.setIndustry(
                request.getIndustry());

        recruiterProfile.setCompanyDescription(
                request.getCompanyDescription());

        recruiterProfile.setCompanySize(
                request.getCompanySize());

        recruiterProfile.setHeadOffice(
                request.getHeadOffice());

        recruiterProfile.setHrName(
                request.getHrName());

        recruiterProfile.setHrDesignation(
                request.getHrDesignation());

        recruiterProfile.setLinkedin(
                request.getLinkedin());

        recruiterProfile.setVerified(false);

        RecruiterProfile savedProfile =
                recruiterProfileRepository.save(
                        recruiterProfile);

        return mapToResponse(savedProfile);

    }
    
    private RecruiterProfileResponse mapToResponse(
            RecruiterProfile profile) {

        RecruiterProfileResponse response =
                new RecruiterProfileResponse();

        response.setId(profile.getId());

        response.setCompanyName(
                profile.getCompanyName());

        response.setCompanyEmail(
                profile.getCompanyEmail());

        response.setCompanyPhone(
                profile.getCompanyPhone());

        response.setWebsite(
                profile.getWebsite());

        response.setIndustry(
                profile.getIndustry());

        response.setCompanyDescription(
                profile.getCompanyDescription());

        response.setCompanySize(
                profile.getCompanySize());

        response.setHeadOffice(
                profile.getHeadOffice());

        response.setHrName(
                profile.getHrName());

        response.setHrDesignation(
                profile.getHrDesignation());

        response.setLinkedin(
                profile.getLinkedin());

        response.setLogoUrl(
                profile.getLogoUrl());

        User user = profile.getUser();
        String status = (user != null && user.getAccountStatus() != null)
                ? user.getAccountStatus()
                : (Boolean.TRUE.equals(profile.getVerified()) ? "ACTIVE" : "PENDING");

        boolean isApproved = "ACTIVE".equalsIgnoreCase(status) || Boolean.TRUE.equals(profile.getVerified());

        response.setAccountStatus(status);
        response.setVerified(isApproved);

        return response;

    }

    @Override
    public RecruiterProfileResponse getMyProfile() {

        User currentUser = securityUtil.getCurrentUser();

        RecruiterProfile recruiterProfile =
                recruiterProfileRepository
                        .findByUserId(currentUser.getId())
                        .orElse(null);

        if (recruiterProfile == null) {
            RecruiterProfileResponse defaultResponse = new RecruiterProfileResponse();
            defaultResponse.setCompanyName(currentUser.getFirstName());
            defaultResponse.setHrName(currentUser.getLastName());
            defaultResponse.setCompanyEmail(currentUser.getEmail());
            defaultResponse.setCompanyPhone(currentUser.getPhoneNumber());
            String status = currentUser.getAccountStatus() != null ? currentUser.getAccountStatus() : "PENDING";
            defaultResponse.setAccountStatus(status);
            defaultResponse.setVerified("ACTIVE".equalsIgnoreCase(status));
            return defaultResponse;
        }

        RecruiterProfileResponse response = mapToResponse(recruiterProfile);

        if (response.getCompanyName() == null || response.getCompanyName().trim().isEmpty()) {
            response.setCompanyName(currentUser.getFirstName());
        }
        if (response.getHrName() == null || response.getHrName().trim().isEmpty()) {
            response.setHrName(currentUser.getLastName());
        }
        if (response.getCompanyEmail() == null || response.getCompanyEmail().trim().isEmpty()) {
            response.setCompanyEmail(currentUser.getEmail());
        }
        if (response.getCompanyPhone() == null || response.getCompanyPhone().trim().isEmpty()) {
            response.setCompanyPhone(currentUser.getPhoneNumber());
        }

        return response;

    }
    
    @Override
    public RecruiterProfileResponse updateProfile(
            RecruiterProfileRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        RecruiterProfile recruiterProfile =
                recruiterProfileRepository
                        .findByUserId(currentUser.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company profile not found."));

        if (!recruiterProfile.getCompanyEmail().equals(request.getCompanyEmail())
                && recruiterProfileRepository.existsByCompanyEmail(
                        request.getCompanyEmail())) {

            throw new RuntimeException(
                    "Company email already registered.");
        }

        if (!recruiterProfile.getCompanyPhone().equals(request.getCompanyPhone())
                && recruiterProfileRepository.existsByCompanyPhone(
                        request.getCompanyPhone())) {

            throw new RuntimeException(
                    "Company phone already registered.");
        }

        recruiterProfile.setCompanyName(request.getCompanyName());
        recruiterProfile.setCompanyEmail(request.getCompanyEmail());
        recruiterProfile.setCompanyPhone(request.getCompanyPhone());

        recruiterProfile.setWebsite(request.getWebsite());
        recruiterProfile.setIndustry(request.getIndustry());

        recruiterProfile.setCompanyDescription(
                request.getCompanyDescription());

        recruiterProfile.setCompanySize(
                request.getCompanySize());

        recruiterProfile.setHeadOffice(
                request.getHeadOffice());

        recruiterProfile.setHrName(
                request.getHrName());

        recruiterProfile.setHrDesignation(
                request.getHrDesignation());

        recruiterProfile.setLinkedin(
                request.getLinkedin());

        RecruiterProfile updatedProfile =
                recruiterProfileRepository.save(
                        recruiterProfile);

        return mapToResponse(updatedProfile);

    }

    @Override
    public FileUploadResponse uploadCompanyLogo(
            MultipartFile file) {

        User currentUser = securityUtil.getCurrentUser();

        RecruiterProfile recruiterProfile =
                recruiterProfileRepository
                        .findByUserId(currentUser.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company profile not found."));

        String filePath =
                fileStorageService.uploadCompanyLogo(file);

        recruiterProfile.setLogoUrl(filePath);

        recruiterProfileRepository.save(recruiterProfile);

        return new FileUploadResponse(
                true,
                "Company logo uploaded successfully.",
                filePath
        );

    }

}
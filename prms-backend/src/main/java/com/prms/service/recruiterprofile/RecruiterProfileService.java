package com.prms.service.recruiterprofile;

import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.RecruiterProfileRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.RecruiterProfileResponse;

public interface RecruiterProfileService {

    RecruiterProfileResponse createProfile(
            RecruiterProfileRequest request);

    RecruiterProfileResponse getMyProfile();

    RecruiterProfileResponse updateProfile(
            RecruiterProfileRequest request);

    FileUploadResponse uploadCompanyLogo(
            MultipartFile file);

}
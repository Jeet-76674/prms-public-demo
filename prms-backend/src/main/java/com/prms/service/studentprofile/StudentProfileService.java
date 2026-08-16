package com.prms.service.studentprofile;

import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.StudentProfileRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.StudentProfileResponse;

public interface StudentProfileService {

    StudentProfileResponse createProfile(
            StudentProfileRequest request);

    StudentProfileResponse getMyProfile();

    StudentProfileResponse updateProfile(
            StudentProfileRequest request);
    FileUploadResponse uploadResume(MultipartFile file);

    FileUploadResponse uploadProfileImage(MultipartFile file);

}
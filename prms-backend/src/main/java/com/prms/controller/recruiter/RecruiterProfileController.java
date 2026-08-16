package com.prms.controller.recruiter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.RecruiterProfileRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.service.recruiterprofile.RecruiterProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter/profile")
@Validated
@CrossOrigin(origins = "*")
public class RecruiterProfileController {

    @Autowired
    private RecruiterProfileService recruiterProfileService;

    @PostMapping
    public ResponseEntity<RecruiterProfileResponse> createProfile(
            @Valid @RequestBody RecruiterProfileRequest request) {

        RecruiterProfileResponse response =
                recruiterProfileService.createProfile(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<RecruiterProfileResponse> getMyProfile() {

        RecruiterProfileResponse response =
                recruiterProfileService.getMyProfile();

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<RecruiterProfileResponse> updateProfile(
            @Valid @RequestBody RecruiterProfileRequest request) {

        RecruiterProfileResponse response =
                recruiterProfileService.updateProfile(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logo")
    public ResponseEntity<FileUploadResponse> uploadCompanyLogo(
            @RequestParam("logo") MultipartFile file) {

        FileUploadResponse response =
                recruiterProfileService.uploadCompanyLogo(file);

        return ResponseEntity.ok(response);
    }

}
package com.prms.controller.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.request.StudentProfileRequest;
import com.prms.dto.response.StudentProfileResponse;
import com.prms.service.studentprofile.StudentProfileService;

import org.springframework.web.multipart.MultipartFile;
import com.prms.dto.response.FileUploadResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student/profile")
@Validated
@CrossOrigin(origins = "*")
public class StudentProfileController {

    @Autowired
    private StudentProfileService studentProfileService;

    @PostMapping
    public ResponseEntity<StudentProfileResponse> createProfile(
            @Valid @RequestBody StudentProfileRequest request) {

        StudentProfileResponse response =
                studentProfileService.createProfile(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getMyProfile() {

        StudentProfileResponse response =
                studentProfileService.getMyProfile();

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateProfile(
            @Valid @RequestBody StudentProfileRequest request) {

        StudentProfileResponse response =
                studentProfileService.updateProfile(request);

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/resume")
    public ResponseEntity<FileUploadResponse> uploadResume(
            @RequestParam("resume") MultipartFile file) {

        FileUploadResponse response =
                studentProfileService.uploadResume(file);

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/profile-image")
    public ResponseEntity<FileUploadResponse> uploadProfileImage(
            @RequestParam("image") MultipartFile file) {

        FileUploadResponse response =
                studentProfileService.uploadProfileImage(file);

        return ResponseEntity.ok(response);
    }

}
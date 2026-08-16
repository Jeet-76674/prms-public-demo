package com.prms.controller.student;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.request.ApplyJobRequest;
import com.prms.dto.response.ApplicationResponse;
import com.prms.service.application.JobApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student")
@Validated
@CrossOrigin(origins = "*")
public class StudentApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<ApplicationResponse> applyJob(
            @PathVariable Long jobId,
            @Valid @RequestBody ApplyJobRequest request) {

        ApplicationResponse response =
                jobApplicationService.applyJob(
                        jobId,
                        request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED);

    }

    @GetMapping("/applications")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        return ResponseEntity.ok(
                jobApplicationService.getMyApplications(page, size));

    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long applicationId) {

        ApplicationResponse response =
                jobApplicationService.getApplicationById(
                        applicationId);

        return ResponseEntity.ok(response);

    }

    @PutMapping("/applications/{applicationId}/withdraw")
    public ResponseEntity<String> withdrawApplication(
            @PathVariable Long applicationId) {

        jobApplicationService.withdrawApplication(
                applicationId);

        return ResponseEntity.ok(
                "Application withdrawn successfully.");

    }

    @PutMapping("/applications/{applicationId}/accept")
    public ResponseEntity<String> acceptOffer(
            @PathVariable Long applicationId) {

        jobApplicationService.acceptOffer(applicationId);

        return ResponseEntity.ok("Offer accepted successfully.");
    }

    @PutMapping("/applications/{applicationId}/reject")
    public ResponseEntity<String> rejectOffer(
            @PathVariable Long applicationId) {

        jobApplicationService.rejectOffer(applicationId);

        return ResponseEntity.ok("Offer rejected successfully.");
    }

}
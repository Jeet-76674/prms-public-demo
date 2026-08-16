package com.prms.controller.recruiter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.request.UpdateApplicationStatusRequest;
import com.prms.dto.request.ScheduleInterviewRequest;
import com.prms.dto.request.BulkUpdateApplicationStatusRequest;
import com.prms.dto.response.ApplicationResponse;
import com.prms.service.application.JobApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter")
@Validated
@CrossOrigin(origins = "*")
public class RecruiterApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<Page<ApplicationResponse>> getApplicantsForJob(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        return ResponseEntity.ok(
                jobApplicationService.getApplicantsForJob(jobId, page, size));

    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(

            @PathVariable Long applicationId,

            @Valid
            @RequestBody
            UpdateApplicationStatusRequest request) {

        ApplicationResponse response =
                jobApplicationService.updateApplicationStatus(
                        applicationId,
                        request);

        return ResponseEntity.ok(response);

    }

    @PostMapping("/applications/bulk-schedule")
    public ResponseEntity<String> scheduleBulkInterviews(
            @Valid @RequestBody ScheduleInterviewRequest request) {

        jobApplicationService.scheduleBulkInterviews(request);
        return ResponseEntity.ok("Successfully scheduled interviews and sent notifications.");
    }

    @PutMapping("/applications/bulk-status")
    public ResponseEntity<String> updateBulkApplicationStatus(
            @Valid @RequestBody BulkUpdateApplicationStatusRequest request) {

        jobApplicationService.updateBulkApplicationStatus(request);
        return ResponseEntity.ok("Successfully updated application statuses.");
    }

}
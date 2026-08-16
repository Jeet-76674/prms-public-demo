package com.prms.controller.recruiter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.JobRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.JobResponse;
import com.prms.service.job.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter/jobs")
@Validated
@CrossOrigin(origins = "*")
public class RecruiterJobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request) {

        JobResponse response =
                jobService.createJob(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getMyJobs(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        return ResponseEntity.ok(
                jobService.getMyJobs(page, size));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long jobId) {

        JobResponse response =
                jobService.getJobById(jobId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @Valid @RequestBody JobRequest request) {

        JobResponse response =
                jobService.updateJob(jobId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long jobId) {

        jobService.deleteJob(jobId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{jobId}/jd")
    public ResponseEntity<FileUploadResponse> uploadJobDescription(
            @PathVariable Long jobId,
            @RequestParam("jd") MultipartFile file) {

        FileUploadResponse response =
                jobService.uploadJobDescription(jobId, file);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{jobId}/status")
    public ResponseEntity<JobResponse> changeJobStatus(
            @PathVariable Long jobId,
            @RequestParam String status) {

        JobResponse response =
                jobService.changeJobStatus(jobId, status);

        return ResponseEntity.ok(response);
    }

}
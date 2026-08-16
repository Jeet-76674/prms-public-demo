package com.prms.controller.student;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.response.JobResponse;
import com.prms.service.job.JobService;

@RestController
@RequestMapping("/api/student/jobs")
@CrossOrigin(origins = "*")
public class StudentJobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllOpenJobs(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        return ResponseEntity.ok(jobService.getAllOpenJobs(page, size));

    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJob(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                jobService.getOpenJobById(jobId));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String workMode,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        return ResponseEntity.ok(jobService.searchJobs(
                title, location, department, employmentType, workMode, page, size));

    }

}
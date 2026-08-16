package com.prms.controller.tpo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.response.JobResponse;
import com.prms.dto.response.ApplicationResponse;
import com.prms.service.tpo.TpoJobService;

@RestController
@RequestMapping("/api/tpo/jobs")
@Validated
@CrossOrigin(origins = "*")
public class TpoJobController {

    @Autowired
    private TpoJobService tpoJobService;

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        Page<JobResponse> jobs = tpoJobService.getAllJobs(title, location, department, employmentType, workMode, status, page, size);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id) {
        JobResponse job = tpoJobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<Page<ApplicationResponse>> getJobApplications(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        Page<ApplicationResponse> applications = tpoJobService.getJobApplications(id, page, size);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/selected")
    public ResponseEntity<Page<ApplicationResponse>> getSelectedApplications(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        Page<ApplicationResponse> applications = tpoJobService.getSelectedApplications(page, size);
        return ResponseEntity.ok(applications);
    }

}

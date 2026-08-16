package com.prms.controller.tpo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prms.dto.response.JobResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.service.tpo.TpoRecruiterService;

@RestController
@RequestMapping("/api/tpo/recruiters")
@Validated
@CrossOrigin(origins = "*")
public class TpoRecruiterController {

    @Autowired
    private TpoRecruiterService tpoRecruiterService;

    @GetMapping
    public ResponseEntity<Page<RecruiterProfileResponse>> getAllRecruiters(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        Page<RecruiterProfileResponse> response =
                tpoRecruiterService.getAllRecruiters(search, status, verified, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecruiterProfileResponse> getRecruiter(
            @PathVariable Long id) {

        RecruiterProfileResponse response =
                tpoRecruiterService.getRecruiter(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/jobs")
    public ResponseEntity<List<JobResponse>> getRecruiterJobs(
            @PathVariable Long id) {
        List<JobResponse> jobs = tpoRecruiterService.getJobsByRecruiterId(id);
        return ResponseEntity.ok(jobs);
    }
}

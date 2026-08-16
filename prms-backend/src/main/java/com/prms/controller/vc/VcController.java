package com.prms.controller.vc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prms.dto.request.CreateTpoRequest;
import com.prms.dto.request.ResetTpoPasswordRequest;
import com.prms.dto.request.UpdateRecruiterAccountStatusRequest;
import com.prms.dto.request.UpdateTpoStatusRequest;
import com.prms.dto.response.ApiResponse;
import com.prms.dto.response.JobResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.dto.response.TpoUserResponse;
import com.prms.dto.response.VcDashboardStatsResponse;
import com.prms.service.vc.VcService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vc")
@Validated
@CrossOrigin(origins = "*")
public class VcController {

    @Autowired
    private VcService vcService;

    @GetMapping("/dashboard")
    public ResponseEntity<VcDashboardStatsResponse> getDashboard() {
        VcDashboardStatsResponse stats = vcService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // Company / Recruiter Management (VC ONLY)
    // ==========================================

    @GetMapping("/recruiters")
    public ResponseEntity<Page<RecruiterProfileResponse>> getAllRecruiters(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        Page<RecruiterProfileResponse> response =
                vcService.getAllRecruiters(search, status, verified, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recruiters/{id}")
    public ResponseEntity<RecruiterProfileResponse> getRecruiter(
            @PathVariable Long id) {

        RecruiterProfileResponse response = vcService.getRecruiter(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/recruiters/{id}/approve")
    public ResponseEntity<RecruiterProfileResponse> approveRecruiter(
            @PathVariable Long id) {

        RecruiterProfileResponse response = vcService.approveRecruiter(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/recruiters/{id}/reject")
    public ResponseEntity<RecruiterProfileResponse> rejectRecruiter(
            @PathVariable Long id) {

        RecruiterProfileResponse response = vcService.rejectRecruiter(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/recruiters/{id}/status")
    public ResponseEntity<RecruiterProfileResponse> updateRecruiterAccountStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRecruiterAccountStatusRequest request) {

        RecruiterProfileResponse response = vcService.updateRecruiterAccountStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recruiters/{id}/jobs")
    public ResponseEntity<List<JobResponse>> getRecruiterJobs(
            @PathVariable Long id) {

        List<JobResponse> jobs = vcService.getJobsByRecruiterId(id);
        return ResponseEntity.ok(jobs);
    }

    // ==========================================
    // TPO Management (VC ONLY)
    // ==========================================

    @GetMapping("/tpo")
    public ResponseEntity<List<TpoUserResponse>> getAllTpos() {
        List<TpoUserResponse> tpos = vcService.getAllTpos();
        return ResponseEntity.ok(tpos);
    }

    @GetMapping("/tpo/{id}")
    public ResponseEntity<TpoUserResponse> getTpoById(@PathVariable Long id) {
        TpoUserResponse tpo = vcService.getTpoById(id);
        return ResponseEntity.ok(tpo);
    }

    @PostMapping("/tpo")
    public ResponseEntity<TpoUserResponse> createTpo(
            @Valid @RequestBody CreateTpoRequest request) {

        TpoUserResponse created = vcService.createTpo(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/tpo/{id}/status")
    public ResponseEntity<TpoUserResponse> updateTpoStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTpoStatusRequest request) {

        TpoUserResponse updated = vcService.updateTpoStatus(id, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/tpo/{id}/reset-password")
    public ResponseEntity<ApiResponse> resetTpoPassword(
            @PathVariable Long id,
            @Valid @RequestBody ResetTpoPasswordRequest request) {

        vcService.resetTpoPassword(id, request);
        return ResponseEntity.ok(new ApiResponse(true, "TPO password reset successfully."));
    }
}

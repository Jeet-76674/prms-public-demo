package com.prms.controller.tpo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.request.UpdatePlacementStatusRequest;
import com.prms.dto.response.StudentProfileResponse;
import com.prms.dto.response.ApplicationResponse;
import com.prms.service.tpo.TpoStudentService;
import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tpo/students")
@Validated
@CrossOrigin(origins = "*")
public class TpoStudentController {

    @Autowired
    private TpoStudentService tpoStudentService;

    @GetMapping
    public ResponseEntity<Page<StudentProfileResponse>> getAllStudents(

            @RequestParam(defaultValue = "") String search,

            @RequestParam(required = false) String department,

            @RequestParam(required = false) Integer semester,

            @RequestParam(required = false) String placementStatus,

            @RequestParam(defaultValue = "0") Integer page,

            @RequestParam(defaultValue = "10") Integer size) {

        return ResponseEntity.ok(

                tpoStudentService.getAllStudents(

                        search,
                        department,
                        semester,
                        placementStatus,
                        page,
                        size));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentProfileResponse> getStudent(

            @PathVariable Long studentId) {

        return ResponseEntity.ok(

                tpoStudentService.getStudent(studentId));

    }

    @PutMapping("/{studentId}/placement-status")
    public ResponseEntity<StudentProfileResponse> updatePlacementStatus(

            @PathVariable Long studentId,

            @Valid
            @RequestBody
            UpdatePlacementStatusRequest request) {

        return ResponseEntity.ok(

                tpoStudentService.updatePlacementStatus(
                        studentId,
                        request));

    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<String> deleteStudent(

            @PathVariable Long studentId) {

        tpoStudentService.deleteStudent(studentId);

        return ResponseEntity.ok("Student deleted successfully.");

    }

    @GetMapping("/{studentId}/applications")
    public ResponseEntity<List<ApplicationResponse>> getStudentApplications(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(tpoStudentService.getApplicationsByStudentId(studentId));
    }
}
package com.prms.service.tpo;

import org.springframework.data.domain.Page;

import com.prms.dto.request.UpdatePlacementStatusRequest;
import com.prms.dto.response.StudentProfileResponse;

public interface TpoStudentService {

    Page<StudentProfileResponse> getAllStudents(

            String search,

            String department,

            Integer semester,

            String placementStatus,

            Integer page,

            Integer size);

    StudentProfileResponse getStudent(

            Long studentId);

    StudentProfileResponse updatePlacementStatus(

            Long studentId,

            UpdatePlacementStatusRequest request);

    void deleteStudent(
            Long studentId);

    java.util.List<com.prms.dto.response.ApplicationResponse> getApplicationsByStudentId(Long studentId);

}
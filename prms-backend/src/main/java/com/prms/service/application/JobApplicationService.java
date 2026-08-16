package com.prms.service.application;

import java.util.List;

import org.springframework.data.domain.Page;

import com.prms.dto.request.ApplyJobRequest;
import com.prms.dto.request.UpdateApplicationStatusRequest;
import com.prms.dto.request.ScheduleInterviewRequest;
import com.prms.dto.request.BulkUpdateApplicationStatusRequest;
import com.prms.dto.response.ApplicationResponse;

public interface JobApplicationService {

    // Student APIs

    ApplicationResponse applyJob(
            Long jobId,
            ApplyJobRequest request);

    Page<ApplicationResponse> getMyApplications(Integer page, Integer size);

    ApplicationResponse getApplicationById(
            Long applicationId);

    void withdrawApplication(
            Long applicationId);



    // Recruiter APIs

    Page<ApplicationResponse> getApplicantsForJob(
            Long jobId,
            Integer page,
            Integer size);

    ApplicationResponse updateApplicationStatus(
            Long applicationId,
            UpdateApplicationStatusRequest request);

    void scheduleBulkInterviews(ScheduleInterviewRequest request);

    void updateBulkApplicationStatus(BulkUpdateApplicationStatusRequest request);

    void acceptOffer(Long applicationId);
    void rejectOffer(Long applicationId);

}
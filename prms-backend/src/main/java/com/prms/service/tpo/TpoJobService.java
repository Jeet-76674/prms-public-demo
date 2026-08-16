package com.prms.service.tpo;

import org.springframework.data.domain.Page;
import com.prms.dto.response.JobResponse;
import com.prms.dto.response.ApplicationResponse;

public interface TpoJobService {

    Page<JobResponse> getAllJobs(String title, String location, String department, String employmentType, String workMode, String status, Integer page, Integer size);

    JobResponse getJobById(Long jobId);

    Page<ApplicationResponse> getJobApplications(Long jobId, Integer page, Integer size);

    Page<ApplicationResponse> getSelectedApplications(Integer page, Integer size);

}

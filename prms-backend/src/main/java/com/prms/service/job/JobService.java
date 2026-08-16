package com.prms.service.job;

import java.util.List;

import org.springframework.data.domain.Page;

import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.JobRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.JobResponse;

public interface JobService {

    JobResponse createJob(JobRequest request);

    Page<JobResponse> getMyJobs(Integer page, Integer size);

    JobResponse getJobById(Long jobId);

    JobResponse updateJob(Long jobId, JobRequest request);

    void deleteJob(Long jobId);

    FileUploadResponse uploadJobDescription(
            Long jobId,
            MultipartFile file
    );

    JobResponse changeJobStatus(
            Long jobId,
            String status
    );
    
    Page<JobResponse> getAllOpenJobs(Integer page, Integer size);

    JobResponse getOpenJobById(Long jobId);

    Page<JobResponse> searchJobs(
            String title,
            String location,
            String department,
            String employmentType,
            String workMode,
            Integer page,
            Integer size
    );

}
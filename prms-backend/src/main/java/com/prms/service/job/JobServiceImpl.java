package com.prms.service.job;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.prms.dto.request.JobRequest;
import com.prms.dto.response.FileUploadResponse;
import com.prms.dto.response.JobResponse;
import com.prms.entity.Job;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.User;
import com.prms.repository.JobRepository;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.security.SecurityUtil;
import com.prms.service.file.FileStorageService;
import com.prms.service.recruiter.RecruiterApprovalService;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private RecruiterApprovalService recruiterApprovalService;

    @Override
    public JobResponse createJob(JobRequest request) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        Job job = new Job();

        job.setRecruiter(recruiter);

        job.setTitle(request.getTitle());
        job.setDepartment(request.getDepartment());
        job.setLocation(request.getLocation());

        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());

        job.setEmploymentType(request.getEmploymentType());
        job.setWorkMode(request.getWorkMode());

        job.setMinimumSalary(request.getMinimumSalary());
        job.setMaximumSalary(request.getMaximumSalary());

        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setAllowedBacklogs(request.getAllowedBacklogs());
        job.setExperienceRequired(request.getExperienceRequired());

        job.setRequiredSkills(request.getRequiredSkills());

        job.setVacancies(request.getVacancies());

        job.setApplicationDeadline(
                request.getApplicationDeadline());

        job.setStatus("OPEN");

        Job savedJob = jobRepository.save(job);

        return mapToResponse(savedJob);

    }
    
    private JobResponse mapToResponse(Job job) {

        JobResponse response = new JobResponse();

        response.setId(job.getId());

        response.setTitle(job.getTitle());

        response.setDepartment(job.getDepartment());

        response.setLocation(job.getLocation());

        response.setDescription(job.getDescription());

        response.setResponsibilities(
                job.getResponsibilities());

        response.setRequirements(
                job.getRequirements());

        response.setEmploymentType(
                job.getEmploymentType());

        response.setWorkMode(
                job.getWorkMode());

        response.setMinimumSalary(
                job.getMinimumSalary());

        response.setMaximumSalary(
                job.getMaximumSalary());

        response.setMinimumCgpa(
                job.getMinimumCgpa());

        response.setAllowedBacklogs(
                job.getAllowedBacklogs());

        response.setExperienceRequired(
                job.getExperienceRequired());

        response.setRequiredSkills(
                job.getRequiredSkills());

        response.setVacancies(
                job.getVacancies());

        response.setJdUrl(
                job.getJdFileUrl());

        if (job.getRecruiter() != null) {
            response.setCompanyName(job.getRecruiter().getCompanyName());
            response.setCompanyLogo(job.getRecruiter().getLogoUrl());
        }

        response.setApplicationDeadline(
                job.getApplicationDeadline());

        response.setStatus(
                job.getStatus());

        return response;

    }

    @Override
    public Page<JobResponse> getMyJobs(Integer page, Integer size) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));
                                        
        Pageable pageable = PageRequest.of(page, size);

        Page<Job> jobs =
                jobRepository.findByRecruiterAndStatusNot(
                        recruiter,
                        "DELETED",
                        pageable
                );

        return jobs.map(this::mapToResponse);

    }

    @Override
    public JobResponse getJobById(Long jobId) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to access this job.");

        }

        return mapToResponse(job);

    }

    @Override
    public JobResponse updateJob(
            Long jobId,
            JobRequest request) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this job.");

        }

        job.setTitle(request.getTitle());
        job.setDepartment(request.getDepartment());
        job.setLocation(request.getLocation());

        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());

        job.setEmploymentType(request.getEmploymentType());
        job.setWorkMode(request.getWorkMode());

        job.setMinimumSalary(request.getMinimumSalary());
        job.setMaximumSalary(request.getMaximumSalary());

        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setAllowedBacklogs(request.getAllowedBacklogs());

        job.setExperienceRequired(
                request.getExperienceRequired());

        job.setRequiredSkills(
                request.getRequiredSkills());

        job.setVacancies(
                request.getVacancies());

        job.setApplicationDeadline(
                request.getApplicationDeadline());

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);

    }

    @Override
    public void deleteJob(Long jobId) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to delete this job.");

        }

        job.setStatus("DELETED");

        jobRepository.save(job);

    }

    @Override
    public FileUploadResponse uploadJobDescription(
            Long jobId,
            MultipartFile file) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized.");

        }

        String fileUrl =
                fileStorageService
                        .uploadJobDescription(file);

        job.setJdFileUrl(fileUrl);

        jobRepository.save(job);

        return new FileUploadResponse(

                true,

                "Job Description uploaded successfully.",

                fileUrl

        );

    }

    @Override
    public JobResponse changeJobStatus(
            Long jobId,
            String status) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized.");

        }

        status = status.toUpperCase();

        if (!status.equals("OPEN")
                && !status.equals("CLOSED")
                && !status.equals("DRAFT")
                && !status.equals("DELETED")) {

            throw new RuntimeException(
                    "Invalid job status.");

        }

        job.setStatus(status);

        Job updatedJob =
                jobRepository.save(job);

        return mapToResponse(updatedJob);

    }
    
    @Override
    public Page<JobResponse> getAllOpenJobs(Integer page, Integer size) {
        
        Pageable pageable = PageRequest.of(page, size);

        Page<Job> jobs =
                jobRepository.findByStatusOrderByCreatedAtDesc(
                        "OPEN", pageable);

        return jobs.map(this::mapToResponse);

    }
    
    @Override
    public JobResponse getOpenJobById(Long jobId) {

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."));

        if (!"OPEN".equals(job.getStatus())) {

            throw new RuntimeException(
                    "Job is no longer available.");

        }

        return mapToResponse(job);

    }
    
    @Override
    public Page<JobResponse> searchJobs(
            String title,
            String location,
            String department,
            String employmentType,
            String workMode,
            Integer page,
            Integer size) {
            
        Pageable pageable = PageRequest.of(page, size);

        Page<Job> jobs;

        if (title != null && !title.isBlank()) {

            jobs = jobRepository.findByStatusAndTitleContainingIgnoreCase(
                    "OPEN",
                    title,
                    pageable
            );

        } else if (location != null && !location.isBlank()) {

            jobs = jobRepository.findByStatusAndLocationContainingIgnoreCase(
                    "OPEN",
                    location,
                    pageable
            );

        } else if (department != null && !department.isBlank()) {

            jobs = jobRepository.findByStatusAndDepartmentContainingIgnoreCase(
                    "OPEN",
                    department,
                    pageable
            );

        } else if (employmentType != null && !employmentType.isBlank()) {

            jobs = jobRepository.findByStatusAndEmploymentType(
                    "OPEN",
                    employmentType,
                    pageable
            );

        } else if (workMode != null && !workMode.isBlank()) {

            jobs = jobRepository.findByStatusAndWorkMode(
                    "OPEN",
                    workMode,
                    pageable
            );

        } else {

            jobs = jobRepository.findByStatusOrderByCreatedAtDesc(
                    "OPEN",
                    pageable
            );

        }

        return jobs.map(this::mapToResponse);

    }

}
package com.prms.service.tpo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.prms.dto.response.JobResponse;
import com.prms.dto.response.ApplicationResponse;
import com.prms.entity.Job;
import com.prms.entity.JobApplication;
import com.prms.repository.JobRepository;
import com.prms.repository.JobApplicationRepository;

@Service
public class TpoJobServiceImpl implements TpoJobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Override
    public Page<JobResponse> getAllJobs(String title, String location, String department, String employmentType, String workMode, String status, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs;
        
        // Simple search logic for now, you can improve by using Specifications later
        if (title != null && !title.isBlank()) {
            jobs = jobRepository.findByStatusAndTitleContainingIgnoreCase(status != null ? status : "OPEN", title, pageable);
        } else if (location != null && !location.isBlank()) {
            jobs = jobRepository.findByStatusAndLocationContainingIgnoreCase(status != null ? status : "OPEN", location, pageable);
        } else if (department != null && !department.isBlank()) {
            jobs = jobRepository.findByStatusAndDepartmentContainingIgnoreCase(status != null ? status : "OPEN", department, pageable);
        } else if (employmentType != null && !employmentType.isBlank()) {
            jobs = jobRepository.findByStatusAndEmploymentType(status != null ? status : "OPEN", employmentType, pageable);
        } else if (workMode != null && !workMode.isBlank()) {
            jobs = jobRepository.findByStatusAndWorkMode(status != null ? status : "OPEN", workMode, pageable);
        } else {
            if (status != null && !status.isBlank()) {
                jobs = jobRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
            } else {
                jobs = jobRepository.findAll(pageable); // Fallback to all jobs if no status is specified
            }
        }

        return jobs.map(this::mapToJobResponse);
    }

    @Override
    public JobResponse getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));
        return mapToJobResponse(job);
    }

    @Override
    public Page<ApplicationResponse> getJobApplications(Long jobId, Integer page, Integer size) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        Pageable pageable = PageRequest.of(page, size);
        Page<JobApplication> applications = jobApplicationRepository.findByJobOrderByAppliedAtDesc(job, pageable);
        return applications.map(this::mapToApplicationResponse);
    }

    @Override
    public Page<ApplicationResponse> getSelectedApplications(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<JobApplication> applications = jobApplicationRepository.findByApplicationStatusOrderByAppliedAtDesc("SELECTED", pageable);
        return applications.map(this::mapToApplicationResponse);
    }

    private JobResponse mapToJobResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDepartment(job.getDepartment());
        response.setLocation(job.getLocation());
        response.setDescription(job.getDescription());
        response.setResponsibilities(job.getResponsibilities());
        response.setRequirements(job.getRequirements());
        response.setEmploymentType(job.getEmploymentType());
        response.setWorkMode(job.getWorkMode());
        response.setMinimumSalary(job.getMinimumSalary());
        response.setMaximumSalary(job.getMaximumSalary());
        response.setMinimumCgpa(job.getMinimumCgpa());
        response.setAllowedBacklogs(job.getAllowedBacklogs());
        response.setExperienceRequired(job.getExperienceRequired());
        response.setRequiredSkills(job.getRequiredSkills());
        response.setVacancies(job.getVacancies());
        response.setJdUrl(job.getJdFileUrl());
        if (job.getRecruiter() != null) {
            response.setCompanyName(job.getRecruiter().getCompanyName());
            response.setCompanyLogo(job.getRecruiter().getLogoUrl());
        }
        response.setApplicationDeadline(job.getApplicationDeadline());
        response.setStatus(job.getStatus());
        return response;
    }

    private ApplicationResponse mapToApplicationResponse(JobApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setApplicationId(application.getId());
        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());
        response.setStudentId(application.getStudent().getId());
        response.setStudentName(application.getStudent().getUser().getFirstName() + " " + application.getStudent().getUser().getLastName());
        response.setStudentEmail(application.getStudent().getUser().getEmail());
        if (application.getJob().getRecruiter() != null) {
            response.setCompanyName(application.getJob().getRecruiter().getCompanyName());
        }
        response.setResumeUrl(application.getStudent().getResumeUrl());
        response.setApplicationStatus(application.getApplicationStatus());
        response.setCoverLetter(application.getCoverLetter());
        response.setAppliedAt(application.getAppliedAt());
        return response;
    }

}

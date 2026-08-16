package com.prms.service.tpo;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.prms.dto.response.JobResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.entity.Job;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.User;
import com.prms.repository.JobRepository;
import com.prms.repository.RecruiterProfileRepository;

@Service
public class TpoRecruiterServiceImpl implements TpoRecruiterService {

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Override
    public Page<RecruiterProfileResponse> getAllRecruiters(
            String search,
            String status,
            Boolean verified,
            Integer page,
            Integer size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<RecruiterProfile> profiles = recruiterProfileRepository.searchRecruiters(search, status, verified, pageable);
        return profiles.map(this::mapToResponse);
    }

    @Override
    public RecruiterProfileResponse getRecruiter(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile missing"));
        return mapToResponse(profile);
    }

    @Override
    public List<JobResponse> getJobsByRecruiterId(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile missing"));

        List<Job> jobs = jobRepository.findByRecruiter(profile);
        return jobs.stream().map(this::mapToJobResponse).collect(Collectors.toList());
    }

    private RecruiterProfileResponse mapToResponse(RecruiterProfile profile) {
        RecruiterProfileResponse response = new RecruiterProfileResponse();
        response.setId(profile.getId());
        response.setCompanyName(profile.getCompanyName());
        response.setCompanyEmail(profile.getCompanyEmail());
        response.setCompanyPhone(profile.getCompanyPhone());
        response.setWebsite(profile.getWebsite());
        response.setIndustry(profile.getIndustry());
        response.setCompanyDescription(profile.getCompanyDescription());
        response.setCompanySize(profile.getCompanySize());
        response.setHeadOffice(profile.getHeadOffice());
        response.setHrName(profile.getHrName());
        response.setHrDesignation(profile.getHrDesignation());
        response.setLinkedin(profile.getLinkedin());
        response.setLogoUrl(profile.getLogoUrl());

        User user = profile.getUser();
        String status = (user != null && user.getAccountStatus() != null)
                ? user.getAccountStatus()
                : (Boolean.TRUE.equals(profile.getVerified()) ? "ACTIVE" : "PENDING");

        boolean isApproved = "ACTIVE".equalsIgnoreCase(status) || Boolean.TRUE.equals(profile.getVerified());

        response.setAccountStatus(status);
        response.setVerified(isApproved);

        return response;
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

}

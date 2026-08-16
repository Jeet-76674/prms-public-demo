package com.prms.service.application;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prms.dto.request.ApplyJobRequest;
import com.prms.dto.request.UpdateApplicationStatusRequest;
import com.prms.dto.request.ScheduleInterviewRequest;
import com.prms.dto.request.BulkUpdateApplicationStatusRequest;
import com.prms.dto.request.CreatePlacementRequest;
import com.prms.dto.request.UpdateOfferStatusRequest;
import com.prms.dto.response.ApplicationResponse;
import com.prms.dto.response.PlacementResponse;
import java.time.LocalDate;
import com.prms.entity.Job;
import com.prms.entity.JobApplication;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.StudentProfile;
import com.prms.entity.User;
import com.prms.repository.JobApplicationRepository;
import com.prms.repository.JobRepository;
import com.prms.repository.StudentProfileRepository;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.repository.UserRepository;
import com.prms.security.SecurityUtil;
import com.prms.service.email.EmailService;
import com.prms.service.recruiter.RecruiterApprovalService;

@Service
public class JobApplicationServiceImpl
        implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private RecruiterApprovalService recruiterApprovalService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.prms.service.placement.PlacementService placementService;

    @Override
    public ApplicationResponse applyJob(
            Long jobId,
            ApplyJobRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile student =
                studentProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found."));

        if (student.getResumeUrl() == null
                || student.getResumeUrl().isBlank()) {

            throw new RuntimeException(
                    "Please upload your resume before applying.");

        }

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."));

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {

            throw new RuntimeException(
                    "This job is not accepting applications.");

        }

        if (job.getApplicationDeadline() != null
                && job.getApplicationDeadline().isBefore(
                        java.time.LocalDate.now())) {

            throw new RuntimeException(
                    "Application deadline has expired.");

        }

        boolean alreadyApplied =
                jobApplicationRepository
                        .existsByStudentAndJob(student, job);

        if (alreadyApplied) {

            throw new RuntimeException(
                    "You have already applied for this job.");

        }

        JobApplication application =
                new JobApplication();

        application.setStudent(student);

        application.setJob(job);

        application.setApplicationStatus("APPLIED");

        application.setCoverLetter(
                request.getCoverLetter());

        JobApplication savedApplication =
                jobApplicationRepository.save(application);

        return mapToResponse(savedApplication);

    }
    
    private ApplicationResponse mapToResponse(
            JobApplication application) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setApplicationId(
                application.getId());

        response.setJobId(
                application.getJob().getId());

        response.setJobTitle(
                application.getJob().getTitle());

        response.setStudentId(
                application.getStudent().getId());

        response.setStudentName(
                application.getStudent()
                        .getUser()
                        .getFirstName()
                + " "
                + application.getStudent()
                        .getUser()
                        .getLastName());

        response.setStudentEmail(
                application.getStudent()
                        .getUser()
                        .getEmail());

        response.setResumeUrl(
                application.getStudent()
                        .getResumeUrl());

        response.setApplicationStatus(
                application.getApplicationStatus());

        response.setCoverLetter(
                application.getCoverLetter());

        response.setAppliedAt(
                application.getAppliedAt());

        response.setInterviewDate(
                application.getInterviewDate());

        response.setInterviewTime(
                application.getInterviewTime());

        response.setInterviewLink(
                application.getInterviewLink());

        response.setInterviewInstructions(
                application.getInterviewInstructions());

        response.setJoiningDate(
                application.getJoiningDate());

        return response;

    }

    @Override
    public Page<ApplicationResponse> getMyApplications(Integer page, Integer size) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile student =
                studentProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found."));

        Pageable pageable = PageRequest.of(page, size);
        
        Page<JobApplication> applications =
                jobApplicationRepository
                        .findByStudentOrderByAppliedAtDesc(student, pageable);

        return applications.map(this::mapToResponse);

    }

    @Override
    public ApplicationResponse getApplicationById(
            Long applicationId) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile student =
                studentProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found."));

        JobApplication application =
                jobApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."));

        if (!application.getStudent().getId().equals(student.getId())) {

            throw new RuntimeException(
                    "You are not authorized to view this application.");

        }

        return mapToResponse(application);

    }

    @Override
    public void withdrawApplication(
            Long applicationId) {

        User currentUser = securityUtil.getCurrentUser();

        StudentProfile student =
                studentProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found."));

        JobApplication application =
                jobApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."));

        if (!application.getStudent().getId().equals(student.getId())) {

            throw new RuntimeException(
                    "You are not authorized to withdraw this application.");

        }

        String status = application.getApplicationStatus();

        if (!status.equalsIgnoreCase("APPLIED")
                && !status.equalsIgnoreCase("UNDER_REVIEW")) {

            throw new RuntimeException(
                    "Application can no longer be withdrawn.");

        }

        application.setApplicationStatus("WITHDRAWN");

        jobApplicationRepository.save(application);

    }

    @Override
    public Page<ApplicationResponse> getApplicantsForJob(
            Long jobId, Integer page, Integer size) {

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
                    "You are not authorized to view applicants for this job.");

        }

        Pageable pageable = PageRequest.of(page, size);
        
        Page<JobApplication> applications =
                jobApplicationRepository
                        .findByJobOrderByAppliedAtDesc(job, pageable);

        return applications.map(this::mapToResponse);

    }

    @Override
    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            UpdateApplicationStatusRequest request) {

        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter =
                recruiterProfileRepository
                        .findByUser(currentUser)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."));

        JobApplication application =
                jobApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."));

        Job job = application.getJob();

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this application.");

        }

        String status = request.getApplicationStatus().toUpperCase();

        if (!status.equals("UNDER_REVIEW")
                && !status.equals("SHORTLISTED")
                && !status.equals("INTERVIEW_SCHEDULED")
                && !status.equals("SELECTED")
                && !status.equals("REJECTED")) {

            throw new RuntimeException(
                    "Invalid application status.");

        }

        application.setApplicationStatus(status);
        if ("SELECTED".equals(status) && request.getJoiningDate() != null && !request.getJoiningDate().isEmpty()) {
            application.setJoiningDate(request.getJoiningDate());
            try {
                emailService.sendStudentSelectedEmail(
                        application.getStudent().getUser().getEmail(),
                        job.getRecruiter().getCompanyName(),
                        job.getTitle(),
                        "To be discussed", // Package might not be available here, or we can use a placeholder
                        request.getJoiningDate()
                );
            } catch (Exception e) {
                System.err.println("Failed to send selection email to " + application.getStudent().getUser().getEmail());
            }
        }

        JobApplication updatedApplication =
                jobApplicationRepository.save(application);

        return mapToResponse(updatedApplication);

    }

    @Override
    public void scheduleBulkInterviews(ScheduleInterviewRequest request) {
        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter = recruiterProfileRepository
                .findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found."));

        List<JobApplication> applications = jobApplicationRepository.findAllById(request.getApplicationIds());
        
        for (JobApplication application : applications) {
            Job job = application.getJob();
            if (!job.getRecruiter().getId().equals(recruiter.getId())) {
                throw new RuntimeException("You are not authorized to schedule interviews for some of these applications.");
            }
            
            application.setApplicationStatus("INTERVIEW_SCHEDULED");
            application.setInterviewDate(request.getDate());
            application.setInterviewTime(request.getTime());
            application.setInterviewLink(request.getLink());
            application.setInterviewInstructions(request.getInstructions());

            try {
                emailService.sendInterviewScheduledEmail(
                        application.getStudent().getUser().getEmail(),
                        application.getStudent().getUser().getFirstName() + " " + application.getStudent().getUser().getLastName(),
                        job.getRecruiter().getCompanyName(),
                        job.getTitle(),
                        request.getDate(),
                        request.getTime(),
                        request.getLink(),
                        request.getInstructions()
                );
            } catch (Exception e) {
                System.err.println("Failed to send email to " + application.getStudent().getUser().getEmail());
            }
        }

        jobApplicationRepository.saveAll(applications);
    }

    @Override
    public void updateBulkApplicationStatus(BulkUpdateApplicationStatusRequest request) {
        User currentUser = securityUtil.getCurrentUser();
        recruiterApprovalService.checkRecruiterApproved(currentUser);

        RecruiterProfile recruiter = recruiterProfileRepository
                .findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found."));

        List<JobApplication> applications = jobApplicationRepository.findAllById(request.getApplicationIds());
        
        String status = request.getApplicationStatus().toUpperCase();
        if (!status.equals("UNDER_REVIEW")
                && !status.equals("SHORTLISTED")
                && !status.equals("INTERVIEW_SCHEDULED")
                && !status.equals("SELECTED")
                && !status.equals("REJECTED")) {
            throw new RuntimeException("Invalid application status.");
        }

        for (JobApplication application : applications) {
            Job job = application.getJob();
            if (!job.getRecruiter().getId().equals(recruiter.getId())) {
                throw new RuntimeException("You are not authorized to update some of these applications.");
            }
            application.setApplicationStatus(status);
            
            if ("SELECTED".equals(status) && request.getJoiningDate() != null && !request.getJoiningDate().isEmpty()) {
                application.setJoiningDate(request.getJoiningDate());
                try {
                    emailService.sendStudentSelectedEmail(
                            application.getStudent().getUser().getEmail(),
                            job.getRecruiter().getCompanyName(),
                            job.getTitle(),
                            "To be discussed", // Package
                            request.getJoiningDate()
                    );
                } catch (Exception e) {
                    System.err.println("Failed to send selection email to " + application.getStudent().getUser().getEmail());
                }
            }
        }

        jobApplicationRepository.saveAll(applications);
    }

    @Override
    public void acceptOffer(Long applicationId) {
        User currentUser = securityUtil.getCurrentUser();
        StudentProfile student = studentProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Student profile not found."));

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found."));

        if (!application.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("You are not authorized to accept this offer.");
        }

        if (!"SELECTED".equals(application.getApplicationStatus())) {
            throw new RuntimeException("Only applications in SELECTED state can be accepted.");
        }

        // Automatically create a placement record BEFORE changing status
        // so that the validation in PlacementService (requires SELECTED) passes.
        try {
            CreatePlacementRequest placementRequest = new CreatePlacementRequest();
            placementRequest.setStudentId(student.getId());
            placementRequest.setJobId(application.getJob().getId());
            placementRequest.setRecruiterId(application.getJob().getRecruiter().getId());
            
            // Try to get company name from recruiter profile, fallback to "Company"
            String companyName = application.getJob().getRecruiter().getCompanyName();
            if (companyName == null || companyName.isEmpty()) {
                companyName = "Not Specified";
            }
            placementRequest.setCompanyName(companyName);
            
            placementRequest.setJobTitle(application.getJob().getTitle());
            
            // Set package amount from minimum salary or fallback
            java.math.BigDecimal pkgAmount = application.getJob().getMinimumSalary();
            if (pkgAmount == null) {
                pkgAmount = new java.math.BigDecimal("0");
            }
            placementRequest.setPackageAmount(pkgAmount);
            
            placementRequest.setEmploymentType(application.getJob().getEmploymentType());
            placementRequest.setWorkLocation(application.getJob().getLocation());
            
            // Parse joining date if possible
            if (application.getJoiningDate() != null && !application.getJoiningDate().isEmpty()) {
                try {
                    placementRequest.setJoiningDate(LocalDate.parse(application.getJoiningDate()));
                } catch (Exception e) {
                    // Ignore parse error
                }
            }
            
            placementRequest.setOfferDate(LocalDate.now());
            placementRequest.setRemarks("Auto-generated from accepted application.");

            PlacementResponse createdPlacement = placementService.createPlacement(placementRequest);

            // Now update the offer status to ACCEPTED
            UpdateOfferStatusRequest updateStatusReq = new UpdateOfferStatusRequest();
            updateStatusReq.setOfferStatus("ACCEPTED");
            placementService.updateOfferStatus(createdPlacement.getId(), updateStatusReq);

        } catch (Exception e) {
            // Log but don't fail the offer acceptance if placement creation fails
            e.printStackTrace();
        }

        // Now save the accepted status for the application
        application.setApplicationStatus("OFFER_ACCEPTED");
        jobApplicationRepository.save(application);
    }

    @Override
    public void rejectOffer(Long applicationId) {
        User currentUser = securityUtil.getCurrentUser();
        StudentProfile student = studentProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Student profile not found."));

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found."));

        if (!application.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("You are not authorized to reject this offer.");
        }

        if (!"SELECTED".equals(application.getApplicationStatus())) {
            throw new RuntimeException("Only applications in SELECTED state can be rejected.");
        }

        application.setApplicationStatus("OFFER_REJECTED");
        jobApplicationRepository.save(application);
    }

}
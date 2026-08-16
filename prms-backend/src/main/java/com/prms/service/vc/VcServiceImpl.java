package com.prms.service.vc;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prms.dto.request.CreateTpoRequest;
import com.prms.dto.request.ResetTpoPasswordRequest;
import com.prms.dto.request.UpdateRecruiterAccountStatusRequest;
import com.prms.dto.request.UpdateTpoStatusRequest;
import com.prms.dto.response.JobResponse;
import com.prms.dto.response.RecruiterProfileResponse;
import com.prms.dto.response.TpoUserResponse;
import com.prms.dto.response.VcDashboardStatsResponse;
import com.prms.entity.Job;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.User;
import com.prms.repository.JobRepository;
import com.prms.repository.PlacementRecordRepository;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.repository.StudentProfileRepository;
import com.prms.repository.UserRepository;
import com.prms.service.email.EmailService;

@Service
public class VcServiceImpl implements VcService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlacementRecordRepository placementRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public VcDashboardStatsResponse getDashboardStats() {
        long totalStudents = studentProfileRepository.count();
        long totalRecruiters = recruiterProfileRepository.count();
        long pendingRecruiters = userRepository.countByRoleAndAccountStatus("RECRUITER", "PENDING");
        long totalTpos = userRepository.findByRole("TPO").size();
        long totalJobs = jobRepository.count();
        long totalPlacements = placementRecordRepository.count();

        return new VcDashboardStatsResponse(
                totalStudents,
                totalRecruiters,
                pendingRecruiters,
                totalTpos,
                totalJobs,
                totalPlacements
        );
    }

    @Override
    public Page<RecruiterProfileResponse> getAllRecruiters(
            String search,
            String status,
            Boolean verified,
            Integer page,
            Integer size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<RecruiterProfile> profiles = recruiterProfileRepository.searchRecruiters(search, status, verified, pageable);
        return profiles.map(this::mapToRecruiterResponse);
    }

    @Override
    public RecruiterProfileResponse getRecruiter(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));
        return mapToRecruiterResponse(profile);
    }

    @Override
    @Transactional
    public RecruiterProfileResponse approveRecruiter(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        profile.setVerified(true);
        User user = profile.getUser();
        if (user == null) {
            throw new RuntimeException("Associated recruiter user not found");
        }
        user.setAccountStatus("ACTIVE");

        userRepository.save(user);
        RecruiterProfile updatedProfile = recruiterProfileRepository.save(profile);

        try {
            emailService.sendRecruiterStatusEmail(user.getEmail(), "Approved");
        } catch (Exception e) {
            // Log and continue
            System.err.println("Email notification failed: " + e.getMessage());
        }

        return mapToRecruiterResponse(updatedProfile);
    }

    @Override
    @Transactional
    public RecruiterProfileResponse rejectRecruiter(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        profile.setVerified(false);
        User user = profile.getUser();
        if (user == null) {
            throw new RuntimeException("Associated recruiter user not found");
        }
        user.setAccountStatus("REJECTED");

        userRepository.save(user);
        RecruiterProfile updatedProfile = recruiterProfileRepository.save(profile);

        try {
            emailService.sendRecruiterStatusEmail(user.getEmail(), "Rejected");
        } catch (Exception e) {
            System.err.println("Email notification failed: " + e.getMessage());
        }

        return mapToRecruiterResponse(updatedProfile);
    }

    @Override
    @Transactional
    public RecruiterProfileResponse updateRecruiterAccountStatus(
            Long recruiterId,
            UpdateRecruiterAccountStatusRequest request) {

        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        User user = profile.getUser();
        if (user == null) {
            throw new RuntimeException("Associated recruiter user not found");
        }

        if ("ACTIVE".equalsIgnoreCase(request.getAccountStatus())) {
            user.setAccountStatus("ACTIVE");
            profile.setVerified(true);
            try { emailService.sendRecruiterStatusEmail(user.getEmail(), "Activated"); } catch (Exception ignored) {}
        } else if ("INACTIVE".equalsIgnoreCase(request.getAccountStatus())) {
            user.setAccountStatus("INACTIVE");
            profile.setVerified(false);
            try { emailService.sendRecruiterStatusEmail(user.getEmail(), "Deactivated"); } catch (Exception ignored) {}
        } else if ("REJECTED".equalsIgnoreCase(request.getAccountStatus())) {
            user.setAccountStatus("REJECTED");
            profile.setVerified(false);
            try { emailService.sendRecruiterStatusEmail(user.getEmail(), "Rejected"); } catch (Exception ignored) {}
        } else {
            throw new RuntimeException("Invalid account status. Valid statuses: ACTIVE, INACTIVE, REJECTED");
        }

        userRepository.save(user);
        RecruiterProfile updatedProfile = recruiterProfileRepository.save(profile);
        return mapToRecruiterResponse(updatedProfile);
    }

    @Override
    public List<JobResponse> getJobsByRecruiterId(Long recruiterId) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        List<Job> jobs = jobRepository.findByRecruiter(profile);
        return jobs.stream().map(this::mapToJobResponse).collect(Collectors.toList());
    }

    @Override
    public List<TpoUserResponse> getAllTpos() {
        List<User> tpos = userRepository.findByRole("TPO");
        return tpos.stream().map(this::mapToTpoResponse).collect(Collectors.toList());
    }

    @Override
    public TpoUserResponse getTpoById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TPO user not found"));

        if (!"TPO".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Requested user is not a TPO officer");
        }

        return mapToTpoResponse(user);
    }

    @Override
    @Transactional
    public TpoUserResponse createTpo(CreateTpoRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered: " + request.getPhoneNumber());
        }

        User tpo = new User();
        tpo.setFirstName(request.getFirstName().trim());
        tpo.setLastName(request.getLastName().trim());
        tpo.setEmail(request.getEmail().trim().toLowerCase());
        tpo.setPhoneNumber(request.getPhoneNumber().trim());
        tpo.setPassword(passwordEncoder.encode(request.getPassword()));
        tpo.setRole("TPO");
        tpo.setAccountStatus("ACTIVE");

        User saved = userRepository.save(tpo);
        return mapToTpoResponse(saved);
    }

    @Override
    @Transactional
    public TpoUserResponse updateTpoStatus(Long id, UpdateTpoStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TPO user not found"));

        if (!"TPO".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Requested user is not a TPO officer");
        }

        user.setAccountStatus(request.getAccountStatus().toUpperCase());
        User saved = userRepository.save(user);
        return mapToTpoResponse(saved);
    }

    @Override
    @Transactional
    public void resetTpoPassword(Long id, ResetTpoPasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TPO user not found"));

        if (!"TPO".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Requested user is not a TPO officer");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private TpoUserResponse mapToTpoResponse(User user) {
        return new TpoUserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getAccountStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private RecruiterProfileResponse mapToRecruiterResponse(RecruiterProfile profile) {
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

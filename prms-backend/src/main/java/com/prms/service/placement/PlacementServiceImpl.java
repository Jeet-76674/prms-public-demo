package com.prms.service.placement;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prms.dto.request.CreatePlacementRequest;
import com.prms.dto.request.UpdateOfferStatusRequest;
import com.prms.dto.request.UpdatePlacementRequest;
import com.prms.dto.response.PlacementResponse;
import com.prms.entity.Job;
import com.prms.entity.PlacementRecord;
import com.prms.entity.RecruiterProfile;
import com.prms.entity.StudentProfile;
import com.prms.entity.User;
import com.prms.repository.JobApplicationRepository;
import com.prms.repository.JobRepository;
import com.prms.repository.PlacementRecordRepository;
import com.prms.repository.RecruiterProfileRepository;
import com.prms.repository.StudentProfileRepository;
import com.prms.repository.UserRepository;
import com.prms.service.email.EmailService;

@Service
public class PlacementServiceImpl implements PlacementService {

    @Autowired
    private PlacementRecordRepository placementRecordRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public PlacementResponse createPlacement(CreatePlacementRequest request) {
        StudentProfile student = studentProfileRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        RecruiterProfile recruiter = null;
        if (request.getRecruiterId() != null) {
            recruiter = recruiterProfileRepository.findById(request.getRecruiterId()).orElse(null);
        }
        if (recruiter == null) {
            recruiter = job.getRecruiter();
        }
        if (recruiter == null) {
            throw new RuntimeException("Recruiter profile not found for this placement.");
        }

        if (!jobApplicationRepository.existsByStudentAndJobAndApplicationStatus(student, job, "SELECTED")) {
            throw new RuntimeException("Placement can only be created for selected applications.");
        }

        List<String> activeStatuses = Arrays.asList("OFFERED", "ACCEPTED", "JOINED");
        if (placementRecordRepository.existsByStudentAndOfferStatusIn(student, activeStatuses)) {
            throw new RuntimeException("Student already has an active placement.");
        }

        PlacementRecord record = new PlacementRecord();
        record.setStudent(student);
        record.setRecruiter(recruiter);
        record.setJob(job);
        record.setCompanyName(request.getCompanyName());
        record.setJobTitle(request.getJobTitle());
        record.setPackageAmount(request.getPackageAmount());
        record.setEmploymentType(request.getEmploymentType());
        record.setWorkLocation(request.getWorkLocation());
        record.setJoiningDate(request.getJoiningDate());
        record.setOfferDate(request.getOfferDate());
        record.setRemarks(request.getRemarks());
        record.setOfferLetterUrl(request.getOfferLetterUrl());
        
        record.setOfferStatus("OFFERED");

        PlacementRecord savedRecord = placementRecordRepository.save(record);

        student.setPlacementStatus("PLACED");
        studentProfileRepository.save(student);

        User studentUser = student.getUser();
        if (studentUser != null && studentUser.getEmail() != null) {
            String joiningDateStr = request.getJoiningDate() != null ? request.getJoiningDate().toString() : "To be decided";
            emailService.sendStudentSelectedEmail(
                    studentUser.getEmail(),
                    request.getCompanyName(),
                    request.getJobTitle(),
                    request.getPackageAmount().toString(),
                    joiningDateStr
            );
        }

        return mapToResponse(savedRecord);
    }

    @Override
    public PlacementResponse getPlacement(Long id) {
        PlacementRecord record = placementRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found"));
        return mapToResponse(record);
    }

    @Override
    public Page<PlacementResponse> getAllPlacements(
            String search, String company, String offerStatus, 
            String department, Integer passingYear, Integer page, Integer size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PlacementRecord> records = placementRecordRepository.searchPlacements(
                search, company, offerStatus, department, passingYear, pageable);
        return records.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public PlacementResponse updatePlacement(Long id, UpdatePlacementRequest request) {
        PlacementRecord record = placementRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found"));

        if (request.getCompanyName() != null) record.setCompanyName(request.getCompanyName());
        if (request.getJobTitle() != null) record.setJobTitle(request.getJobTitle());
        if (request.getPackageAmount() != null) record.setPackageAmount(request.getPackageAmount());
        if (request.getEmploymentType() != null) record.setEmploymentType(request.getEmploymentType());
        if (request.getWorkLocation() != null) record.setWorkLocation(request.getWorkLocation());
        if (request.getJoiningDate() != null) record.setJoiningDate(request.getJoiningDate());
        if (request.getOfferDate() != null) record.setOfferDate(request.getOfferDate());
        if (request.getRemarks() != null) record.setRemarks(request.getRemarks());
        if (request.getOfferLetterUrl() != null) record.setOfferLetterUrl(request.getOfferLetterUrl());

        PlacementRecord updatedRecord = placementRecordRepository.save(record);
        return mapToResponse(updatedRecord);
    }

    @Override
    @Transactional
    public PlacementResponse updateOfferStatus(Long id, UpdateOfferStatusRequest request) {
        PlacementRecord record = placementRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found"));

        String newStatus = request.getOfferStatus();
        if (!newStatus.equals("OFFERED") && !newStatus.equals("ACCEPTED") && 
            !newStatus.equals("DECLINED") && !newStatus.equals("JOINED")) {
            throw new RuntimeException("Invalid Offer Status");
        }

        record.setOfferStatus(newStatus);
        PlacementRecord updatedRecord = placementRecordRepository.save(record);

        User studentUser = record.getStudent().getUser();
        User recruiterUser = record.getRecruiter().getUser();
        String studentEmail = studentUser != null ? studentUser.getEmail() : null;
        String recruiterEmail = recruiterUser != null ? recruiterUser.getEmail() : null;
        String studentName = studentUser != null ? studentUser.getFirstName() + " " + studentUser.getLastName() : "Student";
        String companyName = record.getCompanyName();

        if (newStatus.equals("ACCEPTED")) {
            if (studentEmail != null && recruiterEmail != null) {
                emailService.sendOfferAcceptedEmail(studentEmail, recruiterEmail, companyName, studentName);
            }
        } else if (newStatus.equals("DECLINED")) {
            if (recruiterEmail != null) {
                emailService.sendOfferDeclinedEmail(recruiterEmail, companyName, studentName);
            }
        } else if (newStatus.equals("JOINED")) {
            String tpoEmail = getTpoEmail();
            if (studentEmail != null && recruiterEmail != null) {
                emailService.sendOfferJoinedEmail(studentEmail, recruiterEmail, tpoEmail, companyName, studentName);
            }
        }

        return mapToResponse(updatedRecord);
    }

    @Override
    public Page<PlacementResponse> getStudentPlacements(Long studentUserId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return placementRecordRepository.findByStudentUserId(studentUserId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<PlacementResponse> getRecruiterPlacements(Long recruiterUserId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return placementRecordRepository.findByRecruiterUserId(recruiterUserId, pageable)
                .map(this::mapToResponse);
    }

    private String getTpoEmail() {
        return userRepository.findByRole("ROLE_TPO")
                .stream()
                .findFirst()
                .map(User::getEmail)
                .orElse(null);
    }

    private PlacementResponse mapToResponse(PlacementRecord record) {
        PlacementResponse response = new PlacementResponse();
        response.setId(record.getId());
        
        response.setStudentId(record.getStudent().getId());
        if (record.getStudent().getUser() != null) {
            response.setStudentName(record.getStudent().getUser().getFirstName() + " " + record.getStudent().getUser().getLastName());
        }
        response.setEnrollmentNumber(record.getStudent().getEnrollmentNumber());
        
        response.setRecruiterId(record.getRecruiter().getId());
        response.setCompanyName(record.getCompanyName());
        
        response.setJobId(record.getJob().getId());
        response.setJobTitle(record.getJobTitle());
        
        response.setPackageAmount(record.getPackageAmount());
        response.setEmploymentType(record.getEmploymentType());
        response.setWorkLocation(record.getWorkLocation());
        response.setJoiningDate(record.getJoiningDate());
        response.setOfferDate(record.getOfferDate());
        response.setOfferStatus(record.getOfferStatus());
        response.setRemarks(record.getRemarks());
        response.setOfferLetterUrl(record.getOfferLetterUrl());
        
        response.setCreatedAt(record.getCreatedAt());
        response.setUpdatedAt(record.getUpdatedAt());
        
        return response;
    }
}

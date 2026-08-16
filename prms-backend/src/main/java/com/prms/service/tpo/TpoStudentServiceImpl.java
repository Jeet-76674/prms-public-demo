package com.prms.service.tpo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.prms.dto.request.UpdatePlacementStatusRequest;
import com.prms.dto.response.StudentProfileResponse;
import com.prms.entity.StudentProfile;
import com.prms.repository.StudentProfileRepository;
import com.prms.repository.JobApplicationRepository;
import com.prms.service.tpo.TpoStudentService;
import com.prms.dto.response.ApplicationResponse;
import com.prms.entity.JobApplication;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TpoStudentServiceImpl implements TpoStudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Override
    public Page<StudentProfileResponse> getAllStudents(
            String search,
            String department,
            Integer semester,
            String placementStatus,
            Integer page,
            Integer size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<StudentProfile> students =
                studentProfileRepository.searchStudents(
                        search,
                        department,
                        semester,
                        placementStatus,
                        pageable);

        return students.map(this::convertToResponse);

    }

    @Override
    public StudentProfileResponse getStudent(Long studentId) {

        StudentProfile student =
                studentProfileRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found."));

        return convertToResponse(student);

    }

    @Override
    public StudentProfileResponse updatePlacementStatus(
            Long studentId,
            UpdatePlacementStatusRequest request) {

        StudentProfile student =
                studentProfileRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found."));

        student.setPlacementStatus(
                request.getPlacementStatus());

        studentProfileRepository.save(student);

        return convertToResponse(student);

    }
    
    private StudentProfileResponse convertToResponse(StudentProfile student) {

        StudentProfileResponse response = new StudentProfileResponse();

        response.setId(student.getId());

        // User Details
        response.setFirstName(student.getUser().getFirstName());
        response.setLastName(student.getUser().getLastName());
        response.setEmail(student.getUser().getEmail());
        response.setPhoneNumber(student.getUser().getPhoneNumber());

        // Academic Details
        response.setEnrollmentNumber(student.getEnrollmentNumber());
        response.setDepartment(student.getDepartment());
        response.setSemester(student.getSemester());
        response.setSection(student.getSection());
        response.setCgpa(student.getCgpa());
        response.setPassingYear(student.getPassingYear());

        // Personal Details
        response.setGender(student.getGender());
        response.setDateOfBirth(student.getDateOfBirth());
        // Address
        response.setAddressLine1(student.getAddressLine1());
        response.setAddressLine2(student.getAddressLine2());
        response.setCity(student.getCity());
        response.setState(student.getState());
        response.setCountry(student.getCountry());
        response.setPincode(student.getPincode());

        // Education
        response.setActiveBacklogs(student.getActiveBacklogs());
        response.setTotalBacklogs(student.getTotalBacklogs());
        response.setTenthPercentage(student.getTenthPercentage());
        response.setTwelfthPercentage(student.getTwelfthPercentage());
        response.setDiplomaPercentage(student.getDiplomaPercentage());

        // Skills
        response.setTechnicalSkills(student.getTechnicalSkills());
        response.setSoftSkills(student.getSoftSkills());
        response.setCertifications(student.getCertifications());
        response.setAchievements(student.getAchievements());

        // Links
        response.setLinkedinUrl(student.getLinkedinUrl());
        response.setGithubUrl(student.getGithubUrl());
        response.setPortfolioUrl(student.getPortfolioUrl());
        response.setLeetcodeUrl(student.getLeetcodeUrl());
        response.setHackerrankUrl(student.getHackerrankUrl());

        // Resume
        response.setResumeUrl(student.getResumeUrl());

        // Placement
        response.setPlacementStatus(student.getPlacementStatus());
        response.setPreferredJobLocation(student.getPreferredJobLocation());
        response.setPreferredJobType(student.getPreferredJobType());

        // Status
        response.setProfileCompleted(student.getProfileCompleted());
        response.setResumeUploaded(student.getResumeUploaded());

        return response;
    }

    @Override
    public void deleteStudent(Long studentId) {

        StudentProfile student =
                studentProfileRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException("Student not found."));

        studentProfileRepository.delete(student);

    }

    @Override
    public List<ApplicationResponse> getApplicationsByStudentId(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        List<JobApplication> applications = jobApplicationRepository.findByStudentOrderByAppliedAtDesc(student);
        return applications.stream().map(this::mapToApplicationResponse).collect(Collectors.toList());
    }

    private ApplicationResponse mapToApplicationResponse(JobApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setApplicationId(application.getId());
        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());
        response.setStudentId(application.getStudent().getId());
        response.setStudentName(application.getStudent().getUser().getFirstName() + " " + application.getStudent().getUser().getLastName());
        response.setStudentEmail(application.getStudent().getUser().getEmail());
        response.setResumeUrl(application.getStudent().getResumeUrl());
        response.setApplicationStatus(application.getApplicationStatus());
        response.setCoverLetter(application.getCoverLetter());
        response.setAppliedAt(application.getAppliedAt());
        return response;
    }

}
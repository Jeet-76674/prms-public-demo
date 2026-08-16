package com.prms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prms.entity.Job;
import com.prms.entity.JobApplication;
import com.prms.entity.StudentProfile;

@Repository
public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    // Prevent duplicate applications
    boolean existsByStudentAndJob(
            StudentProfile student,
            Job job);

    boolean existsByStudentAndJobAndApplicationStatus(
            StudentProfile student,
            Job job,
            String applicationStatus);

    // Student - My Applications
    Page<JobApplication> findByStudentOrderByAppliedAtDesc(
            StudentProfile student,
            Pageable pageable);

    List<JobApplication> findByStudentOrderByAppliedAtDesc(StudentProfile student);

    // Recruiter - Applicants for a Job
    Page<JobApplication> findByJobOrderByAppliedAtDesc(
            Job job,
            Pageable pageable);

    // Fetch single application
    Optional<JobApplication> findById(
            Long applicationId);

    // Statistics
    long countByJob(Job job);

    long countByJobAndApplicationStatus(
            Job job,
            String applicationStatus);
    
    long countByApplicationStatus(String applicationStatus);

    Page<JobApplication> findByApplicationStatusOrderByAppliedAtDesc(String applicationStatus, Pageable pageable);

}
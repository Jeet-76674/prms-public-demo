package com.prms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prms.entity.Job;
import com.prms.entity.RecruiterProfile;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(RecruiterProfile recruiter);

    List<Job> findByStatus(String status);

    List<Job> findByRecruiterAndStatus(
            RecruiterProfile recruiter,
            String status
    );
    
    Page<Job> findByRecruiterAndStatusNot(
            RecruiterProfile recruiter,
            String status,
            Pageable pageable
    );
    
    Page<Job> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<Job> findByStatusAndTitleContainingIgnoreCase(
            String status,
            String title,
            Pageable pageable
    );

    Page<Job> findByStatusAndLocationContainingIgnoreCase(
            String status,
            String location,
            Pageable pageable
    );
    
    Page<Job> findByStatusAndDepartmentContainingIgnoreCase(
            String status,
            String department,
            Pageable pageable
    );

    Page<Job> findByStatusAndEmploymentType(
            String status,
            String employmentType,
            Pageable pageable
    );

    Page<Job> findByStatusAndWorkMode(
            String status,
            String workMode,
            Pageable pageable
    );

    long countByStatus(String status);
}
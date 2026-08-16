package com.prms.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.prms.entity.StudentProfile;
import com.prms.entity.User;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByEnrollmentNumber(String enrollmentNumber);

    Optional<StudentProfile> findByUserId(Long userId);

    boolean existsByEnrollmentNumber(String enrollmentNumber);

    Optional<StudentProfile> findByUser(User user);

    long countByPlacementStatus(String placementStatus);

    @Query("""
        SELECT sp
        FROM StudentProfile sp
        JOIN sp.user u
        WHERE
        (
            :search = '' OR
            LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(sp.enrollmentNumber) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND
        (
            :department IS NULL OR
            sp.department = :department
        )
        AND
        (
            :semester IS NULL OR
            sp.semester = :semester
        )
        AND
        (
            :placementStatus IS NULL OR
            sp.placementStatus = :placementStatus
        )
        """)
    Page<StudentProfile> searchStudents(

            @Param("search") String search,

            @Param("department") String department,

            @Param("semester") Integer semester,

            @Param("placementStatus") String placementStatus,

            Pageable pageable);

}
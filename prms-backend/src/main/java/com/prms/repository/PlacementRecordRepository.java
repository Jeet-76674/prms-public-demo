package com.prms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prms.entity.PlacementRecord;
import com.prms.entity.StudentProfile;

@Repository
public interface PlacementRecordRepository extends JpaRepository<PlacementRecord, Long> {

    boolean existsByStudentAndOfferStatusIn(StudentProfile student, List<String> offerStatuses);

    Page<PlacementRecord> findByStudentUserId(Long studentUserId, Pageable pageable);

    Page<PlacementRecord> findByRecruiterUserId(Long recruiterUserId, Pageable pageable);

    @Query("SELECT p FROM PlacementRecord p JOIN p.student s JOIN s.user u WHERE " +
           "(:search IS NULL OR LOWER(p.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.enrollmentNumber) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:company IS NULL OR p.companyName = :company) AND " +
           "(:offerStatus IS NULL OR p.offerStatus = :offerStatus) AND " +
           "(:department IS NULL OR s.department = :department) AND " +
           "(:passingYear IS NULL OR s.passingYear = :passingYear)")
    Page<PlacementRecord> searchPlacements(
            @Param("search") String search,
            @Param("company") String company,
            @Param("offerStatus") String offerStatus,
            @Param("department") String department,
            @Param("passingYear") Integer passingYear,
            Pageable pageable);
}

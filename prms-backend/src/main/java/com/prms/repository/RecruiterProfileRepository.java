
package com.prms.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prms.entity.RecruiterProfile;
import com.prms.entity.User;

@Repository
public interface RecruiterProfileRepository
        extends JpaRepository<RecruiterProfile, Long> {

    Optional<RecruiterProfile> findByUser(User user);

    Optional<RecruiterProfile> findByUserId(Long userId);

    boolean existsByCompanyEmail(String companyEmail);

    boolean existsByCompanyPhone(String companyPhone);

    @Query("SELECT r FROM RecruiterProfile r WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(r.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.companyEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.hrName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.website) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR :status = '' OR LOWER(r.user.accountStatus) = LOWER(:status)) AND " +
           "(:verified IS NULL OR r.verified = :verified)")
    Page<RecruiterProfile> searchRecruiters(
            @Param("search") String search, 
            @Param("status") String status, 
            @Param("verified") Boolean verified, 
            Pageable pageable);

}

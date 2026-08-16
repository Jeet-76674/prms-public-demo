package com.prms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prms.entity.OtpVerification;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmailAndPurpose(String email, String purpose);

    void deleteByEmailAndPurpose(String email, String purpose);

}
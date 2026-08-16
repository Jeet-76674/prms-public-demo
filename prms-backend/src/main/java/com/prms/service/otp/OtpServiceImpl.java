package com.prms.service.otp;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prms.dto.request.SendOtpRequest;
import com.prms.dto.request.VerifyOtpRequest;
import com.prms.entity.OtpVerification;
import com.prms.repository.OtpVerificationRepository;
import com.prms.service.email.EmailService;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void sendOtp(SendOtpRequest request) {

        String requestedRole = request.getRole();
        if (requestedRole != null 
                && !"STUDENT".equalsIgnoreCase(requestedRole) 
                && !"RECRUITER".equalsIgnoreCase(requestedRole)) {
            throw new RuntimeException("Public registration is only permitted for Student and Recruiter roles.");
        }

        otpRepository.deleteByEmailAndPurpose(
                request.getEmail(),
                "SIGNUP"
        );

        String generatedOtp = generateOtp();

        OtpVerification otpVerification = new OtpVerification();

        otpVerification.setEmail(request.getEmail().trim().toLowerCase());
        otpVerification.setOtp(passwordEncoder.encode(generatedOtp));
        otpVerification.setPurpose("SIGNUP");
        otpVerification.setRole(request.getRole() != null ? request.getRole().toUpperCase() : null);
        otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpVerification.setVerified(false);

        otpRepository.save(otpVerification);

        emailService.sendOtp(request.getEmail(), generatedOtp);

    }

    @Override
    @Transactional
    public boolean verifyOtp(VerifyOtpRequest request) {

        Optional<OtpVerification> optionalOtp =
                otpRepository.findByEmailAndPurpose(
                        request.getEmail().trim().toLowerCase(),
                        "SIGNUP"
                );

        if (optionalOtp.isEmpty()) {
            throw new RuntimeException("OTP not found.");
        }

        OtpVerification otpVerification = optionalOtp.get();

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpVerification);
            throw new RuntimeException("OTP has expired.");
        }

        if (!passwordEncoder.matches(
                request.getOtp(),
                otpVerification.getOtp())) {

            throw new RuntimeException("Invalid OTP.");
        }

        otpRepository.delete(otpVerification);

        return true;
    }

    private String generateOtp() {

        Random random = new Random();

        return String.valueOf(100000 + random.nextInt(900000));

    }

}
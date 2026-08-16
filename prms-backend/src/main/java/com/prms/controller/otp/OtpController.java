package com.prms.controller.otp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.request.SendOtpRequest;
import com.prms.dto.request.VerifyOtpRequest;
import com.prms.dto.response.ApiResponse;
import com.prms.service.otp.OtpService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/otp")
@Validated
@CrossOrigin(origins = "*")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        otpService.sendOtp(request);

        return ResponseEntity.ok(
                new ApiResponse(true, "OTP sent successfully.")
        );
    }
    
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        otpService.verifyOtp(request);

        return ResponseEntity.ok(
                new ApiResponse(true, "OTP verified successfully.")
        );
    }

}
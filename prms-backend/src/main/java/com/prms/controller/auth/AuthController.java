package com.prms.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.prms.dto.request.LoginRequest;
import com.prms.dto.request.SignupRequest;
import com.prms.dto.request.ForgotPasswordRequest;
import com.prms.dto.request.ResetPasswordRequest;
import com.prms.dto.response.LoginResponse;
import com.prms.dto.response.SignupResponse;
import com.prms.dto.response.ApiResponse;
import com.prms.service.auth.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @Valid @RequestBody SignupRequest signupRequest) {

        SignupResponse response = authService.signup(signupRequest);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest) {

        LoginResponse response = authService.login(loginRequest);

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse> sendForgotPasswordOtp(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.sendForgotPasswordOtp(request);

        return ResponseEntity.ok(
                new ApiResponse(true, "OTP sent successfully.")
        );
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                new ApiResponse(true, "Password reset successfully.")
        );
    }
}
package com.prms.service.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prms.dto.request.ForgotPasswordRequest;
import com.prms.dto.request.LoginRequest;
import com.prms.dto.request.ResetPasswordRequest;
import com.prms.dto.request.SendOtpRequest;
import com.prms.dto.request.SignupRequest;
import com.prms.dto.request.VerifyOtpRequest;
import com.prms.dto.response.LoginResponse;
import com.prms.dto.response.SignupResponse;
import com.prms.entity.User;
import com.prms.security.CustomUserDetails;
import com.prms.security.JwtService;
import com.prms.service.otp.OtpService;
import com.prms.service.user.UserService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    @Override
    public SignupResponse signup(SignupRequest signupRequest) {

        validateSignup(signupRequest);

        VerifyOtpRequest verifyOtpRequest = new VerifyOtpRequest();
        verifyOtpRequest.setEmail(signupRequest.getEmail());
        verifyOtpRequest.setOtp(signupRequest.getOtp());

        otpService.verifyOtp(verifyOtpRequest);

        User user = buildUser(signupRequest);

        userService.save(user);

        return new SignupResponse(
                true,
                "Registration completed successfully."
        );
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        Optional<User> optionalUser =
                userService.findByEmail(loginRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password.");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password.");
        }

        if (!user.getRole().equalsIgnoreCase(loginRequest.getRole())) {
            throw new RuntimeException("Invalid role selected.");
        }

        CustomUserDetails userDetails =
                new CustomUserDetails(user);

        String token =
                jwtService.generateToken(userDetails);

        LoginResponse response = new LoginResponse();

        response.setSuccess(true);
        response.setMessage("Login successful.");
        response.setToken(token);
        response.setRole(user.getRole());
        response.setProfileCompleted(false);
        response.setFirstLogin(false);

        return response;
    }

    private void validateSignup(SignupRequest signupRequest) {

        String requestedRole = signupRequest.getRole();
        if (requestedRole == null 
                || (!"STUDENT".equalsIgnoreCase(requestedRole) && !"RECRUITER".equalsIgnoreCase(requestedRole))) {
            throw new RuntimeException("Public registration is only permitted for Student and Recruiter roles.");
        }

        if (userService.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        if (userService.existsByPhoneNumber(
                signupRequest.getPhoneNumber())) {

            throw new RuntimeException("Phone number already registered.");
        }

    }

    private User buildUser(SignupRequest signupRequest) {

        User user = new User();

        user.setFirstName(signupRequest.getFirstName().trim());
        user.setLastName(signupRequest.getLastName().trim());

        user.setEmail(signupRequest.getEmail().trim().toLowerCase());

        user.setPhoneNumber(signupRequest.getPhoneNumber().trim());

        user.setPassword(
                passwordEncoder.encode(signupRequest.getPassword())
        );

        String role = signupRequest.getRole().trim().toUpperCase();
        user.setRole(role);

        if ("RECRUITER".equalsIgnoreCase(role)) {
            user.setAccountStatus("PENDING");
        } else {
            user.setAccountStatus("ACTIVE");
        }

        return user;
    }
    
    @Override
    public void sendForgotPasswordOtp(ForgotPasswordRequest request) {

        Optional<User> optionalUser =
                userService.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found.");
        }

        SendOtpRequest otpRequest = new SendOtpRequest();

        otpRequest.setFirstName(optionalUser.get().getFirstName());
        otpRequest.setLastName(optionalUser.get().getLastName());
        otpRequest.setEmail(optionalUser.get().getEmail());
        otpRequest.setPhoneNumber(optionalUser.get().getPhoneNumber());
        otpRequest.setPassword(optionalUser.get().getPassword());
        otpRequest.setRole(optionalUser.get().getRole());

        otpService.sendOtp(otpRequest);

    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        
        VerifyOtpRequest verifyOtpRequest = new VerifyOtpRequest();
        verifyOtpRequest.setEmail(request.getEmail());
        verifyOtpRequest.setOtp(request.getOtp());
        
        otpService.verifyOtp(verifyOtpRequest);
        
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));
                
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        
        userService.save(user);
        
    }

}
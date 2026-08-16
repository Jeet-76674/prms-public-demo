
package com.prms.service.auth;

import com.prms.dto.request.ForgotPasswordRequest;
import com.prms.dto.request.LoginRequest;
import com.prms.dto.request.ResetPasswordRequest;
import com.prms.dto.request.SignupRequest;
import com.prms.dto.response.LoginResponse;
import com.prms.dto.response.SignupResponse;

public interface AuthService {

    SignupResponse signup(SignupRequest signupRequest);

    LoginResponse login(LoginRequest loginRequest);
    
    void sendForgotPasswordOtp(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

}
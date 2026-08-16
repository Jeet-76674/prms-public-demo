package com.prms.service.otp;

import com.prms.dto.request.SendOtpRequest;
import com.prms.dto.request.VerifyOtpRequest;

public interface OtpService {

    void sendOtp(SendOtpRequest request);

    boolean verifyOtp(VerifyOtpRequest request);

}
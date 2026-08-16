package com.prms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String otp;

    public VerifyOtpRequest() {
    }

	public VerifyOtpRequest(@NotBlank @Email String email, @NotBlank String otp) {
		super();
		this.email = email;
		this.otp = otp;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOtp() {
		return otp;
	}

	public void setOtp(String otp) {
		this.otp = otp;
	}

    
    
}
package com.prms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetTpoPasswordRequest {

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
    private String newPassword;

    public ResetTpoPasswordRequest() {
    }

    public ResetTpoPasswordRequest(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

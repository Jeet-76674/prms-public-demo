package com.prms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateRecruiterAccountStatusRequest {

    @NotBlank(message = "Account status is required")
    private String accountStatus;

    public UpdateRecruiterAccountStatusRequest() {
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }
}

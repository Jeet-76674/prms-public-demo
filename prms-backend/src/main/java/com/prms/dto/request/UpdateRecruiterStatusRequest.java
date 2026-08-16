package com.prms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateRecruiterStatusRequest {

    @NotBlank(message = "Account status is required.")
    private String accountStatus;

    public UpdateRecruiterStatusRequest() {
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

}
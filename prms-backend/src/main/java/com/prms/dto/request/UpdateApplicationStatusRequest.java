package com.prms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateApplicationStatusRequest {

    @NotBlank(message = "Application status is required.")
    private String applicationStatus;

    private String joiningDate;

    public UpdateApplicationStatusRequest() {
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public String getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(String joiningDate) {
        this.joiningDate = joiningDate;
    }
}
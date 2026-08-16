package com.prms.dto.request;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public class BulkUpdateApplicationStatusRequest {

    @NotEmpty(message = "Please select at least one application.")
    private List<Long> applicationIds;

    @NotBlank(message = "Application status is required.")
    private String applicationStatus;

    private String joiningDate;

    public BulkUpdateApplicationStatusRequest() {
    }

    public List<Long> getApplicationIds() {
        return applicationIds;
    }

    public void setApplicationIds(List<Long> applicationIds) {
        this.applicationIds = applicationIds;
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

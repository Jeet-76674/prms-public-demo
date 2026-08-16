package com.prms.dto.request;

import jakarta.validation.constraints.Size;

public class ApplyJobRequest {

    @Size(max = 2000,
            message = "Cover letter cannot exceed 2000 characters.")
    private String coverLetter;

    public ApplyJobRequest() {
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

}
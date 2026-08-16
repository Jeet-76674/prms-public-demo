package com.prms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdatePlacementStatusRequest {

    @NotBlank(message = "Placement status is required.")
    private String placementStatus;

    public UpdatePlacementStatusRequest() {
    }

    public String getPlacementStatus() {
        return placementStatus;
    }

    public void setPlacementStatus(String placementStatus) {
        this.placementStatus = placementStatus;
    }

}
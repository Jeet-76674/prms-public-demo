package com.prms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateOfferStatusRequest {

    @NotBlank(message = "Offer status is required")
    private String offerStatus;

    public String getOfferStatus() {
        return offerStatus;
    }

    public void setOfferStatus(String offerStatus) {
        this.offerStatus = offerStatus;
    }
}

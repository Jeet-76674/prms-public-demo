package com.prms.service.placement;

import org.springframework.data.domain.Page;

import com.prms.dto.request.CreatePlacementRequest;
import com.prms.dto.request.UpdateOfferStatusRequest;
import com.prms.dto.request.UpdatePlacementRequest;
import com.prms.dto.response.PlacementResponse;

public interface PlacementService {

    PlacementResponse createPlacement(CreatePlacementRequest request);

    PlacementResponse getPlacement(Long id);

    Page<PlacementResponse> getAllPlacements(
            String search,
            String company,
            String offerStatus,
            String department,
            Integer passingYear,
            Integer page,
            Integer size);

    PlacementResponse updatePlacement(Long id, UpdatePlacementRequest request);

    PlacementResponse updateOfferStatus(Long id, UpdateOfferStatusRequest request);

    Page<PlacementResponse> getStudentPlacements(Long studentUserId, Integer page, Integer size);

    Page<PlacementResponse> getRecruiterPlacements(Long recruiterUserId, Integer page, Integer size);
}

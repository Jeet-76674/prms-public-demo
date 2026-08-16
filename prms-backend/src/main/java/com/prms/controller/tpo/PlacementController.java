package com.prms.controller.tpo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prms.dto.request.CreatePlacementRequest;
import com.prms.dto.request.UpdateOfferStatusRequest;
import com.prms.dto.request.UpdatePlacementRequest;
import com.prms.dto.response.PlacementResponse;
import com.prms.service.placement.PlacementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tpo/placements")
public class PlacementController {

    @Autowired
    private PlacementService placementService;

    @PostMapping
    public ResponseEntity<PlacementResponse> createPlacement(@Valid @RequestBody CreatePlacementRequest request) {
        return ResponseEntity.ok(placementService.createPlacement(request));
    }

    @GetMapping
    public ResponseEntity<Page<PlacementResponse>> getAllPlacements(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String offerStatus,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer passingYear,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        return ResponseEntity.ok(placementService.getAllPlacements(search, company, offerStatus, department, passingYear, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlacementResponse> getPlacement(@PathVariable Long id) {
        return ResponseEntity.ok(placementService.getPlacement(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlacementResponse> updatePlacement(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePlacementRequest request) {
        return ResponseEntity.ok(placementService.updatePlacement(id, request));
    }

    @PutMapping("/{id}/offer-status")
    public ResponseEntity<PlacementResponse> updateOfferStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOfferStatusRequest request) {
        return ResponseEntity.ok(placementService.updateOfferStatus(id, request));
    }
}

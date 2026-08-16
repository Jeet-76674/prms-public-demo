package com.prms.controller.recruiter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prms.dto.response.PlacementResponse;
import com.prms.security.SecurityUtil;
import com.prms.service.placement.PlacementService;

@RestController
@RequestMapping("/api/recruiter/placements")
public class RecruiterPlacementController {

    @Autowired
    private PlacementService placementService;

    @Autowired
    private SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<Page<PlacementResponse>> getMyCompanyPlacements(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Long userId = securityUtil.getCurrentUser().getId();
        return ResponseEntity.ok(placementService.getRecruiterPlacements(userId, page, size));
    }
}

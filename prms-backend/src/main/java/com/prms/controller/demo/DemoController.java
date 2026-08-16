package com.prms.controller.demo;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prms.dto.response.ApiResponse;
import com.prms.service.demo.DemoDataService;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {

    @Autowired
    private DemoDataService demoDataService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getDemoStatus() {
        boolean enabled = demoDataService.isDemoEnabled();
        if (!enabled) {
            return ResponseEntity.ok(Map.of("demoEnabled", false));
        }

        return ResponseEntity.ok(Map.of(
                "demoEnabled", true,
                "accounts", demoDataService.getDemoAccountsInfo()
        ));
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetDemoEnvironment() {
        if (!demoDataService.isDemoEnabled()) {
            return new ResponseEntity<>(
                    new ApiResponse(false, "Demo reset is disabled in production environment."),
                    HttpStatus.FORBIDDEN
            );
        }

        demoDataService.resetToBaseline();

        return ResponseEntity.ok(
                new ApiResponse(true, "Demo environment has been restored to default baseline.")
        );
    }
}

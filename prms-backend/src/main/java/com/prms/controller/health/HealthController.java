package com.prms.controller.health;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @RequestMapping(
            value = {"/health", "/health/", "/api/health", "/api/health/"},
            method = {RequestMethod.GET, RequestMethod.HEAD}
    )
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new HashMap<>();
        body.put("status", "UP");
        body.put("message", "PRMS Backend is running");
        body.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(body);
    }
}

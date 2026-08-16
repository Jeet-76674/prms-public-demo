package com.prms.controller.tpo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prms.dto.response.TpoDashboardResponse;
import com.prms.service.tpo.TpoDashboardService;

@RestController
@RequestMapping("/api/tpo")
@Validated
@CrossOrigin(origins = "*")
public class TpoDashboardController {

    @Autowired
    private TpoDashboardService tpoDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<TpoDashboardResponse> getDashboard() {

        TpoDashboardResponse response =
                tpoDashboardService.getDashboard();

        return ResponseEntity.ok(response);

    }

}
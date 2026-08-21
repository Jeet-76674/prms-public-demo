package com.prms.controller;

import com.prms.controller.health.HealthController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class HealthControllerTest {

    private HealthController healthController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        healthController = new HealthController();
        mockMvc = MockMvcBuilders.standaloneSetup(healthController).build();
    }

    @Test
    void healthCheckReturnsExpectedStringDirectly() {
        ResponseEntity<String> response = healthController.health();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("PRMS Backend is running", response.getBody());
    }

    @Test
    void healthEndpointReturns200WithMockMvc() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("PRMS Backend is running"));
    }
}

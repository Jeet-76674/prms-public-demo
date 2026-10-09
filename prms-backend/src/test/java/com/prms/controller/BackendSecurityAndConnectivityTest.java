package com.prms.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.head;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class BackendSecurityAndConnectivityTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("Health endpoint returns 200 JSON with status UP without authentication")
    void testHealthEndpointPublicAccess() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.message", containsString("PRMS Backend is running")));

        mockMvc.perform(get("/health/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));

        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));

        mockMvc.perform(head("/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Health endpoint ignores invalid/malformed JWT and still returns 200 OK")
    void testHealthEndpointWithInvalidAuthorizationHeader() throws Exception {
        mockMvc.perform(get("/health")
                        .header("Authorization", "Bearer invalid-expired-malformed-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    @DisplayName("CORS preflight from deployed Vercel origin is allowed")
    void testCorsPreflightForVercelOrigin() throws Exception {
        mockMvc.perform(options("/health")
                        .header("Origin", "https://prms-public-demo.vercel.app")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://prms-public-demo.vercel.app"));

        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "https://prms-public-demo.vercel.app")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://prms-public-demo.vercel.app"));
    }

    @Test
    @DisplayName("Protected endpoint without JWT returns 401 with unauthorized message")
    void testProtectedEndpointWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/student/profile"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Unauthorized. Please login first.")));
    }

    @Test
    @DisplayName("Login with invalid credentials returns 400 with failure message")
    void testLoginWithInvalidCredentials() throws Exception {
        String invalidLoginPayload = """
                {
                    "email": "nonexistent.user@example.com",
                    "password": "WrongPassword@123",
                    "role": "STUDENT"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidLoginPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }
}

package com.apnabank.controller;

import com.apnabank.dto.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for health and status endpoints
 * These endpoints are publicly accessible and used for monitoring
 */
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    /**
     * Global health check endpoint to verify API is accessible
     * @return A simple health status message
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Banking API service is operational");
        status.put("timestamp", System.currentTimeMillis());
        status.put("version", "1.0.0");
        
        return ResponseEntity.ok(ApiResponse.success(status, "API is operational"));
    }
} 
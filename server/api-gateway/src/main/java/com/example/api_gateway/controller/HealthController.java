package com.example.api_gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for the API Gateway
 * This endpoint is publicly accessible and does not require authentication
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @Value("${spring.application.name:api-gateway}")
    private String applicationName;

    @Value("${server.port:8085}")
    private String serverPort;

    /**
     * Basic health check endpoint
     * @return Health status information
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", applicationName);
        healthInfo.put("port", serverPort);
        healthInfo.put("timestamp", LocalDateTime.now().toString());
        healthInfo.put("version", "1.0.0");
        
        return ResponseEntity.ok(healthInfo);
    }

    /**
     * Detailed health check with service dependencies
     * @return Detailed health status
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", applicationName);
        healthInfo.put("port", serverPort);
        healthInfo.put("timestamp", LocalDateTime.now().toString());
        healthInfo.put("version", "1.0.0");
        
        // Add service dependencies status
        Map<String, String> dependencies = new HashMap<>();
        dependencies.put("user-service", "configured");
        dependencies.put("journal-service", "configured");
        dependencies.put("genai-service", "configured");
        healthInfo.put("dependencies", dependencies);
        
        // Add configuration status
        Map<String, Object> config = new HashMap<>();
        config.put("authentication", "enabled");
        config.put("cors", "enabled");
        config.put("circuit-breaker", "enabled");
        healthInfo.put("configuration", config);
        
        return ResponseEntity.ok(healthInfo);
    }

    /**
     * Simple status endpoint for load balancers
     * @return Simple OK response
     */
    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("OK");
    }
}

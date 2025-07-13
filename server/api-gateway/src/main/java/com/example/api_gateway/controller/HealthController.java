package com.example.api_gateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.application.name:api-gateway}")
    private String applicationName;

    @Value("${server.port:8085}")
    private String serverPort;

    // Service URLs - using existing application.properties variables
    @Value("${user-service-url:http://localhost:8080}")
    private String userServiceBaseUrl;

    @Value("${journal-service-url:http://localhost:8081}")
    private String journalServiceBaseUrl;

    @Value("${genai-service-url:http://localhost:8082}")
    private String genaiServiceBaseUrl;

    // Configuration flags - simplified for application.properties setup
    @Value("${server.port:8085}")
    private String configuredPort;

    @Value("${clerk.secret-key:}")
    private String clerkSecretKey;

    /**
     * Check if a service is healthy by making a health check request
     * @param serviceUrl The health endpoint URL of the service
     * @return "UP" if service is healthy, "DOWN" if not
     */
    private String checkServiceHealth(String serviceUrl) {
        try {
            logger.debug("Checking health for service: {}", serviceUrl);
            ResponseEntity<String> response = restTemplate.getForEntity(serviceUrl, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.debug("Service {} is UP", serviceUrl);
                return "UP";
            } else {
                logger.warn("Service {} returned non-2xx status: {}", serviceUrl, response.getStatusCode());
                return "DOWN";
            }
        } catch (ResourceAccessException e) {
            // Service is not reachable
            logger.warn("Service {} is not reachable: {}", serviceUrl, e.getMessage());
            return "DOWN";
        } catch (Exception e) {
            // Any other error
            logger.error("Error checking health for service {}: {}", serviceUrl, e.getMessage());
            return "ERROR";
        }
    }

    /**
     * Get overall system status based on critical services
     * @param dependencies Map of service statuses
     * @return "UP" if all critical services are up, "DOWN" otherwise
     */
    private String getOverallStatus(Map<String, String> dependencies) {
        // Check if any critical service is down
        boolean allUp = dependencies.values().stream()
                .allMatch(status -> "UP".equals(status) || "configured".equals(status));
        return allUp ? "UP" : "DEGRADED";
    }

    /**
     * Basic health check endpoint
     * @return Health status information
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        // For basic health, we just check if the service itself is running
        // But we could also do a quick check of critical dependencies
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP"); // Gateway itself is up if responding
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
        // Check service dependencies dynamically by constructing health URLs
        Map<String, String> dependencies = new HashMap<>();
        dependencies.put("user-service", checkServiceHealth(userServiceBaseUrl + "/health"));
        dependencies.put("journal-service", checkServiceHealth(journalServiceBaseUrl + "/health"));
        dependencies.put("genai-service", checkServiceHealth(genaiServiceBaseUrl + "/health"));

        // Get overall status based on dependencies
        String overallStatus = getOverallStatus(dependencies);

        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", overallStatus);
        healthInfo.put("service", applicationName);
        healthInfo.put("port", serverPort);
        healthInfo.put("timestamp", LocalDateTime.now().toString());
        healthInfo.put("version", "1.0.0");
        healthInfo.put("dependencies", dependencies);
        
        // Add dynamic configuration status based on existing application.properties
        Map<String, Object> config = new HashMap<>();
        config.put("authentication", clerkSecretKey != null && !clerkSecretKey.isEmpty() && !clerkSecretKey.contains("dummy") ? "enabled" : "disabled");
        config.put("microservices", "configured"); // Since service URLs are configured
        config.put("port-binding", configuredPort.equals(serverPort) ? "enabled" : "custom");
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

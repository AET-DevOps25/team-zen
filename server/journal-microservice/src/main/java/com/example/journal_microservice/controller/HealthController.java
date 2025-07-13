package com.example.journal_microservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
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
 * Health check controller for the Journal Microservice
 * Provides health status including database and external service connectivity
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.application.name:journal-microservice}")
    private String applicationName;

    @Value("${server.port:8081}")
    private String serverPort;

    @Value("${spring.data.mongodb.database:journaldb}")
    private String databaseName;

    @Value("${user.service.base-url:http://user-microservice:8080}")
    private String userServiceUrl;

    @Value("${llm.service.url:http://genai-microservice:8082}")
    private String llmServiceUrl;

    /**
     * Check database connectivity
     * @return "UP" if database is accessible, "DOWN" if not
     */
    private String checkDatabaseHealth() {
        try {
            mongoTemplate.getCollection("journalEntries").estimatedDocumentCount();
            logger.debug("Database connection is healthy");
            return "UP";
        } catch (Exception e) {
            logger.error("Database connection failed: {}", e.getMessage());
            return "DOWN";
        }
    }

    /**
     * Check external service connectivity
     * @param serviceUrl The service URL to check
     * @return "UP" if service is accessible, "DOWN" if not
     */
    private String checkServiceHealth(String serviceUrl) {
        try {
            logger.debug("Checking health for service: {}", serviceUrl);
            ResponseEntity<String> response = restTemplate.getForEntity(serviceUrl + "/health", String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.debug("Service {} is UP", serviceUrl);
                return "UP";
            } else {
                logger.warn("Service {} returned non-2xx status: {}", serviceUrl, response.getStatusCode());
                return "DOWN";
            }
        } catch (ResourceAccessException e) {
            logger.warn("Service {} is not reachable: {}", serviceUrl, e.getMessage());
            return "DOWN";
        } catch (Exception e) {
            logger.error("Error checking health for service {}: {}", serviceUrl, e.getMessage());
            return "ERROR";
        }
    }

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
     * Detailed health check with dependencies
     * @return Detailed health status
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        String dbStatus = checkDatabaseHealth();
        String userServiceStatus = checkServiceHealth(userServiceUrl);
        String llmServiceStatus = checkServiceHealth(llmServiceUrl);
        
        // Determine overall status
        boolean allHealthy = "UP".equals(dbStatus) && "UP".equals(userServiceStatus) && "UP".equals(llmServiceStatus);
        String overallStatus = allHealthy ? "UP" : "DEGRADED";

        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", overallStatus);
        healthInfo.put("service", applicationName);
        healthInfo.put("port", serverPort);
        healthInfo.put("timestamp", LocalDateTime.now().toString());
        healthInfo.put("version", "1.0.0");
        
        // Dependencies status
        Map<String, String> dependencies = new HashMap<>();
        dependencies.put("mongodb", dbStatus);
        dependencies.put("user-service", userServiceStatus);
        dependencies.put("genai-service", llmServiceStatus);
        dependencies.put("database-name", databaseName);
        healthInfo.put("dependencies", dependencies);
        
        // Configuration status
        Map<String, String> config = new HashMap<>();
        config.put("mongodb-connection", dbStatus.equals("UP") ? "enabled" : "disabled");
        config.put("user-service-integration", userServiceStatus.equals("UP") ? "enabled" : "disabled");
        config.put("genai-service-integration", llmServiceStatus.equals("UP") ? "enabled" : "disabled");
        config.put("management-endpoints", "enabled");
        config.put("prometheus-metrics", "enabled");
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

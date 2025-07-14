package com.example.user_microservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller for the User Microservice
 * Provides health status including database connectivity
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${spring.application.name:user-microservice}")
    private String applicationName;

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${spring.data.mongodb.database:userdb}")
    private String databaseName;

    /**
     * Check database connectivity
     * @return "UP" if database is accessible, "DOWN" if not
     */
    private String checkDatabaseHealth() {
        try {
            // Try to ping the database
            mongoTemplate.getCollection("users").estimatedDocumentCount();
            logger.debug("Database connection is healthy");
            return "UP";
        } catch (Exception e) {
            logger.error("Database connection failed: {}", e.getMessage());
            return "DOWN";
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
     * Detailed health check with database status
     * @return Detailed health status
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        String dbStatus = checkDatabaseHealth();
        String overallStatus = "UP".equals(dbStatus) ? "UP" : "DEGRADED";

        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", overallStatus);
        healthInfo.put("service", applicationName);
        healthInfo.put("port", serverPort);
        healthInfo.put("timestamp", LocalDateTime.now().toString());
        healthInfo.put("version", "1.0.0");
        
        // Database dependency status
        Map<String, String> dependencies = new HashMap<>();
        dependencies.put("mongodb", dbStatus);
        dependencies.put("database-name", databaseName);
        healthInfo.put("dependencies", dependencies);
        
        // Configuration status
        Map<String, String> config = new HashMap<>();
        config.put("mongodb-connection", dbStatus.equals("UP") ? "enabled" : "disabled");
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

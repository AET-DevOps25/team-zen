package com.example.api_gateway.config;

import com.example.api_gateway.filter.ClerkAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final ClerkAuthenticationFilter clerkAuthenticationFilter;

    @Value("${user-service-url}")
    private String userServiceUri;

    @Value("${journal-service-url}")
    private String journalServiceUri;

    @Value("${genai-service-url}")
    private String genaiServiceUri;

    public GatewayConfig(ClerkAuthenticationFilter clerkAuthenticationFilter) {
        this.clerkAuthenticationFilter = clerkAuthenticationFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // User Service Routes
            .route("user-service", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .filter(clerkAuthenticationFilter)
                    .stripPrefix(0))
                .uri(userServiceUri))
            
            // Journal Service Routes
            .route("journal-service", r -> r
                .path("/api/journalEntry/**", "/api/snippets/**")
                .filters(f -> f
                    .filter(clerkAuthenticationFilter)
                    .stripPrefix(0))
                .uri(journalServiceUri))

            // GenAI Service Routes
            .route("genai-service", r -> r
                .path("/api/genai/**")
                .filters(f -> f
                    .filter(clerkAuthenticationFilter)
                    .stripPrefix(0))
                .uri(genaiServiceUri))

            // Public routes (no authentication required)
            // .route("health-check", r -> r
            //     .path("/health", "/actuator/health")
            //     .filters(f -> f.stripPrefix(0))
            //     .uri("http://localhost:8080"))
                        
            .build();
    }
}
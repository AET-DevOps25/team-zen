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
            // All /api/** routes require authentication
            .route("api-routes", r -> r
            .path("/api/**")
            .filters(f -> f
                .filter(clerkAuthenticationFilter)
                .stripPrefix(0))
            .uri("no://op")) // placeholder, will be overridden by predicates below

            // User Service
            .route("user-service", r -> r
            .path("/api/users/**")
            .uri(userServiceUri))

            // Journal Service
            .route("journal-service", r -> r
            .path("/api/journalEntry/**", "/api/snippets/**")
            .uri(journalServiceUri))

            // GenAI Service
            .route("genai-service", r -> r
            .path("/api/genai/**")
            .uri(genaiServiceUri))

            .build();
    }
}
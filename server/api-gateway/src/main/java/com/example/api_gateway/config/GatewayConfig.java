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
                                // User Service (with auth filter)
                                .route("user-service", r -> r
                                                .path("/api/users/**")
                                                .filters(f -> f.filter(clerkAuthenticationFilter))
                                                .uri(userServiceUri))

                                // Journal Service (with auth filter)
                                .route("journal-service", r -> r
                                                .path("/api/journalEntry/**", "/api/snippets/**", "/api/summary/**")
                                                .filters(f -> f.filter(clerkAuthenticationFilter))
                                                .uri(journalServiceUri))

                                // GenAI Service (with auth filter)
                                .route("genai-service", r -> r
                                                .path("/api/genai/**")
                                                .filters(f -> f.filter(clerkAuthenticationFilter))
                                                .uri(genaiServiceUri))

                                .route("docs-entry-point", r -> r
                                                .path("/api/docs/**")
                                                .filters(f -> f.rewritePath("/api/docs/?(.*)", "/swagger-ui.html"))
                                                .uri(""))

                                // User Service (api docs)
                                .route("user-service-docs", r -> r
                                                .path("/api/user-service/swagger-ui/**",
                                                                "/api/user-service/v3/api-docs/**")
                                                .filters(f -> f.rewritePath("/api/user-service/?(.*)", "/api/$1"))
                                                .uri(userServiceUri))

                                // Journal Service (api docs)
                                .route("journal-service-docs", r -> r
                                                .path("/api/journal-service/swagger-ui/**",
                                                                "/api/journal-service/v3/api-docs/**")
                                                .filters(f -> f.rewritePath("/journal-service/(.*)", "/api/$1"))
                                                .uri(journalServiceUri))

                                // GenAI Service (api docs)
                                .route("genai-service-docs", r -> r
                                                .path("/api/genai-service/docs/**", "/api/genai-service/openapi.json")
                                                .filters(f -> f.rewritePath("/genai-service/?(.*)", "/api/$1"))
                                                .uri(genaiServiceUri))

                                .build();
        }
}
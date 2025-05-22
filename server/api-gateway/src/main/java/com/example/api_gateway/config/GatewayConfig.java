package com.example.api_gateway.config;

// import com.example.api_gateway.filter.AuthenticationFilter;
// import com.example.api_gateway.filter.LoggingFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    // private final AuthenticationFilter authenticationFilter;
    // private final LoggingFilter loggingFilter;

    // public GatewayConfig(AuthenticationFilter authenticationFilter, 
    //                     LoggingFilter loggingFilter) {
    //     this.authenticationFilter = authenticationFilter;
    //     this.loggingFilter = loggingFilter;
    // }

    public GatewayConfig() {
        // Initialize filters here if needed
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // User Service Routes
            .route("user-service", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    // .filter(loggingFilter)
                    // .filter(authenticationFilter)
                    .stripPrefix(0)
                    // .circuitBreaker(config -> config
                    //     .setName("user-service-cb")
                    //     .setFallbackUri("forward:/fallback/users"))
                    )
                .uri("http://localhost:8080"))
            
            // Product Service Routes
            .route("journal-service", r -> r
                .path("/api/journalEntry/**", "/api/snippets/**")
                .filters(f -> f
                    // .filter(loggingFilter)
                    // .filter(authenticationFilter)
                    .stripPrefix(0)
                    // .circuitBreaker(config -> config
                    //     .setName("journal-service-cb")
                    //     .setFallbackUri("forward:/fallback/journal"))
                    )
                .uri("http://localhost:8081"))
                        
            // Authentication Service Routes (no auth filter needed)
            // .route("auth-service", r -> r
            //     .path("/api/auth/**")
            //     .filters(f -> f
            //         .filter(loggingFilter)
            //         .stripPrefix(0))
            //     .uri("http://localhost:8084"))
            
            .build();
    }
}
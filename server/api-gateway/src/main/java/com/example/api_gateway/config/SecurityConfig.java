package com.example.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            // Disable CSRF as we're using JWT tokens
            .csrf(csrf -> csrf.disable())
            
            // Disable default form login and HTTP Basic auth
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            
            // Allow all requests to pass through - we handle auth in our custom filter
            .authorizeExchange(exchanges -> exchanges
                .anyExchange().permitAll()
            )
            
            .build();
    }
}

package com.example.api_gateway.filter;

import com.example.api_gateway.service.ClerkJwtService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Component
public class ClerkAuthenticationFilter implements GatewayFilter {

    private final ClerkJwtService clerkJwtService;
    private final ObjectMapper objectMapper;

    public ClerkAuthenticationFilter(ClerkJwtService clerkJwtService) {
        this.clerkJwtService = clerkJwtService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        return clerkJwtService.validateToken(request)
            .flatMap(isAuthenticated -> {
                if (isAuthenticated) {
                    return chain.filter(exchange);
                } else {
                    return onError(exchange, "Clerk auth failed, Invalid or expired token", HttpStatus.UNAUTHORIZED);
                }
            });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Authentication Failed");
        errorResponse.put("message", message);
        errorResponse.put("status", status.value());

        try {
            String body = objectMapper.writeValueAsString(errorResponse);
            DataBuffer buffer = response.bufferFactory().wrap(body.getBytes());
            return response.writeWith(Mono.just(buffer));
        } catch (JsonProcessingException e) {
            return response.setComplete();
        }
    }
}
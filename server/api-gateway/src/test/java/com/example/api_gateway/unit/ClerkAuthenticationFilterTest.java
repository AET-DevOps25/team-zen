package com.example.api_gateway.unit;

import com.example.api_gateway.filter.ClerkAuthenticationFilter;
import com.example.api_gateway.service.ClerkJwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClerkAuthenticationFilterTest {

    @Mock
    private ClerkJwtService clerkJwtService;

    @Mock
    private GatewayFilterChain filterChain;

    private ClerkAuthenticationFilter authenticationFilter;

    @BeforeEach
    void setUp() {
        authenticationFilter = new ClerkAuthenticationFilter(clerkJwtService);
    }

    @Test
    void shouldAllowRequestWhenTokenIsValid() {
        // Given
        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/users/profile")
            .header("Authorization", "Bearer valid-token")
            .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(true));
        when(filterChain.filter(exchange)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Then
        StepVerifier.create(result)
            .verifyComplete();
        
        verify(filterChain).filter(exchange);
        verify(clerkJwtService).validateToken(request);
    }

    @Test
    void shouldRejectRequestWhenTokenIsInvalid() {
        // Given
        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/users/profile")
            .header("Authorization", "Bearer invalid-token")
            .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(false));

        // When
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Then
        StepVerifier.create(result)
            .verifyComplete();
        
        verify(filterChain, never()).filter(any());
        verify(clerkJwtService).validateToken(request);
        
        // Verify response status
        assert exchange.getResponse().getStatusCode() == HttpStatus.UNAUTHORIZED;
    }

    @Test
    void shouldRejectRequestWhenTokenValidationFails() {
        // Given
        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/users/profile")
            .header("Authorization", "Bearer malformed-token")
            .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.error(new RuntimeException("Token validation error")));

        // When
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Then
        StepVerifier.create(result)
            .verifyError();
        
        verify(filterChain, never()).filter(any());
        verify(clerkJwtService).validateToken(request);
    }

    @Test
    void shouldRejectRequestWithoutAuthorizationHeader() {
        // Given
        MockServerHttpRequest request = MockServerHttpRequest
            .get("/api/users/profile")
            .build(); // No Authorization header
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(false));

        // When
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Then
        StepVerifier.create(result)
            .verifyComplete();
        
        verify(filterChain, never()).filter(any());
        verify(clerkJwtService).validateToken(request);
        
        // Verify response status
        assert exchange.getResponse().getStatusCode() == HttpStatus.UNAUTHORIZED;
    }
}

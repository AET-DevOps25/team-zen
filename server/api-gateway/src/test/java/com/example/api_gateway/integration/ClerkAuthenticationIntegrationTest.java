package com.example.api_gateway.integration;

import com.example.api_gateway.service.ClerkJwtService;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ClerkAuthenticationIntegrationTest {

    @LocalServerPort
    private int gatewayPort;

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private ClerkJwtService clerkJwtService;

    private static WireMockServer userServiceMock;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (userServiceMock == null) {
            userServiceMock = new WireMockServer(WireMockConfiguration.options().port(8080));
            userServiceMock.start();
        }
        registry.add("user-service-url", () -> "http://localhost:" + userServiceMock.port());
        registry.add("journal-service-url", () -> "http://localhost:8081");
        registry.add("genai-service-url", () -> "http://localhost:8082");
    }

    @BeforeEach
    void setUp() {
        userServiceMock.resetAll();
    }

    @AfterAll
    static void tearDownAll() {
        if (userServiceMock != null && userServiceMock.isRunning()) {
            userServiceMock.stop();
        }
    }

    @Test
    void shouldAllowRequestWithValidToken() {
        // Given
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(true));
        
        userServiceMock.stubFor(get(urlPathEqualTo("/api/users"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"userId\":\"123\",\"name\":\"John Doe\"}")));

        // When & Then
        webTestClient.get()
            .uri("/api/users")
            .header("Authorization", "Bearer valid-jwt-token")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.userId").isEqualTo("123")
            .jsonPath("$.name").isEqualTo("John Doe");
    }

    @Test
    void shouldRejectRequestWithInvalidToken() {
        // Given
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(false));

        // When & Then
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Authorization", "Bearer invalid-token")
            .exchange()
            .expectStatus().isUnauthorized()
            .expectBody()
            .jsonPath("$.error").isEqualTo("Authentication Failed");
    }

    @Test
    void shouldRejectRequestWithoutToken() {
        // Given
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(false));

        // When & Then
        webTestClient.get()
            .uri("/api/users/profile")
            .exchange()
            .expectStatus().isUnauthorized()
            .expectBody()
            .jsonPath("$.error").isEqualTo("Authentication Failed");
    }

    @Test
    void shouldAllowHealthCheckWithoutAuthentication() {
        // Health endpoint should be accessible without authentication
        webTestClient.get()
            .uri("/actuator/health")
            .exchange()
            .expectStatus().isOk();
    }

    @Test
    void shouldPropagateUserIdHeaderToDownstreamService() {
        // Given
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(true));
        
        userServiceMock.stubFor(get(urlPathEqualTo("/api/users/profile"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"userId\":\"123\"}")));

        // When
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Authorization", "Bearer valid-jwt-token")
            .exchange()
            .expectStatus().isOk();

        // Then - verify that the request was forwarded to the user service
        userServiceMock.verify(getRequestedFor(urlPathEqualTo("/api/users/profile")));
    }
}

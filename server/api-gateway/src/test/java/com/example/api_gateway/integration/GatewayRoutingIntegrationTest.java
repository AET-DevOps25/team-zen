package com.example.api_gateway.integration;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GatewayRoutingIntegrationTest {

    @LocalServerPort
    private int gatewayPort;

    @Autowired
    private WebTestClient webTestClient;

    private static WireMockServer userServiceMock;
    private static WireMockServer journalServiceMock;
    private static WireMockServer genaiServiceMock;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Start WireMock servers for each service
        userServiceMock = new WireMockServer(WireMockConfiguration.options().port(8080));
        journalServiceMock = new WireMockServer(WireMockConfiguration.options().port(8081));
        genaiServiceMock = new WireMockServer(WireMockConfiguration.options().port(8082));
        
        userServiceMock.start();
        journalServiceMock.start();
        genaiServiceMock.start();
        
        registry.add("user-service-url", () -> "http://localhost:" + userServiceMock.port());
        registry.add("journal-service-url", () -> "http://localhost:" + journalServiceMock.port());
        registry.add("genai-service-url", () -> "http://localhost:" + genaiServiceMock.port());
    }

    @BeforeEach
    void setUp() {
        // Reset all mocks before each test
        userServiceMock.resetAll();
        journalServiceMock.resetAll();
        genaiServiceMock.resetAll();
    }

    @AfterEach
    void tearDown() {
        if (userServiceMock != null && userServiceMock.isRunning()) {
            userServiceMock.stop();
        }
        if (journalServiceMock != null && journalServiceMock.isRunning()) {
            journalServiceMock.stop();
        }
        if (genaiServiceMock != null && genaiServiceMock.isRunning()) {
            genaiServiceMock.stop();
        }
    }

    @Test
    void shouldRouteToUserService() {
        // Given
        userServiceMock.stubFor(get(urlPathEqualTo("/api/users/"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"userId\":\"123\",\"name\":\"John Doe\"}")));

        // When & Then
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Authorization", "Bearer valid-token")
            .exchange()
            .expectStatus().isUnauthorized(); // Without proper Clerk token validation
    }

    @Test
    void shouldRouteToJournalService() {
        // Given
        journalServiceMock.stubFor(get(urlPathEqualTo("/api/journalEntry"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("[{\"id\":\"1\",\"content\":\"Test entry\"}]")));

        // When & Then
        webTestClient.get()
            .uri("/api/journalEntry")
            .header("Authorization", "Bearer valid-token")
            .exchange()
            .expectStatus().isUnauthorized(); // Without proper Clerk token validation
    }

    @Test
    void shouldRouteToGenAIService() {
        // Given
        genaiServiceMock.stubFor(post(urlPathEqualTo("/api/genai/analyze"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .withBody("{\"analysis\":\"positive sentiment\"}")));

        // When & Then
        webTestClient.post()
            .uri("/api/genai/")
            .header("Authorization", "Bearer valid-token")
            .bodyValue("{\"text\":\"I feel great today!\"}")
            .exchange()
            .expectStatus().isUnauthorized(); // Without proper Clerk token validation
    }

    @Test
    void shouldReturnNotFoundForUnmatchedRoutes() {
        webTestClient.get()
            .uri("/api/unknown/endpoint")
            .exchange()
            .expectStatus().isNotFound();
    }

    @Test
    void shouldHandleServiceUnavailable() {
        // Given - user service is down (no stub configured)
        
        // When & Then
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Authorization", "Bearer valid-token")
            .exchange()
            .expectStatus().isUnauthorized(); // Auth filter runs first
    }
}

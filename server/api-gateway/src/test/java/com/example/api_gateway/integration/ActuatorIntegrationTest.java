package com.example.api_gateway.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActuatorIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void shouldExposeHealthEndpoint() {
        webTestClient.get()
            .uri("/actuator/health")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.status").isEqualTo("UP");
    }

    // TODO: test more actuator endpoints after monitoring is implemented
    // @Test
    // void shouldExposeGatewayEndpoint() {
    //     webTestClient.get()
    //         .uri("/actuator/gateway/routes")
    //         .exchange()
    //         .expectStatus().isOk()
    //         .expectBody()
    //         .jsonPath("$").isArray();
    // }

    // @Test
    // void shouldShowGatewayRouteDetails() {
    //     webTestClient.get()
    //         .uri("/actuator/gateway/routes")
    //         .exchange()
    //         .expectStatus().isOk()
    //         .expectBody()
    //         .jsonPath("$[?(@.route_id == 'user-service')]").exists()
    //         .jsonPath("$[?(@.route_id == 'journal-service')]").exists()
    //         .jsonPath("$[?(@.route_id == 'genai-service')]").exists();
    // }

    // @Test
    // void shouldProvideGatewayFiltersInfo() {
    //     webTestClient.get()
    //         .uri("/actuator/gateway/globalfilters")
    //         .exchange()
    //         .expectStatus().isOk()
    //         .expectBody()
    //         .jsonPath("$").isArray();
    // }

    @Test
    void shouldNotExposeUnsecuredSensitiveEndpoints() {
        // Test that sensitive actuator endpoints are not accessible without proper auth
        webTestClient.get()
            .uri("/actuator/env")
            .exchange()
            .expectStatus().isNotFound(); // Should not be exposed
    }

    @Test
    void shouldProvideInfoEndpoint() {
        webTestClient.get()
            .uri("/actuator/info")
            .exchange()
            .expectStatus().isOk();
    }
}

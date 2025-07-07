package com.example.api_gateway.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CorsIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void shouldHandlePreflightCorsRequest() {
        webTestClient.options()
            .uri("/api/users/profile")
            .header("Origin", "http://localhost:3000")
            .header("Access-Control-Request-Method", "GET")
            .header("Access-Control-Request-Headers", "Authorization,Content-Type")
            .exchange()
            .expectStatus().isOk()
            .expectHeader().exists("Access-Control-Allow-Origin")
            .expectHeader().exists("Access-Control-Allow-Methods")
            .expectHeader().exists("Access-Control-Allow-Headers");
    }

    @Test
    void shouldAllowCrossOriginGetRequest() {
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Origin", "http://localhost:3000")
            .header("Authorization", "Bearer some-token")
            .exchange()
            .expectHeader().exists("Access-Control-Allow-Origin");
    }

    @Test
    void shouldAllowCrossOriginPostRequest() {
        webTestClient.post()
            .uri("/api/journalEntry")
            .header("Origin", "http://localhost:3000")
            .header("Authorization", "Bearer some-token")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{\"content\":\"test entry\"}")
            .exchange()
            .expectHeader().exists("Access-Control-Allow-Origin");
    }

    @Test
    void shouldHandleCorsForDifferentOrigins() {
        String[] origins = {
            "http://localhost:3000",
            "https://teamzen.com",
            "https://app.teamzen.com"
        };

        for (String origin : origins) {
            webTestClient.get()
                .uri("/api/users/profile")
                .header("Origin", origin)
                .header("Authorization", "Bearer some-token")
                .exchange()
                .expectHeader().exists("Access-Control-Allow-Origin");
        }
    }
}

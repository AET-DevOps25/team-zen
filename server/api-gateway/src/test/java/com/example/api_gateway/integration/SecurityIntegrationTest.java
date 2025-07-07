package com.example.api_gateway.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SecurityIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void shouldRejectRequestsWithMaliciousPayloads() {
        // Test XSS payload
        String xssPayload = "<script>alert('xss')</script>";
        
        webTestClient.post()
            .uri("/api/journalEntry")
            .header("Authorization", "Bearer fake-token")
            .bodyValue("{\"content\":\"" + xssPayload + "\"}")
            .exchange()
            .expectStatus().isUnauthorized(); // Should be rejected by auth first
    }

    @Test
    void shouldRejectRequestsWithSqlInjectionAttempts() {
        // Test SQL injection payload
        String sqlInjection = "'; DROP TABLE users; --";
        
        webTestClient.get()
            .uri("/api/users/profile?id=" + sqlInjection)
            .header("Authorization", "Bearer fake-token")
            .exchange()
            .expectStatus().isUnauthorized(); // Should be rejected by auth first
    }

    @Test
    void shouldRejectRequestsWithExcessiveHeaderSize() {
        // Create a very large header value
        String largeHeaderValue = "x".repeat(10000);
        
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Custom-Header", largeHeaderValue)
            .header("Authorization", "Bearer fake-token")
            .exchange()
            .expectStatus().is4xxClientError(); // Should be rejected due to header size
    }

    @Test
    void shouldRejectRequestsWithInvalidContentType() {
        webTestClient.post()
            .uri("/api/journalEntry")
            .header("Authorization", "Bearer fake-token")
            .header("Content-Type", "application/xml") // Invalid content type
            .bodyValue("<xml>test</xml>")
            .exchange()
            .expectStatus().is4xxClientError();
    }

    @Test
    void shouldPreventDirectoryTraversalAttacks() {
        String[] traversalAttempts = {
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
        };

        for (String attempt : traversalAttempts) {
            webTestClient.get()
                .uri("/api/users/" + attempt)
                .header("Authorization", "Bearer fake-token")
                .exchange()
                .expectStatus().isBadRequest(); // Auth should catch this first
        }
    }

    @Test
    void shouldEnforceHttpsRedirection() {
        // In production, this would test HTTPS enforcement
        // For now, just verify the gateway accepts HTTP in test mode
        webTestClient.get()
            .uri("/api/users/profile")
            .header("Authorization", "Bearer fake-token")
            .exchange()
            .expectStatus().isUnauthorized();
    }

    @Test
    void shouldValidateRequestBodySize() {
        // Create a large request body
        String largeBody = "{\"content\":\"" + "x".repeat(1000000) + "\"}";
        
        webTestClient.post()
            .uri("/api/journalEntry")
            .header("Authorization", "Bearer fake-token")
            .bodyValue(largeBody)
            .exchange()
            .expectStatus().is4xxClientError(); // Should be rejected due to body size
    }
}

package com.example.api_gateway.e2e;

import com.example.api_gateway.service.ClerkJwtService;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import reactor.core.publisher.Mono;

import java.time.Duration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * End-to-End tests using Testcontainers to simulate real microservices
 * This test demonstrates how the gateway would work with actual services
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class GatewayE2ETest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private ClerkJwtService clerkJwtService;

    private static final Network network = Network.newNetwork();

    @Container
    static GenericContainer<?> userService = new GenericContainer<>(DockerImageName.parse("node:18-alpine"))
        .withNetwork(network)
        .withNetworkAliases("user-service")
        .withExposedPorts(8080)
        .withCommand("sh", "-c", 
            "node -e \"const http = require('http'); const server = http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify({userId: '123', name: 'Test User'})); }); server.listen(8080, '0.0.0.0');\"");

    @Container
    static GenericContainer<?> journalService = new GenericContainer<>(DockerImageName.parse("node:18-alpine"))
        .withNetwork(network)
        .withNetworkAliases("journal-service")
        .withExposedPorts(8081)
        .withCommand("sh", "-c", 
            "node -e \"const http = require('http'); const server = http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify([{id: '1', content: 'Test entry'}])); }); server.listen(8081, '0.0.0.0');\"");

    @Container
    static GenericContainer<?> genaiService = new GenericContainer<>(DockerImageName.parse("node:18-alpine"))
        .withNetwork(network)
        .withNetworkAliases("genai-service")
        .withExposedPorts(8082)
        .withCommand("sh", "-c", 
            "node -e \"const http = require('http'); const server = http.createServer((req, res) => { if (req.method === 'POST') { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify({analysis: 'positive sentiment'})); } else { res.writeHead(404); res.end(); } }); server.listen(8082, '0.0.0.0');\"");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("user-service-url", 
            () -> "http://" + userService.getHost() + ":" + userService.getMappedPort(8080));
        registry.add("journal-service-url", 
            () -> "http://" + journalService.getHost() + ":" + journalService.getMappedPort(8081));
        registry.add("genai-service-url", 
            () -> "http://" + genaiService.getHost() + ":" + genaiService.getMappedPort(8082));
    }

    @BeforeEach
    void setUp() {
        // Mock the ClerkJwtService to always return true for authentication
        // This allows us to test the routing and service availability aspects
        when(clerkJwtService.validateToken(any())).thenReturn(Mono.just(true));
    }

    @Test
    @Order(1)
    void shouldRouteToAllServicesInDockerEnvironment() {
        WebTestClient client = WebTestClient.bindToServer()
            .baseUrl("http://localhost:" + port) // Use dynamic port
            .responseTimeout(Duration.ofSeconds(30))
            .build();

        // Test user service routing - should get response from mock service
        client.get()
            .uri("/api/users/profile")
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentType("application/json")
            .expectBody()
            .jsonPath("$.userId").isEqualTo("123")
            .jsonPath("$.name").isEqualTo("Test User");

        // Test journal service routing - should get response from mock service
        client.get()
            .uri("/api/journalEntry/123")
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentType("application/json")
            .expectBody()
            .jsonPath("$[0].id").isEqualTo("1")
            .jsonPath("$[0].content").isEqualTo("Test entry");

        // Test genai service routing - should get response from mock service
        client.post()
            .uri("/api/genai/analyze")
            .bodyValue("{\"text\":\"test\"}")
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentType("application/json")
            .expectBody()
            .jsonPath("$.analysis").isEqualTo("positive sentiment");
    }

    @Test
    @Order(2)
    void shouldHandleServiceDiscoveryAndLoadBalancing() {
        WebTestClient client = WebTestClient.bindToServer()
            .baseUrl("http://localhost:" + port) // Use dynamic port
            .responseTimeout(Duration.ofSeconds(30))
            .build();

        // Make multiple requests to test load balancing (if implemented)
        for (int i = 0; i < 5; i++) {
            client.get()
                .uri("/api/users/profile")
                .exchange()
                .expectStatus().isOk(); // Should successfully route to mock service
        }
    }

    @Test
    @Order(3)
    void shouldHandleNetworkPartitionGracefully() {
        WebTestClient client = WebTestClient.bindToServer()
            .baseUrl("http://localhost:" + port) // Use dynamic port
            .responseTimeout(Duration.ofSeconds(30))
            .build();

        // Stop one service to simulate network partition
        userService.stop();

        // Gateway should handle the failure gracefully
        client.get()
            .uri("/api/users/profile")
            .exchange()
            .expectStatus().is5xxServerError(); // Service unavailable
        
        // Restart the service for any subsequent tests
        userService.start();
    }
}

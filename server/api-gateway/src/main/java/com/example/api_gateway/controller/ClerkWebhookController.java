package com.example.api_gateway.controller;

import java.util.ArrayList;
import java.util.Map;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import com.example.api_gateway.ClerkWebhookVerifier;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@RequestMapping("/api/webhooks")
public class ClerkWebhookController {

  @Value("${clerk.webhook.secret}")
  private String clerkWebhookSecret;

  private final ClerkWebhookVerifier webhookVerifier;

  public ClerkWebhookController(ClerkWebhookVerifier webhookVerifier) {
    this.webhookVerifier = webhookVerifier;
  }

  @GetMapping()
  public ResponseEntity<String> getMethodName() {
    return ResponseEntity.ok("get working");
  }

  @PostMapping
  public Mono<ResponseEntity<String>> handleClerkWebhook(@RequestBody String payload,
      @RequestHeader("svix-signature") String signature, @RequestHeader("svix-timestamp") String timestamp,
      @RequestHeader("svix-id") String id) {

    try {
      // Verify the webhook signature
      if (!verifyWebhookSignature(payload, signature, timestamp, id)) {
        ResponseEntity response = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Invalid signature");
        return Mono.just(response);
      } else {
        Logger logger = org.slf4j.LoggerFactory.getLogger(ClerkWebhookController.class);
        logger.debug("Webhook signature verified successfully");
        return processWebhook(payload).thenReturn(ResponseEntity.ok("Webhook received"));
      }
    } catch (Exception e) {
      ResponseEntity<String> response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error processing webhook: " + e.getMessage());
      return Mono.just(response);
    }
  }

  private boolean verifyWebhookSignature(String payload, String signature,
      String timestamp, String id) {
    // Create the signed payload string
    String signedPayload = id + "." + timestamp + "." + payload;

    // Extract signatures from the header
    String[] signatures = signature.split(" ");

    for (String sig : signatures) {
      if (sig.startsWith("v1,")) {
        String sigValue = sig.substring(3); // Remove "v1," prefix
        if (webhookVerifier.verifyWebhook(signedPayload, sigValue, clerkWebhookSecret)) {
          return true;
        }
      }
    }

    return false;
  }

  // Move User class to static inner class
  public static class User {
    private String id;
    private String name;
    private String email;
    private String[] journalEntries;
    private String[] snippets;

    // Default constructor for Jackson
    public User() {
    }

    // Add getters and setters for proper JSON deserialization
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String[] getJournalEntries() {
      return journalEntries;
    }

    public void setJournalEntries(String[] journalEntries) {
      this.journalEntries = journalEntries;
    }

    public String[] getSnippets() {
      return snippets;
    }

    public void setSnippets(String[] snippets) {
      this.snippets = snippets;
    }

    @Override
    public String toString() {
      return "User{id='" + id + "', name='" + name + "', email='" + email + "'}";
    }
  }

  private Mono<Void> processWebhook(String payload) {

    org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ClerkWebhookController.class);
    logger.info("Received Clerk webhook: {}", payload);

    return Mono.fromCallable(() -> {
      RestClient restClient = RestClient.create();
      ObjectMapper objectMapper = new ObjectMapper();

      try {
        Map<String, Object> event = objectMapper.readValue(payload, Map.class);

        if (event.containsKey("type") && event.get("type").equals("user.created")) {

          logger.info("User created event: {}", event);

          Map<String, Object> data = (Map<String, Object>) event.get("data");
          String userId = (String) data.get("id");
          String firstName = (String) data.get("first_name");
          String lastName = (String) data.get("last_name");
          String email = (String) ((Map<String, Object>) (((ArrayList) data.get("email_addresses")).get(0)))
              .get("email_address");

          Map<String, Object> user = Map.of(
              "id", userId,
              "name", firstName + " " + lastName,
              "email", email,
              "journalEntries", new String[0],
              "snippets", new String[0]);

          // Send http request to user microservice to create user (blocking)
          User responseUser = restClient.post()
              .uri("http://localhost:8080/api/users")
              .body(user)
              .retrieve()
              .body(User.class);

          logger.info("User created in user microservice: {}", responseUser);

        } else if (event.containsKey("type") && event.get("type").equals("user.deleted")) {

          logger.info("User deleted event: {}", event);

          Map<String, Object> data = (Map<String, Object>) event.get("data");
          String userId = (String) data.get("id");

          // Send http request to user microservice to create user (blocking)
          restClient.delete()
            .uri("http://localhost:8080/api/users/" + userId)
            .retrieve()
            .toBodilessEntity();

          logger.info("User deleted in user microservice");

        } else if (event.containsKey("type") && event.get("type").equals("user.deleted")) {

          logger.info("User updated event: {}", event);

          Map<String, Object> data = (Map<String, Object>) event.get("data");
          String userId = (String) data.get("id");
          String firstName = (String) data.get("first_name");
          String lastName = (String) data.get("last_name");
          String email = (String) ((Map<String, Object>) (((ArrayList) data.get("email_addresses")).get(0)))
              .get("email_address");

          Map<String, Object> user = Map.of(
              "id", userId,
              "name", firstName + " " + lastName,
              "email", email,
              "journalEntries", new String[0],
              "snippets", new String[0]);

          // Send http request to user microservice to create user (blocking)
          User responseUser = restClient.put()
              .uri("http://localhost:8080/api/users/" + userId)
              .body(user)
              .retrieve()
              .body(User.class);

          logger.info("User updated in user microservice: {}", responseUser);

        } else {
          logger.warn("Unhandled event type: {}", event.get("type"));
        }

        return null; // Void return
      } catch (JsonProcessingException e) {
        logger.error("Error processing webhook payload", e);
        throw new RuntimeException(e);
      }
    })
        .subscribeOn(Schedulers.boundedElastic()) // Execute on a separate thread pool for blocking operations
        .then();
  }
}
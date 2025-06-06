package com.example.api_gateway.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.clerk.backend_api.helpers.jwks.AuthenticateRequest;
import com.clerk.backend_api.helpers.jwks.AuthenticateRequestOptions;

@Service
public class ClerkJwtService {

  private static final Logger logger = LoggerFactory.getLogger(ClerkJwtService.class);

  // Reference:
  // https://github.com/clerk/clerk-sdk-java?tab=readme-ov-file#request-authentication

  @Value("${clerk.secret-key}")
  private String clerkSecretKey;

  @Value("${clerk.authorized-party:http://localhost:3000}")
  private String authorizedParty;

  public ClerkJwtService(WebClient.Builder webClientBuilder) {
    logger.info("ClerkJwtService initialized");
  }

  /**
   * Validates a Clerk JWT token by verifying its signature against Clerk's JWKS
   */
  public Mono<Boolean> validateToken(ServerHttpRequest request) {
    try {
      logger.debug("Validating token for request to: {}", request.getPath().value());

      // Log headers for debugging (be careful not to log sensitive data in
      // production)
      logger.debug("Authorization header present: {}",
          request.getHeaders().containsKey("Authorization"));

      // Check if secret key is configured
      if (clerkSecretKey == null || clerkSecretKey.equals("your-clerk-secret-key")) {
        logger.error("Clerk secret key not properly configured. Current value: {}",
            clerkSecretKey != null ? "***masked***" : "null");
        return Mono.just(false);
      }

      Boolean isSignedIn = AuthenticateRequest.authenticateRequest(
          request.getHeaders(),
          AuthenticateRequestOptions
              .secretKey(clerkSecretKey)
              .authorizedParty(authorizedParty)
              .build())
          .isSignedIn();

      logger.debug("Token validation result: {} for path: {}", isSignedIn, request.getPath().value());

      return Mono.just(isSignedIn);

    } catch (Exception e) {
      logger.error("Error validating token for request to {}: {}",
          request.getPath().value(), e.getMessage(), e);
      return Mono.just(false);
    }
  }
}
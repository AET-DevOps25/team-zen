package com.example.api_gateway.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.clerk.backend_api.helpers.jwks.AuthenticateRequest;
import com.clerk.backend_api.helpers.jwks.AuthenticateRequestOptions;

@Service
public class ClerkJwtService {

  // Reference: https://github.com/clerk/clerk-sdk-java?tab=readme-ov-file#request-authentication

    @Value("${clerk.secret-key}")
    private String clerkSecretKey;

    public ClerkJwtService(WebClient.Builder webClientBuilder) {
    }

    /**
     * Validates a Clerk JWT token by verifying its signature against Clerk's JWKS
     */
    public Mono<Boolean> validateToken(ServerHttpRequest request) {
        Boolean isSignedIn = AuthenticateRequest.authenticateRequest(request.getHeaders(), AuthenticateRequestOptions
        // TODO: how to handle secret key?
          .secretKey(System.getenv("CLERK_SECRET_KEY"))
          .authorizedParty("https://example.com")
          .build())
          .isSignedIn();
      return Mono.just(isSignedIn);
    }
}
package com.example.journal_microservice.client;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;

import com.example.journal_microservice.dto.SnippetContentsRequest;

import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class LLMRestClient {

    private static final Logger logger = LoggerFactory.getLogger(LLMRestClient.class);
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public LLMRestClient(@Value("${llm.service.url:http://genai-microservice:8082}") String llmServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.baseUrl = llmServiceUrl;
    }

    /**
     * Test connectivity to the LLM service
     */
    public boolean testConnection() {
        try {
            String url = baseUrl + "/api/genai/health";
            String response = restTemplate.getForObject(url, String.class);

            logger.info("Health check response: {}", response);
            return true;
        } catch (Exception e) {
            logger.error("Health check failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Generate only journal summary using the REST LLM service
     * 
     * @param array of snippet's contents
     * @return JSON containing only the summary
     */
    public String generateJournalSummary(List<String> snippetContents) {
        try {
            // Test connection first
            if (!testConnection()) {
                logger.error("Cannot connect to LLM service");
                return null;
            }

            SnippetContentsRequest request = new SnippetContentsRequest(snippetContents);

            // Debug logging
            logger.info("Sending summary request with {} snippet contents", snippetContents.size());
            logger.info("Request object: {}", request);

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Connection", "close");
            headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

            // Create the request entity
            HttpEntity<SnippetContentsRequest> requestEntity = new HttpEntity<>(request, headers);

            String url = baseUrl + "/api/genai/summary";
            logger.info("Sending POST request to: {}", url);

            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            logger.info("Received summary response successfully with status: {}", responseEntity.getStatusCode());
            Map<String, Object> responseBody = responseEntity.getBody();
            return responseBody != null ? (String) responseBody.get("summary") : null;
        } catch (Exception e) {
            logger.error("Error calling LLM REST service for summary: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Generate only journal insights using the REST LLM service
     * 
     * @param array of snippet's contents
     * @return JSON containing analysis and insights
     */
    public Map<String, Object> generateJournalInsights(List<String> snippetContents) {
        try {
            // Test connection first
            if (!testConnection()) {
                logger.error("Cannot connect to LLM service");
                return null;
            }

            SnippetContentsRequest request = new SnippetContentsRequest(snippetContents);

            // Debug logging
            logger.info("Sending insights request with {} snippet contents", snippetContents.size());
            logger.info("Request object: {}", request);

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Connection", "close");
            headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

            // Create the request entity
            HttpEntity<SnippetContentsRequest> requestEntity = new HttpEntity<>(request, headers);

            String url = baseUrl + "/api/genai/insights";
            logger.info("Sending POST request to: {}", url);

            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            logger.info("Received insights response successfully with status: {}", responseEntity.getStatusCode());
            return responseEntity.getBody();
        } catch (Exception e) {
            logger.error("Error calling LLM REST service for insights: {}", e.getMessage(), e);
            return null;
        }
    }
}

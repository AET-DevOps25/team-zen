package com.example.journal_microservice.client;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient; 
import org.springframework.http.MediaType;
import com.example.journal_microservice.dto.SnippetContentsRequest;
import com.example.journal_microservice.dto.SnippetContentsResponse;
import java.util.*;

@Component
public class LLMRestClient {

    private final WebClient webClient;

//    TODO: Use env for the service URL
    public LLMRestClient(WebClient.Builder builder, @Value("${llm.service.url:http://localhost:8082}") String llmServiceUrl) {
        this.webClient = builder
                .baseUrl(llmServiceUrl)
                .build();
    }

    /**
     * Generate journal summary and insights using the REST LLM service
     * @param array of snippet's contents
     * @return JSON containing the summary and insights
     */
    public SnippetContentsResponse generateJournalSummaryAndInsight(List<String> snippetContents) {
        try {
            SnippetContentsRequest request = new SnippetContentsRequest(snippetContents);

            // Using webClient instead of RestClient because of serialization issues
            SnippetContentsResponse response = webClient.post()
                    .uri("/api/genai/summary")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)  
                    .retrieve()
                    .bodyToMono(SnippetContentsResponse.class)
                    .block();  

            return response;

        } catch (Exception e) {
            System.err.println("Error calling LLM REST service: " + e.getMessage());
            return null;
        }
    }
}

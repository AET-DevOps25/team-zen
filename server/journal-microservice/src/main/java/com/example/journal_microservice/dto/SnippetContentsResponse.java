package com.example.journal_microservice.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record SnippetContentsResponse(
        @JsonProperty("summary") String summary,
        @JsonProperty("analysis") String analysis
) {}
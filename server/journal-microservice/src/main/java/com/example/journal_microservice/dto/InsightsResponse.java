package com.example.journal_microservice.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record InsightsResponse(
        @JsonProperty("mood") String mood,
        @JsonProperty("suggestion") String suggestion,
        @JsonProperty("achievement") String achievement,
        @JsonProperty("wellness") String wellness
) {}

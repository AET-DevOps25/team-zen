package com.example.journal_microservice.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.example.journal_microservice.client.LLMRestClient;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.model.Insights;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RequestMapping("/api")
@RestController
public class LLMController {

    @Autowired
    private SnippetRepository snippetRepository;
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    @Autowired
    private LLMRestClient llmRestClient;

    @GetMapping("/summary/{journalId}")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable String journalId) {
        Optional<JournalEntry> optionalJournalEntry = journalEntryRepository.findById(journalId);
        if (optionalJournalEntry.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        JournalEntry journalEntry = optionalJournalEntry.get();

        // Get the snippets associated with the journal entry
        List<Snippet> snippets = snippetRepository.findByJournalEntryId(journalId);
        List<String> snippetsContent = snippets.stream()
                .map(snippet -> snippet.getContent())
                .collect(Collectors.toList());

        System.out.println("Snippets content: " + snippetsContent);
        String summary = llmRestClient.generateJournalSummary(snippetsContent);
        System.out.println("LLM Summary Result: " + summary);
        
        if (summary != null) {
            journalEntry.setSummary(summary);
            journalEntryRepository.save(journalEntry);
        }

        // Prepare summary response
        Map<String, Object> response = new HashMap<>();
        response.put("summary", summary != null ? summary : "No summary available");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/insights/{journalId}")
    public ResponseEntity<Map<String, Object>> getInsights(@PathVariable String journalId) {
        Optional<JournalEntry> optionalJournalEntry = journalEntryRepository.findById(journalId);
        if (optionalJournalEntry.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        JournalEntry journalEntry = optionalJournalEntry.get();

        // Get the snippets associated with the journal entry
        List<Snippet> snippets = snippetRepository.findByJournalEntryId(journalId);
        List<String> snippetsContent = snippets.stream()
                .map(snippet -> snippet.getContent())
                .collect(Collectors.toList());

        System.out.println("Snippets content: " + snippetsContent);
        Map<String, Object> llmResult = llmRestClient.generateJournalInsights(snippetsContent);
        System.out.println("LLM Insights Result: " + llmResult);
        
        if (llmResult != null) {
            // Create and populate Insights object
            Insights insights = new Insights();
            insights.setAnalysis((String) llmResult.get("analysis"));
            
            @SuppressWarnings("unchecked")
            Map<String, String> insightsData = (Map<String, String>) llmResult.get("insights");
            if (insightsData != null) {
                insights.setMoodPattern(insightsData.get("moodPattern"));
                insights.setSuggestion(insightsData.get("suggestion"));
                insights.setAchievement(insightsData.get("achievement"));
                insights.setWellnessTip(insightsData.get("wellnessTip"));
            }
            
            journalEntry.setInsights(insights);
            journalEntryRepository.save(journalEntry);
        }

        // Prepare insights response
        Map<String, Object> response = new HashMap<>();
        response.put("analysis", llmResult != null ? llmResult.get("analysis") : "No analysis available");
        
        // Include insights in the response
        if (llmResult != null && llmResult.get("insights") != null) {
            response.put("insights", llmResult.get("insights"));
        } else {
            response.put("insights", new HashMap<String, String>());
        }

        return ResponseEntity.ok(response);
    }
}
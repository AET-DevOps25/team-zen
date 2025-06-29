package com.example.journal_microservice.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.example.journal_microservice.client.LLMRestClient;
import com.example.journal_microservice.dto.SnippetContentsResponse;
import com.example.journal_microservice.dto.InsightsResponse;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.model.Insights;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RequestMapping("/api/summary")
@RestController
public class LLMController {

    @Autowired
    private SnippetRepository snippetRepository;
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    @Autowired
    private LLMRestClient llmRestClient;

    @GetMapping("/{journalId}")
    public ResponseEntity<Map<String, Object>> getSummaryAndInsights(@PathVariable String journalId) {

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

        SnippetContentsResponse llmResult = llmRestClient.generateJournalSummaryAndInsight(snippetsContent);
        if (llmResult != null) {
            journalEntry.setSummary(llmResult.summary());
            
            // Create and populate Insights object
            Insights insights = new Insights();
            insights.setAnalysis(llmResult.analysis());
            
            if (llmResult.insights() != null) {
                insights.setMoodPattern(llmResult.insights().mood());
                insights.setSuggestion(llmResult.insights().suggestion());
                insights.setAchievement(llmResult.insights().achievement());
                insights.setWellnessTip(llmResult.insights().wellness());
            }
            
            journalEntry.setInsights(insights);
            journalEntryRepository.save(journalEntry);
        }

        // Prepare comprehensive response
        Map<String, Object> response = new HashMap<>();
        response.put("summary", llmResult != null ? llmResult.summary() : "No summary available");
        response.put("analysis", llmResult != null ? llmResult.analysis() : "No analysis available");
        
        // Include insights in the response
        if (llmResult != null && llmResult.insights() != null) {
            Map<String, String> insights = new HashMap<>();
            insights.put("mood", llmResult.insights().mood());
            insights.put("suggestion", llmResult.insights().suggestion());
            insights.put("achievement", llmResult.insights().achievement());
            insights.put("wellness", llmResult.insights().wellness());
            response.put("insights", insights);
        } else {
            response.put("insights", new HashMap<String, String>());
        }

        return ResponseEntity.ok(response);
    }
}
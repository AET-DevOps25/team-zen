package com.example.journal_microservice.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.example.journal_microservice.client.LLMRestClient;
import com.example.journal_microservice.dto.SnippetContentsResponse;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
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
    public ResponseEntity<Map<String, String>> getSummaryAndInsights(@PathVariable String journalId) {

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
            journalEntry.setJournalInsight(llmResult.analysis());
            journalEntryRepository.save(journalEntry);
        }

        // Returning map for debugging purposes
        Map<String, String> response = new HashMap<>();
        response.put("summary", llmResult != null ? llmResult.summary() : "No summary available");
        response.put("insights", llmResult != null ? llmResult.analysis() : "No insights available");

        return ResponseEntity.ok(response);
    }
}
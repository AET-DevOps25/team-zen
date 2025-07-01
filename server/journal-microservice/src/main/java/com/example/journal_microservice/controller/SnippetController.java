package com.example.journal_microservice.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.journal_microservice.dto.wrapper.ApiResponse;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.service.SnippetService;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    @Autowired
    private SnippetService snippetService;

    @GetMapping
    public ResponseEntity<List<Snippet>> getAllSnippets() {
        List<Snippet> snippets = snippetService.getAllSnippets();
        return ResponseEntity.ok(snippets);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserSnippets(@PathVariable("userId") String userId,
            @RequestParam(name = "snippetId", required = false) String snippetId,
            @RequestParam(name = "date", required = false) String dateParam) {

        if (snippetId != null) {
            Snippet snippet = snippetService.getUserSnippetById(userId, snippetId);
            return ResponseEntity.ok(snippet);
        }

        LocalDate date = null;
        if (dateParam != null) {
            try {
                // Handle both simple date format (YYYY-MM-DD) and ISO timestamp formats
                if (dateParam.contains("T")) {
                    // Extract just the date part from ISO timestamp
                    dateParam = dateParam.split("T")[0];
                }
                date = LocalDate.parse(dateParam);
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Invalid date format. Expected YYYY-MM-DD.", null));
            }
        }

        List<Snippet> snippets = snippetService.getUserSnippets(userId, date);
        return ResponseEntity.ok(snippets);
    }

    @PostMapping
    public ResponseEntity<Snippet> createSnippet(@RequestBody Snippet snippet) {
        Snippet savedSnippet = snippetService.createSnippet(snippet);
        return ResponseEntity.ok(savedSnippet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSnippet(@PathVariable String id) {
        snippetService.deleteSnippet(id);
        return ResponseEntity.ok(new ApiResponse<>("Snippet deleted successfully.", id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Snippet>> updateSnippet(@PathVariable("id") String id,
            @RequestBody Snippet updatedSnippet) {
        Snippet snippet = snippetService.updateSnippet(id, updatedSnippet);
        return ResponseEntity.ok(new ApiResponse<>("Snippet updated successfully.", snippet));
    }
}

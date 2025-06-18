package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.SnippetRepository;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.format.annotation.DateTimeFormat;
import com.example.journal_microservice.model.JournalEntry;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.time.ZoneId;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SnippetController.class);

    RestClient restClient = RestClient.create();

    @Autowired
    private SnippetRepository snippetRepository;
    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @GetMapping
    public List<Snippet> getAllSnippets() {
        return snippetRepository.findAll();
    }

    @PostMapping
    public Snippet createSnippet(@RequestBody Snippet snippet) {
        if (snippet.getTimestamp() == null) {
            snippet.setTimestamp(new Date());
        }

        Date snippetDate = getDateOnly(snippet.getTimestamp());

        JournalEntry entry = journalEntryRepository.findByDate(snippetDate);

        if (entry == null) {
            entry = new JournalEntry();
            entry.setDate(snippetDate);
            entry.setSnippetIds(new ArrayList<>());
            entry.setUpdatedAt(snippetDate);
            entry.setUserId(snippet.getUserId());
            entry = journalEntryRepository.save(entry);
        }

        snippet.setJournalEntryId(entry.getId());
        snippet.setUpdatedAt(snippetDate);
        Snippet savedSnippet = snippetRepository.save(snippet);

        entry.getSnippetIds().add(savedSnippet.getId());
        double currentMood = entry.getDailyMood() != null ? entry.getDailyMood() : 0.0;
        entry.setDailyMood((currentMood + snippet.getMood()) / (entry.getSnippetIds().size()));
        journalEntryRepository.save(entry);

        User user = restClient.get()
                .uri("http://localhost:8080/api/users/" + savedSnippet.getUserId())
                .retrieve()
                .body(User.class);
        logger.debug("User retrieved: {}", user);
        String[] currentSnippets = user.getSnippets();
        String[] updatedSnippets = Arrays.copyOf(currentSnippets, currentSnippets.length + 1);
        logger.debug("Current snippets: {}", Arrays.toString(currentSnippets));
        updatedSnippets[currentSnippets.length] = savedSnippet.getId();
        logger.debug("Updated snippets: {}", Arrays.toString(updatedSnippets));
        user.setSnippets(updatedSnippets);
        User newUser = restClient.put()
                .uri("http://localhost:8080/api/users/" + savedSnippet.getUserId())
                .body(user)
                .retrieve().body(User.class);
        logger.debug("Snippet created and user updated: {}", newUser);
        return savedSnippet;
    }

    @DeleteMapping("/{id}")
    public void deleteSnippet(@PathVariable String id) {

        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found with ID: " + id));

        Date snippetDate = getDateOnly(snippet.getTimestamp());

        JournalEntry entry = journalEntryRepository.findByDate(snippetDate);
        if (entry != null) {
            List<String> snippetIds = entry.getSnippetIds();
            entry.setDailyMood((entry.getDailyMood() * snippetIds.size() - snippet.getMood()) / (snippetIds.size() - 1));

            if (snippetIds.size() <= 1) {
                throw new IllegalStateException("Cannot delete the last remaining snippet in a journal entry.");
            }

            snippetIds.remove(snippet.getId());
            journalEntryRepository.save(entry);
        }

        snippetRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void updateSnippet(@PathVariable("id") String id, @RequestBody Snippet updatedSnippet) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found with ID: " + id));

        if (updatedSnippet.getContent() != null) {
            snippet.setContent(updatedSnippet.getContent());
        }

        if (updatedSnippet.getTags() != null) {
            snippet.setTags(updatedSnippet.getTags());
        }

        snippet.setUpdatedAt(new Date());

        snippetRepository.save(snippet);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserSnippets(@PathVariable("userId") String userId,
            @RequestParam(required = false) String snippetId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (snippetId != null) {
            Snippet snippet = snippetRepository.findByUserIdAndId(userId, snippetId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Snippet not found for user: " + userId + " and snippetId: " + snippetId));
            return ResponseEntity.ok(snippet);
        }
        List<Snippet> snippets = snippetRepository.findByUserId(userId);
        if (snippets.isEmpty()) {
            throw new IllegalArgumentException("No snippets found for user: " + userId);
        }

        if (date != null) {
            snippets = snippets.stream()
                    .filter(s -> s.getUpdatedAt() != null &&
                            s.getUpdatedAt().toInstant()
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDate()
                                    .isEqual(date))
                    .toList();
        }
        return ResponseEntity.ok(snippets);
    }

    private Date getDateOnly(Date dateTime) {
        return Date.from(dateTime.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant());
    }
}

package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Date;
import java.time.ZoneId;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import com.example.journal_microservice.model.Snippet;
import java.util.*;
import com.example.journal_microservice.model.User;

@RestController
@RequestMapping("/api/journalEntry")
public class JournalEntryController {

    RestClient restClient = RestClient.create();

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private SnippetRepository snippetRepository;

    @GetMapping
    public List<JournalEntry> getAllSnippets() {
        return journalEntryRepository.findAll();
    }

    @PostMapping
    public JournalEntry createJournalEntry(@RequestBody JournalEntry journalEntry) {
        JournalEntry newEntry = journalEntryRepository.save(journalEntry);
        // call user microservice to update the user's journal list
        if (newEntry != null) {
            User user = restClient.get()
                    .uri("http://localhost:8080/api/users/" + newEntry.getUserId())
                    .retrieve()
                    .body(User.class);
            String[] currentEntries = user.getJournalEntries();
            String[] updatedEntries = Arrays.copyOf(currentEntries, currentEntries.length + 1);
            updatedEntries[currentEntries.length] = newEntry.getId();
            user.setJournalEntries(updatedEntries);
            restClient.put()
                    .uri("http://localhost:8080/api/users/" + newEntry.getUserId())
                    .body(user)
                    .retrieve();
        }
        return newEntry;
    }

    @DeleteMapping("/{id}")
    public void deleteJournalEntry(@PathVariable("id") String id) {
        try {
            JournalEntry journalEntryToDelete = journalEntryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Journal entry not found"));
            List<String> snippetIds = journalEntryToDelete.getSnippetIds();
            if (snippetIds != null) {
                for (String snippetId : snippetIds) {
                    snippetRepository.deleteById(snippetId);
                }
            }
            journalEntryRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw new RuntimeException("Journal entry not found or something went wrong");
        }

    }

    @PutMapping("/{id}")
    public void updateJournalEntry(@PathVariable("id") String id, @RequestBody JournalEntry newJournalEntry) {

        JournalEntry journalEntry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal not found with ID: " + id));

        if (newJournalEntry.getTitle() != null) {
            journalEntry.setTitle(newJournalEntry.getTitle());
        }

        if (newJournalEntry.getSummary() != null) {
            journalEntry.setSummary(newJournalEntry.getSummary());
        }

        if (newJournalEntry.getDailyMood() != null) {
            journalEntry.setDailyMood(newJournalEntry.getDailyMood());
        }

        if (newJournalEntry.getJournalInsight() != null) {
            journalEntry.setJournalInsight(newJournalEntry.getJournalInsight());
        }
        journalEntry.setUpdatedAt(new Date());

        journalEntryRepository.save(journalEntry);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserJournals(@PathVariable String userId,
            @RequestParam(required = false) String journalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (journalId != null) {
            JournalEntry journalEntry = journalEntryRepository.findByUserIdAndId(userId, journalId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Journal Entry not found for user: " + userId + " and journalId: " + journalId));
            return ResponseEntity.ok(journalEntry);
        }
        List<JournalEntry> journalEntries = journalEntryRepository.findByUserId(userId);
        if (journalEntries.isEmpty()) {
            throw new IllegalArgumentException("No journalEntries found for user: " + userId);
        }

        if (date != null) {
            journalEntries = journalEntries.stream()
                    .filter(j -> j.getUpdatedAt() != null &&
                            j.getUpdatedAt().toInstant()
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDate()
                                    .isEqual(date))
                    .toList();
        }
        return ResponseEntity.ok(journalEntries);
    }


    @GetMapping("/{userId}/statistics")
    public Map<String, Object> getStatistics(@PathVariable String userId) {
        List<JournalEntry> userJournalEntries = journalEntryRepository.findByUserId(userId);
        List<Snippet> userSnippets = snippetRepository.findByUserId(userId);

        StringBuilder wholeUserContent = new StringBuilder();
        double sumRating = 0.0;

        for (Snippet userSnippet : userSnippets) {
            if (userSnippet.getContent() != null) {
                wholeUserContent.append(userSnippet.getContent().replaceAll("\\s+", "")); // remove all whitespaces and
                                                                                          // non-visible characters
            }
        }

        for(JournalEntry userJournalEntry: userJournalEntries){
            sumRating += userJournalEntry.getDailyMood() != null ? userJournalEntry.getDailyMood() : 0.0;
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJournals", userJournalEntries.size());
        stats.put("totalWords", wholeUserContent.length());
        stats.put("avgMood", userJournalEntries.isEmpty() ? 0.0 : sumRating / userJournalEntries.size());

        return stats;
    }
}

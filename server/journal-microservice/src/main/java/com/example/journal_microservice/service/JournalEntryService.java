package com.example.journal_microservice.service;

import com.example.journal_microservice.exception.JournalEntryNotFoundException;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class JournalEntryService {

    private static final Logger logger = LoggerFactory.getLogger(JournalEntryService.class);

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private UserService userService;

    public List<JournalEntry> getAllJournalEntries() {
        return journalEntryRepository.findAll();
    }

    public JournalEntry createJournalEntry(JournalEntry journalEntry) {
        JournalEntry newEntry = journalEntryRepository.save(journalEntry);
        
        if (newEntry != null && newEntry.getUserId() != null) {
            try {
                userService.addJournalEntryToUser(newEntry.getUserId(), newEntry.getId());
            } catch (Exception e) {
                logger.error("Failed to update user with new journal entry, but journal entry was created", e);
                // Journal entry is already created, so we don't rollback
            }
        }
        
        return newEntry;
    }

    public void deleteJournalEntry(String id) {
        JournalEntry journalEntryToDelete = journalEntryRepository.findById(id)
                .orElseThrow(() -> new JournalEntryNotFoundException("Journal entry not found with ID: " + id));
        
        List<String> snippetIds = journalEntryToDelete.getSnippetIds();
        if (snippetIds != null) {
            for (String snippetId : snippetIds) {
                try {
                    snippetRepository.deleteById(snippetId);
                } catch (Exception e) {
                    logger.warn("Failed to delete snippet with ID: {}", snippetId, e);
                }
            }
        }
        
        journalEntryRepository.deleteById(id);
    }

    public JournalEntry updateJournalEntry(String id, JournalEntry updatedJournalEntry) {
        JournalEntry journalEntry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new JournalEntryNotFoundException("Journal entry not found with ID: " + id));

        if (updatedJournalEntry.getTitle() != null) {
            journalEntry.setTitle(updatedJournalEntry.getTitle());
        }

        if (updatedJournalEntry.getSummary() != null) {
            journalEntry.setSummary(updatedJournalEntry.getSummary());
        }

        if (updatedJournalEntry.getDailyMood() != null) {
            journalEntry.setDailyMood(updatedJournalEntry.getDailyMood());
        }

        if (updatedJournalEntry.getJournalInsight() != null) {
            journalEntry.setJournalInsight(updatedJournalEntry.getJournalInsight());
        }
        
        journalEntry.setUpdatedAt(new Date());
        return journalEntryRepository.save(journalEntry);
    }

    public JournalEntry getUserJournalById(String userId, String journalId) {
        return journalEntryRepository.findByUserIdAndId(userId, journalId)
                .orElseThrow(() -> new JournalEntryNotFoundException(
                        "Journal Entry not found for user: " + userId + " and journalId: " + journalId));
    }

    public List<JournalEntry> getUserJournals(String userId, LocalDate date) {
        List<JournalEntry> journalEntries = journalEntryRepository.findByUserId(userId);
        
        if (journalEntries.isEmpty()) {
            throw new JournalEntryNotFoundException("No journal entries found for user: " + userId);
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
        
        return journalEntries;
    }

    public Map<String, Object> getUserStatistics(String userId) {
        List<JournalEntry> userJournalEntries = journalEntryRepository.findByUserId(userId);
        List<Snippet> userSnippets = snippetRepository.findByUserId(userId);

        StringBuilder wholeUserContent = new StringBuilder();
        double sumRating = 0.0;

        for (Snippet userSnippet : userSnippets) {
            if (userSnippet.getContent() != null) {
                wholeUserContent.append(userSnippet.getContent().replaceAll("\\s+", ""));
            }
        }

        for (JournalEntry userJournalEntry : userJournalEntries) {
            sumRating += userJournalEntry.getDailyMood() != null ? userJournalEntry.getDailyMood() : 0.0;
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJournals", userJournalEntries.size());
        stats.put("totalWords", wholeUserContent.length());
        stats.put("avgMood", userJournalEntries.isEmpty() ? 0.0 : sumRating / userJournalEntries.size());

        return stats;
    }
}

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

        if (updatedJournalEntry.getInsights() != null) {
            journalEntry.setInsights(updatedJournalEntry.getInsights());
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
                    .filter(j -> j.getDate() != null &&
                            j.getDate().toInstant()
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

        // Basic statistics calculation
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

        // Calculate weekly statistics
        Map<String, Object> weeklyStats = calculateWeeklyStatistics(userJournalEntries);
        
        // Calculate streak
        int currentStreak = calculateJournalStreak(userJournalEntries);

        // Build comprehensive statistics
        Map<String, Object> stats = new HashMap<>();
        
        // Overall statistics
        stats.put("totalJournals", userJournalEntries.size());
        stats.put("totalWords", wholeUserContent.length());
        stats.put("avgMood", userJournalEntries.isEmpty() ? 0.0 : sumRating / userJournalEntries.size());
        
        // Weekly statistics
        stats.put("weeklyJournalCount", weeklyStats.get("journalCount"));
        stats.put("weeklyAvgMood", weeklyStats.get("avgMood"));
        stats.put("weeklyTarget", 7); // Target: one journal per day
        
        // Streak statistics
        stats.put("currentStreak", currentStreak);

        return stats;
    }

    /**
     * Calculates weekly statistics for the current week
     * @param journalEntries List of user's journal entries
     * @return Map containing weekly statistics
     */
    private Map<String, Object> calculateWeeklyStatistics(List<JournalEntry> journalEntries) {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<JournalEntry> weeklyEntries = journalEntries.stream()
                .filter(entry -> entry.getUpdatedAt() != null)
                .filter(entry -> {
                    LocalDate entryDate = entry.getUpdatedAt().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return !entryDate.isBefore(startOfWeek) && !entryDate.isAfter(endOfWeek);
                })
                .collect(java.util.stream.Collectors.toList());

        Map<String, Object> weeklyStats = new HashMap<>();
        weeklyStats.put("journalCount", weeklyEntries.size());
        
        if (weeklyEntries.isEmpty()) {
            weeklyStats.put("avgMood", 0.0);
        } else {
            double weeklyMoodSum = weeklyEntries.stream()
                    .mapToDouble(entry -> entry.getDailyMood() != null ? entry.getDailyMood() : 0.0)
                    .sum();
            weeklyStats.put("avgMood", weeklyMoodSum / weeklyEntries.size());
        }

        return weeklyStats;
    }

    /**
     * Efficiently calculates the current journal streak
     * A streak is defined as consecutive days with at least one journal entry
     * @param journalEntries List of user's journal entries
     * @return Current streak count in days
     */
    private int calculateJournalStreak(List<JournalEntry> journalEntries) {
        if (journalEntries.isEmpty()) {
            return 0;
        }

        // Convert journal entries to unique dates and sort in descending order
        Set<LocalDate> journalDates = journalEntries.stream()
                .filter(entry -> entry.getUpdatedAt() != null)
                .map(entry -> entry.getUpdatedAt().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate())
                .collect(java.util.stream.Collectors.toSet());

        if (journalDates.isEmpty()) {
            return 0;
        }

        List<LocalDate> sortedDates = journalDates.stream()
                .sorted(java.util.Collections.reverseOrder())
                .collect(java.util.stream.Collectors.toList());

        LocalDate today = LocalDate.now();
        LocalDate mostRecentDate = sortedDates.get(0);

        // If the most recent entry is not today or yesterday, streak is 0
        if (mostRecentDate.isBefore(today.minusDays(1))) {
            return 0;
        }

        int streak = 0;
        LocalDate currentDate = today;

        // If there's no journal today, start checking from yesterday
        if (!journalDates.contains(today)) {
            currentDate = today.minusDays(1);
        }

        // Count consecutive days with journal entries
        for (LocalDate date : sortedDates) {
            if (date.equals(currentDate)) {
                streak++;
                currentDate = currentDate.minusDays(1);
            } else if (date.isBefore(currentDate)) {
                // Gap found, streak ends
                break;
            }
        }

        return streak;
    }
}

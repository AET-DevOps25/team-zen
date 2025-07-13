package com.example.journal_microservice.testutil;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import org.junit.jupiter.api.Assertions;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

/**
 * Custom assertion utilities for testing Journal microservice
 */
public class TestAssertions {

    public static void assertJournalEntryEquals(JournalEntry expected, JournalEntry actual) {
        Assertions.assertEquals(expected.getTitle(), actual.getTitle(), "Title should match");
        Assertions.assertEquals(expected.getSummary(), actual.getSummary(), "Summary should match");
        Assertions.assertEquals(expected.getUserId(), actual.getUserId(), "User ID should match");
        Assertions.assertEquals(expected.getDailyMood(), actual.getDailyMood(), "Daily mood should match");
        
        if (expected.getSnippetIds() != null && actual.getSnippetIds() != null) {
            Assertions.assertEquals(expected.getSnippetIds().size(), actual.getSnippetIds().size(), 
                "Snippet IDs count should match");
        }
    }

    public static void assertSnippetEquals(Snippet expected, Snippet actual) {
        Assertions.assertEquals(expected.getContent(), actual.getContent(), "Content should match");
        Assertions.assertEquals(expected.getUserId(), actual.getUserId(), "User ID should match");
        Assertions.assertEquals(expected.getJournalEntryId(), actual.getJournalEntryId(), 
            "Journal Entry ID should match");
        Assertions.assertEquals(expected.getMood(), actual.getMood(), "Mood should match");
    }

    public static void assertDateEquals(LocalDate expected, Date actual) {
        LocalDate actualDate = actual.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Assertions.assertEquals(expected, actualDate, "Dates should match");
    }

    public static void assertListNotEmpty(List<?> list, String message) {
        Assertions.assertNotNull(list, message + " - List should not be null");
        Assertions.assertFalse(list.isEmpty(), message + " - List should not be empty");
    }

    public static void assertValidJournalEntry(JournalEntry entry) {
        Assertions.assertNotNull(entry, "Journal entry should not be null");
        Assertions.assertNotNull(entry.getId(), "Journal entry ID should not be null");
        Assertions.assertNotNull(entry.getTitle(), "Journal entry title should not be null");
        Assertions.assertNotNull(entry.getUserId(), "Journal entry user ID should not be null");
        Assertions.assertNotNull(entry.getDate(), "Journal entry date should not be null");
        Assertions.assertNotNull(entry.getUpdatedAt(), "Journal entry updatedAt should not be null");
    }

    public static void assertValidSnippet(Snippet snippet) {
        Assertions.assertNotNull(snippet, "Snippet should not be null");
        Assertions.assertNotNull(snippet.getId(), "Snippet ID should not be null");
        Assertions.assertNotNull(snippet.getContent(), "Snippet content should not be null");
        Assertions.assertNotNull(snippet.getUserId(), "Snippet user ID should not be null");
        Assertions.assertNotNull(snippet.getTimestamp(), "Snippet timestamp should not be null");
    }

    public static void assertStatisticsValid(java.util.Map<String, Object> stats) {
        Assertions.assertNotNull(stats, "Statistics should not be null");
        Assertions.assertTrue(stats.containsKey("totalEntries"), "Should contain totalEntries");
        Assertions.assertTrue(stats.containsKey("averageMood"), "Should contain averageMood");
        Assertions.assertTrue(stats.containsKey("entriesThisWeek"), "Should contain entriesThisWeek");
        Assertions.assertTrue(stats.containsKey("entriesThisMonth"), "Should contain entriesThisMonth");
        
        // Validate data types
        Assertions.assertTrue(stats.get("totalEntries") instanceof Integer, 
            "totalEntries should be Integer");
        Assertions.assertTrue(stats.get("averageMood") instanceof Double, 
            "averageMood should be Double");
        Assertions.assertTrue(stats.get("entriesThisWeek") instanceof Integer, 
            "entriesThisWeek should be Integer");
        Assertions.assertTrue(stats.get("entriesThisMonth") instanceof Integer, 
            "entriesThisMonth should be Integer");
    }

    public static void assertMoodInValidRange(Double mood) {
        if (mood != null) {
            Assertions.assertTrue(mood >= 0.0 && mood <= 5.0, 
                "Mood should be between 0.0 and 5.0, but was: " + mood);
        }
    }
}

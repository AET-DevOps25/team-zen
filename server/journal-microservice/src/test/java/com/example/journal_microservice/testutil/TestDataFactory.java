package com.example.journal_microservice.testutil;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.model.Insights;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.ZoneId;

public class TestDataFactory {

    public static JournalEntry createSampleJournalEntry() {
        return createJournalEntry("test-user-1", "Sample Title", "Sample summary");
    }

    public static JournalEntry createJournalEntry(String userId, String title, String summary) {
        JournalEntry entry = new JournalEntry();
        entry.setUserId(userId);
        entry.setTitle(title);
        entry.setSummary(summary);
        entry.setDate(new Date());
        entry.setDailyMood(3.5);
        entry.setSnippetIds(new ArrayList<>());
        entry.setUpdatedAt(new Date());
        
        Insights insights = new Insights();
        insights.setAnalysis("Generated analysis for test");
        insights.setMoodPattern("Positive mood pattern");
        insights.setSuggestion("Continue with current activities");
        insights.setAchievement("Daily journaling streak");
        insights.setWellnessTip("Remember to take breaks");
        entry.setInsights(insights);
        
        return entry;
    }

    public static JournalEntry createJournalEntryWithSpecificDate(String userId, LocalDate date) {
        JournalEntry entry = createJournalEntry(userId, "Daily Entry", "Test entry for " + date);
        entry.setDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));
        return entry;
    }

    public static Snippet createSampleSnippet() {
        return createSnippet("test-user-1", "Sample snippet content", "test-journal-1");
    }

    public static Snippet createSnippet(String userId, String content, String journalEntryId) {
        Snippet snippet = new Snippet();
        snippet.setUserId(userId);
        snippet.setContent(content);
        snippet.setJournalEntryId(journalEntryId);
        snippet.setTimestamp(new Date());
        snippet.setMood(3.0);
        snippet.setTags(List.of("test", "sample"));
        snippet.setUpdatedAt(new Date());
        return snippet;
    }

    public static List<JournalEntry> createMultipleJournalEntries(String userId, int count) {
        List<JournalEntry> entries = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            entries.add(createJournalEntry(userId, "Entry " + (i + 1), "Summary " + (i + 1)));
        }
        return entries;
    }

    public static List<Snippet> createMultipleSnippets(String userId, String journalEntryId, int count) {
        List<Snippet> snippets = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            snippets.add(createSnippet(userId, "Content " + (i + 1), journalEntryId));
        }
        return snippets;
    }
}

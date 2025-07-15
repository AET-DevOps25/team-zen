package com.example.journal_microservice.integration;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.service.JournalEntryService;
import com.example.journal_microservice.service.UserService;
import com.example.journal_microservice.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

@SpringBootTest
@Testcontainers
@DisplayName("JournalEntry Integration Tests")
class JournalEntryIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.2");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.mongodb.database", () -> "testdb");
    }

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @MockitoBean
    private UserService userService;

    private final String userId = "test-user-integration";

    @BeforeEach
    void setUp() {
        // Clean up database before each test
        journalEntryRepository.deleteAll();
        
        // Mock user service calls
        doNothing().when(userService).addJournalEntryToUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should create and retrieve journal entry from database")
    void shouldCreateAndRetrieveJournalEntry() {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Integration Test", "Test summary");

        // When
        JournalEntry savedEntry = journalEntryService.createJournalEntry(entry);

        // Then
        assertNotNull(savedEntry.getId());
        assertEquals("Integration Test", savedEntry.getTitle());
        assertEquals("Test summary", savedEntry.getSummary());
        assertEquals(userId, savedEntry.getUserId());

        // Verify it's in the database
        JournalEntry retrievedEntry = journalEntryService.getUserJournalById(userId, savedEntry.getId());
        assertEquals(savedEntry.getId(), retrievedEntry.getId());
        assertEquals(savedEntry.getTitle(), retrievedEntry.getTitle());
    }

    @Test
    @DisplayName("Should update journal entry in database")
    void shouldUpdateJournalEntryInDatabase() {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Original Title", "Original summary");
        JournalEntry savedEntry = journalEntryService.createJournalEntry(entry);

        // When
        JournalEntry updateData = new JournalEntry();
        updateData.setTitle("Updated Title");
        updateData.setSummary("Updated summary");
        updateData.setDailyMood(3.0);

        JournalEntry updatedEntry = journalEntryService.updateJournalEntry(savedEntry.getId(), updateData);

        // Then
        assertEquals("Updated Title", updatedEntry.getTitle());
        assertEquals("Updated summary", updatedEntry.getSummary());
        assertEquals(3.0, updatedEntry.getDailyMood());
        assertNotNull(updatedEntry.getUpdatedAt());

        // Verify the update persisted
        JournalEntry retrievedEntry = journalEntryService.getUserJournalById(userId, savedEntry.getId());
        assertEquals("Updated Title", retrievedEntry.getTitle());
        assertEquals("Updated summary", retrievedEntry.getSummary());
        assertEquals(3.0, retrievedEntry.getDailyMood());
    }

    @Test
    @DisplayName("Should delete journal entry from database")
    void shouldDeleteJournalEntryFromDatabase() {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "To Delete", "Will be deleted");
        JournalEntry savedEntry = journalEntryService.createJournalEntry(entry);

        // When
        journalEntryService.deleteJournalEntry(savedEntry.getId());

        // Then
        assertFalse(journalEntryRepository.findById(savedEntry.getId()).isPresent());
    }

    @Test
    @DisplayName("Should retrieve multiple journal entries for user")
    void shouldRetrieveMultipleJournalEntriesForUser() {
        // Given
        List<JournalEntry> entries = TestDataFactory.createMultipleJournalEntries(userId, 5);
        for (JournalEntry entry : entries) {
            journalEntryService.createJournalEntry(entry);
        }

        // When
        List<JournalEntry> retrievedEntries = journalEntryService.getUserJournals(userId, null);

        // Then
        assertEquals(5, retrievedEntries.size());
        for (JournalEntry entry : retrievedEntries) {
            assertEquals(userId, entry.getUserId());
        }
    }

    @Test
    @DisplayName("Should retrieve journal entries by date")
    void shouldRetrieveJournalEntriesByDate() {
        // Given
        LocalDate specificDate = LocalDate.of(2024, 1, 15);
        JournalEntry entryForDate = TestDataFactory.createJournalEntryWithSpecificDate(userId, specificDate);
        JournalEntry entryForOtherDate = TestDataFactory.createJournalEntryWithSpecificDate(userId, specificDate.plusDays(1));

        journalEntryService.createJournalEntry(entryForDate);
        journalEntryService.createJournalEntry(entryForOtherDate);

        // When
        List<JournalEntry> entriesForSpecificDate = journalEntryService.getUserJournals(userId, specificDate);

        // Then
        assertEquals(1, entriesForSpecificDate.size());
        assertEquals(entryForDate.getTitle(), entriesForSpecificDate.get(0).getTitle());
    }

    @Test
    @DisplayName("Should calculate user statistics correctly")
    void shouldCalculateUserStatisticsCorrectly() {
        // Given
        List<JournalEntry> entries = TestDataFactory.createMultipleJournalEntries(userId, 3);
        entries.get(0).setDailyMood( 1.0);
        entries.get(1).setDailyMood(2.0);
        entries.get(2).setDailyMood(3.0);

        for (JournalEntry entry : entries) {
            journalEntryService.createJournalEntry(entry);
        }

        // When
        Map<String, Object> statistics = journalEntryService.getUserStatistics(userId);

        // Then
        assertEquals(3, statistics.get("totalJournals"));
        assertEquals(2.0, statistics.get("avgMood"));
        assertTrue(statistics.containsKey("weeklyJournalCount"));
        assertTrue(statistics.containsKey("currentStreak"));
    }

    @Test
    @DisplayName("Should handle MongoDB transactions correctly")
    void shouldHandleMongoDBTransactionsCorrectly() {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Transaction Test", "Test transaction");

        // When
        JournalEntry savedEntry = journalEntryService.createJournalEntry(entry);

        // Then
        assertNotNull(savedEntry);
        assertTrue(journalEntryRepository.findById(savedEntry.getId()).isPresent());

        // Verify we can perform operations in sequence
        JournalEntry updateData = new JournalEntry();
        updateData.setTitle("Updated in Transaction");
        JournalEntry updatedEntry = journalEntryService.updateJournalEntry(savedEntry.getId(), updateData);

        assertEquals("Updated in Transaction", updatedEntry.getTitle());
    }

    @Test
    @DisplayName("Should maintain data consistency across operations")
    void shouldMaintainDataConsistencyAcrossOperations() {
        // Given
        int initialCount = (int) journalEntryRepository.count();

        // When - Create multiple entries
        for (int i = 0; i < 3; i++) {
            JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Entry " + i, "Summary " + i);
            journalEntryService.createJournalEntry(entry);
        }

        // Then
        assertEquals(initialCount + 3, journalEntryRepository.count());

        // When - Delete one entry
        List<JournalEntry> allEntries = journalEntryRepository.findByUserId(userId);
        journalEntryService.deleteJournalEntry(allEntries.get(0).getId());

        // Then
        assertEquals(initialCount + 2, journalEntryRepository.count());
        assertEquals(2, journalEntryRepository.findByUserId(userId).size());
    }
}

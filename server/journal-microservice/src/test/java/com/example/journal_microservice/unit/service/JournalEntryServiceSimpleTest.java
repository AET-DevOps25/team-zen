package com.example.journal_microservice.unit.service;

import com.example.journal_microservice.exception.JournalEntryNotFoundException;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import com.example.journal_microservice.service.JournalEntryService;
import com.example.journal_microservice.service.UserService;
import com.example.journal_microservice.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JournalEntryService Unit Tests - Simplified")
class JournalEntryServiceSimpleTest {

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @Mock
    private SnippetRepository snippetRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private JournalEntryService journalEntryService;

    private JournalEntry testEntry;
    private final String userId = "test-user-1";
    private final String entryId = "test-entry-1";

    @BeforeEach
    void setUp() {
        testEntry = TestDataFactory.createSampleJournalEntry();
        testEntry.setId(entryId);
    }

    @Test
    @DisplayName("Should create journal entry successfully")
    void shouldCreateJournalEntry() {
        // Given
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(testEntry);
        doNothing().when(userService).addJournalEntryToUser(anyString(), anyString());

        // When
        JournalEntry result = journalEntryService.createJournalEntry(testEntry);

        // Then
        assertNotNull(result);
        assertEquals(testEntry.getId(), result.getId());
        assertEquals(testEntry.getTitle(), result.getTitle());
        verify(journalEntryRepository).save(testEntry);
        verify(userService).addJournalEntryToUser(testEntry.getUserId(), testEntry.getId());
    }

    @Test
    @DisplayName("Should delete journal entry successfully")
    void shouldDeleteJournalEntry() {
        // Given
        List<String> snippetIds = List.of("snippet1", "snippet2");
        testEntry.setSnippetIds(snippetIds);
        when(journalEntryRepository.findById(entryId)).thenReturn(Optional.of(testEntry));
        doNothing().when(journalEntryRepository).deleteById(entryId);

        // When
        journalEntryService.deleteJournalEntry(entryId);

        // Then
        verify(journalEntryRepository).findById(entryId);
        verify(journalEntryRepository).deleteById(entryId);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent journal entry")
    void shouldThrowExceptionWhenDeletingNonExistentEntry() {
        // Given
        when(journalEntryRepository.findById(entryId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(JournalEntryNotFoundException.class, 
                () -> journalEntryService.deleteJournalEntry(entryId));
        verify(journalEntryRepository).findById(entryId);
        verify(journalEntryRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Should update journal entry successfully")
    void shouldUpdateJournalEntry() {
        // Given
        JournalEntry updatedEntry = TestDataFactory.createJournalEntry(userId, "Updated Title", "Updated Summary");
        updatedEntry.setId(entryId);
        when(journalEntryRepository.findById(entryId)).thenReturn(Optional.of(testEntry));
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(testEntry);

        // When
        JournalEntry result = journalEntryService.updateJournalEntry(entryId, updatedEntry);

        // Then
        assertNotNull(result);
        verify(journalEntryRepository).findById(entryId);
        verify(journalEntryRepository).save(any(JournalEntry.class));
    }

    @Test
    @DisplayName("Should get user journals by user ID")
    void shouldGetUserJournalsByUserId() {
        // Given
        List<JournalEntry> expectedEntries = TestDataFactory.createMultipleJournalEntries(userId, 3);
        when(journalEntryRepository.findByUserId(userId)).thenReturn(expectedEntries);

        // When
        List<JournalEntry> result = journalEntryService.getUserJournals(userId, null);

        // Then
        assertEquals(3, result.size());
        assertEquals(expectedEntries, result);
        verify(journalEntryRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("Should throw exception when no journals found for user")
    void shouldThrowExceptionWhenNoJournalsFoundForUser() {
        // Given
        when(journalEntryRepository.findByUserId(userId)).thenReturn(new ArrayList<>());

        // When & Then
        assertThrows(JournalEntryNotFoundException.class, 
                () -> journalEntryService.getUserJournals(userId, null));
        verify(journalEntryRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("Should get user journal by ID")
    void shouldGetUserJournalById() {
        // Given
        when(journalEntryRepository.findByUserIdAndId(userId, entryId))
                .thenReturn(Optional.of(testEntry));

        // When
        JournalEntry result = journalEntryService.getUserJournalById(userId, entryId);

        // Then
        assertNotNull(result);
        assertEquals(testEntry, result);
        verify(journalEntryRepository).findByUserIdAndId(userId, entryId);
    }

    @Test
    @DisplayName("Should get user statistics")
    void shouldGetUserStatistics() {
        // Given
        List<JournalEntry> entries = TestDataFactory.createMultipleJournalEntries(userId, 3);
        entries.forEach(entry -> entry.setDailyMood(8.0));
        when(journalEntryRepository.findByUserId(userId)).thenReturn(entries);
        when(snippetRepository.findByUserId(userId)).thenReturn(new ArrayList<>());

        // When
        Map<String, Object> statistics = journalEntryService.getUserStatistics(userId);

        // Then
        assertNotNull(statistics);
        assertTrue(statistics.containsKey("totalJournals"));
        assertTrue(statistics.containsKey("avgMood"));
        assertTrue(statistics.containsKey("weeklyJournalCount"));
        assertTrue(statistics.containsKey("currentStreak"));
        verify(journalEntryRepository).findByUserId(userId);
        verify(snippetRepository).findByUserId(userId);
    }
}

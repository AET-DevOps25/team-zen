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

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JournalEntryService Unit Tests")
class JournalEntryServiceTest {

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
  @DisplayName("Should create journal entry even when user service fails")
  void shouldCreateJournalEntryWhenUserServiceFails() {
    // Given
    when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(testEntry);
    doThrow(new RuntimeException("User service error")).when(userService)
        .addJournalEntryToUser(anyString(), anyString());

    // When
    JournalEntry result = journalEntryService.createJournalEntry(testEntry);

    // Then
    assertNotNull(result);
    assertEquals(testEntry.getId(), result.getId());
    verify(journalEntryRepository).save(testEntry);
  }

  @Test
  @DisplayName("Should delete journal entry successfully")
  void shouldDeleteJournalEntry() {
    // Given
    List<String> snippetIds = List.of("snippet1", "snippet2");
    testEntry.setSnippetIds(snippetIds);
    when(journalEntryRepository.findById(entryId)).thenReturn(Optional.of(testEntry));
    doNothing().when(snippetRepository).deleteById(anyString());
    doNothing().when(journalEntryRepository).deleteById(entryId);

    // When
    journalEntryService.deleteJournalEntry(entryId);

    // Then
    verify(journalEntryRepository).findById(entryId);
    verify(snippetRepository, times(2)).deleteById(anyString());
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
    when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(updatedEntry);

    // When
    JournalEntry result = journalEntryService.updateJournalEntry(entryId, updatedEntry);

    // Then
    assertNotNull(result);
    assertEquals("Updated Title", result.getTitle());
    assertEquals("Updated Summary", result.getSummary());
    verify(journalEntryRepository).findById(entryId);
    verify(journalEntryRepository).save(any(JournalEntry.class));
  }

  @Test
  @DisplayName("Should throw exception when updating non-existent journal entry")
  void shouldThrowExceptionWhenUpdatingNonExistentEntry() {
    // Given
    when(journalEntryRepository.findById(entryId)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(JournalEntryNotFoundException.class,
        () -> journalEntryService.updateJournalEntry(entryId, testEntry));
    verify(journalEntryRepository).findById(entryId);
    verify(journalEntryRepository, never()).save(any());
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
  @DisplayName("Should get user journals by user ID and date")
  void shouldGetUserJournalsByUserIdAndDate() {
    // Given
    LocalDate testDate = LocalDate.now();
    
    // Create test entry with the specific date
    JournalEntry entryWithDate = TestDataFactory.createSampleJournalEntry();
    entryWithDate.setId("entry-with-date");
    entryWithDate.setDate(Date.from(testDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
    
    // Create entry with different date
    JournalEntry entryWithOtherDate = TestDataFactory.createSampleJournalEntry();
    entryWithOtherDate.setId("entry-other-date");
    entryWithOtherDate.setDate(Date.from(testDate.minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()));
    
    List<JournalEntry> allEntries = List.of(entryWithDate, entryWithOtherDate);
    when(journalEntryRepository.findByUserId(userId)).thenReturn(allEntries);

    // When
    List<JournalEntry> result = journalEntryService.getUserJournals(userId, testDate);

    // Then
    assertEquals(1, result.size());
    assertEquals(entryWithDate.getId(), result.get(0).getId());
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
  @DisplayName("Should throw exception when getting non-existent user journal by ID")
  void shouldThrowExceptionWhenGettingNonExistentUserJournalById() {
    // Given
    when(journalEntryRepository.findByUserIdAndId(userId, entryId))
        .thenReturn(Optional.empty());

    // When & Then
    assertThrows(JournalEntryNotFoundException.class,
        () -> journalEntryService.getUserJournalById(userId, entryId));
    verify(journalEntryRepository).findByUserIdAndId(userId, entryId);
  }

  @Test
  @DisplayName("Should get user statistics")
  void shouldGetUserStatistics() {
    // Given
    List<JournalEntry> entries = TestDataFactory.createMultipleJournalEntries(userId, 5);
    entries.forEach(entry -> entry.setDailyMood(8.0));
    when(journalEntryRepository.findByUserId(userId)).thenReturn(entries);
    when(snippetRepository.findByUserId(userId)).thenReturn(new ArrayList<>());

    // When
    Map<String, Object> statistics = journalEntryService.getUserStatistics(userId);

    // Then
    assertNotNull(statistics);
    assertEquals(5, statistics.get("totalJournals"));
    assertEquals(8.0, statistics.get("avgMood"));
    assertTrue(statistics.containsKey("weeklyJournalCount"));
    assertTrue(statistics.containsKey("currentStreak"));
    verify(journalEntryRepository).findByUserId(userId);
    verify(snippetRepository).findByUserId(userId);
  }

  @Test
  @DisplayName("Should handle empty journal list for statistics")
  void shouldHandleEmptyJournalListForStatistics() {
    // Given
    when(journalEntryRepository.findByUserId(userId)).thenReturn(new ArrayList<>());
    when(snippetRepository.findByUserId(userId)).thenReturn(new ArrayList<>());

    // When
    Map<String, Object> statistics = journalEntryService.getUserStatistics(userId);

    // Then
    assertNotNull(statistics);
    assertEquals(0, statistics.get("totalJournals"));
    assertEquals(0.0, statistics.get("avgMood"));
    assertEquals(0, statistics.get("weeklyJournalCount"));
    assertEquals(0, statistics.get("currentStreak"));
    verify(journalEntryRepository).findByUserId(userId);
    verify(snippetRepository).findByUserId(userId);
  }
}

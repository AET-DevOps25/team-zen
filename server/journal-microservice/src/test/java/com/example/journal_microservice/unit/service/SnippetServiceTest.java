package com.example.journal_microservice.unit.service;

import com.example.journal_microservice.exception.SnippetNotFoundException;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import com.example.journal_microservice.service.SnippetService;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SnippetService Unit Tests")
class SnippetServiceTest {

    @Mock
    private SnippetRepository snippetRepository;

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private SnippetService snippetService;

    private Snippet testSnippet;
    private JournalEntry testEntry;
    private final String userId = "test-user-1";
    private final String snippetId = "test-snippet-1";
    private final String journalEntryId = "test-entry-1";

    @BeforeEach
    void setUp() {
        testSnippet = TestDataFactory.createSampleSnippet();
        testSnippet.setId(snippetId);
        testEntry = TestDataFactory.createSampleJournalEntry();
        testEntry.setId(journalEntryId);
    }

    @Test
    @DisplayName("Should get all snippets successfully")
    void shouldGetAllSnippets() {
        // Given
        List<Snippet> expectedSnippets = TestDataFactory.createMultipleSnippets(userId, journalEntryId, 3);
        when(snippetRepository.findAll()).thenReturn(expectedSnippets);

        // When
        List<Snippet> result = snippetService.getAllSnippets();

        // Then
        assertEquals(3, result.size());
        assertEquals(expectedSnippets, result);
        verify(snippetRepository).findAll();
    }

    @Test
    @DisplayName("Should get user snippet by ID successfully")
    void shouldGetUserSnippetById() {
        // Given
        when(snippetRepository.findByUserIdAndId(userId, snippetId))
                .thenReturn(Optional.of(testSnippet));

        // When
        Snippet result = snippetService.getUserSnippetById(userId, snippetId);

        // Then
        assertNotNull(result);
        assertEquals(testSnippet, result);
        verify(snippetRepository).findByUserIdAndId(userId, snippetId);
    }

    @Test
    @DisplayName("Should throw exception when getting non-existent user snippet by ID")
    void shouldThrowExceptionWhenGettingNonExistentUserSnippetById() {
        // Given
        when(snippetRepository.findByUserIdAndId(userId, snippetId))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(SnippetNotFoundException.class, 
                () -> snippetService.getUserSnippetById(userId, snippetId));
        verify(snippetRepository).findByUserIdAndId(userId, snippetId);
    }

    @Test
    @DisplayName("Should get user snippets successfully")
    void shouldGetUserSnippets() {
        // Given
        List<Snippet> expectedSnippets = TestDataFactory.createMultipleSnippets(userId, journalEntryId, 3);
        when(snippetRepository.findByUserId(userId)).thenReturn(expectedSnippets);

        // When
        List<Snippet> result = snippetService.getUserSnippets(userId, null);

        // Then
        assertEquals(3, result.size());
        assertEquals(expectedSnippets, result);
        verify(snippetRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("Should throw exception when no snippets found for user")
    void shouldThrowExceptionWhenNoSnippetsFoundForUser() {
        // Given
        when(snippetRepository.findByUserId(userId)).thenReturn(new ArrayList<>());

        // When & Then
        assertThrows(SnippetNotFoundException.class, 
                () -> snippetService.getUserSnippets(userId, null));
        verify(snippetRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("Should get user snippets by date successfully")
    void shouldGetUserSnippetsByDate() {
        // Given
        LocalDate testDate = LocalDate.now();
        List<Snippet> allSnippets = TestDataFactory.createMultipleSnippets(userId, journalEntryId, 5);
        // Set dates for filtering
        allSnippets.get(0).setTimestamp(java.sql.Date.valueOf(testDate));
        allSnippets.get(1).setTimestamp(java.sql.Date.valueOf(testDate));
        
        when(snippetRepository.findByUserId(userId)).thenReturn(allSnippets);

        // When
        List<Snippet> result = snippetService.getUserSnippets(userId, testDate);

        // Then
        assertTrue(result.size() >= 2); // At least the ones we set with test date
        verify(snippetRepository).findByUserId(userId);
    }
}

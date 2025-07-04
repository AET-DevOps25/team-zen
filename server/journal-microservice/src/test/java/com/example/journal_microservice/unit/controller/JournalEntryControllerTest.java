package com.example.journal_microservice.unit.controller;

import com.example.journal_microservice.controller.JournalEntryController;
import com.example.journal_microservice.exception.JournalEntryNotFoundException;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.service.JournalEntryService;
import com.example.journal_microservice.testutil.TestDataFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JournalEntryController.class)
@DisplayName("JournalEntryController Unit Tests")
class JournalEntryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JournalEntryService journalEntryService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void shouldCreateJournalEntry() throws Exception {
        // Given
        when(journalEntryService.createJournalEntry(any(JournalEntry.class))).thenReturn(testEntry);

        // When & Then
        mockMvc.perform(post("/api/journalEntry")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEntry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entryId))
                .andExpect(jsonPath("$.title").value(testEntry.getTitle()))
                .andExpect(jsonPath("$.summary").value(testEntry.getSummary()));

        verify(journalEntryService).createJournalEntry(any(JournalEntry.class));
    }

    @Test
    @DisplayName("Should delete journal entry successfully")
    void shouldDeleteJournalEntry() throws Exception {
        // Given
        doNothing().when(journalEntryService).deleteJournalEntry(entryId);

        // When & Then
        mockMvc.perform(delete("/api/journalEntry/{id}", entryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entry deleted successfully."))
                .andExpect(jsonPath("$.data").value(entryId));

        verify(journalEntryService).deleteJournalEntry(entryId);
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent entry")
    void shouldReturn404WhenDeletingNonExistentEntry() throws Exception {
        // Given
        doThrow(new JournalEntryNotFoundException("Journal entry not found"))
                .when(journalEntryService).deleteJournalEntry(entryId);

        // When & Then
        mockMvc.perform(delete("/api/journalEntry/{id}", entryId))
                .andExpect(status().isNotFound());

        verify(journalEntryService).deleteJournalEntry(entryId);
    }

    @Test
    @DisplayName("Should update journal entry successfully")
    void shouldUpdateJournalEntry() throws Exception {
        // Given
        JournalEntry updatedEntry = TestDataFactory.createJournalEntry(userId, "Updated Title", "Updated Summary");
        updatedEntry.setId(entryId);
        when(journalEntryService.updateJournalEntry(eq(entryId), any(JournalEntry.class)))
                .thenReturn(updatedEntry);

        // When & Then
        mockMvc.perform(put("/api/journalEntry/{id}", entryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEntry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entry updated successfully."))
                .andExpect(jsonPath("$.data.title").value("Updated Title"))
                .andExpect(jsonPath("$.data.summary").value("Updated Summary"));

        verify(journalEntryService).updateJournalEntry(eq(entryId), any(JournalEntry.class));
    }

    @Test
    @DisplayName("Should get user journals successfully")
    void shouldGetUserJournals() throws Exception {
        // Given
        List<JournalEntry> entries = TestDataFactory.createMultipleJournalEntries(userId, 3);
        when(journalEntryService.getUserJournals(userId, null)).thenReturn(entries);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entries retrieved successfully."))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3));

        verify(journalEntryService).getUserJournals(userId, null);
    }

    @Test
    @DisplayName("Should get user journal by ID successfully")
    void shouldGetUserJournalById() throws Exception {
        // Given
        when(journalEntryService.getUserJournalById(userId, entryId)).thenReturn(testEntry);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("journalId", entryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entry retrieved successfully."))
                .andExpect(jsonPath("$.data.id").value(entryId));

        verify(journalEntryService).getUserJournalById(userId, entryId);
    }

    @Test
    @DisplayName("Should get user journals by date successfully")
    void shouldGetUserJournalsByDate() throws Exception {
        // Given
        String dateParam = "2024-01-01";
        LocalDate date = LocalDate.parse(dateParam);
        when(journalEntryService.getUserJournals(userId, date)).thenReturn(List.of(testEntry));

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("date", dateParam))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entries retrieved successfully."))
                .andExpect(jsonPath("$.data").isArray());

        verify(journalEntryService).getUserJournals(userId, date);
    }

    @Test
    @DisplayName("Should handle invalid date format")
    void shouldHandleInvalidDateFormat() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("date", "invalid-date"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid date format. Expected YYYY-MM-DD."));

        verify(journalEntryService, never()).getUserJournals(anyString(), any(LocalDate.class));
    }

    @Test
    @DisplayName("Should get user statistics successfully")
    void shouldGetUserStatistics() throws Exception {
        // Given
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEntries", 10);
        stats.put("averageMood", 7.5);
        stats.put("entriesThisWeek", 3);
        stats.put("entriesThisMonth", 8);
        when(journalEntryService.getUserStatistics(userId)).thenReturn(stats);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}/statistics", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEntries").value(10))
                .andExpect(jsonPath("$.averageMood").value(7.5))
                .andExpect(jsonPath("$.entriesThisWeek").value(3))
                .andExpect(jsonPath("$.entriesThisMonth").value(8));

        verify(journalEntryService).getUserStatistics(userId);
    }

    @Test
    @DisplayName("Should handle service exceptions properly")
    void shouldHandleServiceExceptions() throws Exception {
        // Given
        when(journalEntryService.getUserJournals(userId, null))
                .thenThrow(new JournalEntryNotFoundException("No entries found"));

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId))
                .andExpect(status().isNotFound());

        verify(journalEntryService).getUserJournals(userId, null);
    }
}

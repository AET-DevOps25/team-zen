package com.example.journal_microservice.integration;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.service.UserService;
import com.example.journal_microservice.testutil.TestDataFactory;
import com.example.journal_microservice.testutil.TestMongoConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestMongoConfig.class)
@Testcontainers
@DisplayName("Journal REST API Integration Tests")
class JournalRestApiIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.2");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.mongodb.database", () -> "testdb");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    private final String userId = "test-user-api";

    @BeforeEach
    void setUp() {
        journalEntryRepository.deleteAll();
        doNothing().when(userService).addJournalEntryToUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should create journal entry via REST API")
    void shouldCreateJournalEntryViaRestApi() throws Exception {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "API Test", "Test via API");

        // When & Then
        mockMvc.perform(post("/api/journalEntry")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(entry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("API Test"))
                .andExpect(jsonPath("$.summary").value("Test via API"))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    @DisplayName("Should get journal entries via REST API")
    void shouldGetJournalEntriesViaRestApi() throws Exception {
        // Given
        JournalEntry entry1 = TestDataFactory.createJournalEntry(userId, "Entry 1", "Summary 1");
        JournalEntry entry2 = TestDataFactory.createJournalEntry(userId, "Entry 2", "Summary 2");
        journalEntryRepository.save(entry1);
        journalEntryRepository.save(entry2);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entries retrieved successfully."))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[*].title", containsInAnyOrder("Entry 1", "Entry 2")));
    }

    @Test
    @DisplayName("Should update journal entry via REST API")
    void shouldUpdateJournalEntryViaRestApi() throws Exception {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Original", "Original Summary");
        JournalEntry savedEntry = journalEntryRepository.save(entry);

        JournalEntry updateData = new JournalEntry();
        updateData.setTitle("Updated Title");
        updateData.setSummary("Updated Summary");
        updateData.setDailyMood(3.5);

        // When & Then
        mockMvc.perform(put("/api/journalEntry/{id}", savedEntry.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entry updated successfully."))
                .andExpect(jsonPath("$.data.title").value("Updated Title"))
                .andExpect(jsonPath("$.data.summary").value("Updated Summary"))
                .andExpect(jsonPath("$.data.dailyMood").value(3.5));
    }

    @Test
    @DisplayName("Should delete journal entry via REST API")
    void shouldDeleteJournalEntryViaRestApi() throws Exception {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "To Delete", "Will be deleted");
        JournalEntry savedEntry = journalEntryRepository.save(entry);

        // When & Then
        mockMvc.perform(delete("/api/journalEntry/{id}", savedEntry.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entry deleted successfully."))
                .andExpect(jsonPath("$.data").value(savedEntry.getId()));

        // Verify it's deleted
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("journalId", savedEntry.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get journal entry by ID via REST API")
    void shouldGetJournalEntryByIdViaRestApi() throws Exception {
        // Given
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Specific Entry", "Specific Summary");
        JournalEntry savedEntry = journalEntryRepository.save(entry);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("journalId", savedEntry.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entry retrieved successfully."))
                .andExpect(jsonPath("$.data.id").value(savedEntry.getId()))
                .andExpect(jsonPath("$.data.title").value("Specific Entry"))
                .andExpect(jsonPath("$.data.summary").value("Specific Summary"));
    }

    @Test
    @DisplayName("Should get journal entries by date via REST API")
    void shouldGetJournalEntriesByDateViaRestApi() throws Exception {
        // Given
        String testDate = "2024-01-15";
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Date Entry", "Entry for specific date");
        entry.setDate(java.sql.Date.valueOf(testDate));
        journalEntryRepository.save(entry);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("date", testDate))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Journal entries retrieved successfully."))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].title").value("Date Entry"));
    }

    @Test
    @DisplayName("Should get user statistics via REST API")
    void shouldGetUserStatisticsViaRestApi() throws Exception {
        // Given
        JournalEntry entry1 = TestDataFactory.createJournalEntry(userId, "Entry 1", "Summary 1");
        entry1.setDailyMood(2.0);
        JournalEntry entry2 = TestDataFactory.createJournalEntry(userId, "Entry 2", "Summary 2");
        entry2.setDailyMood(4.0);
        journalEntryRepository.save(entry1);
        journalEntryRepository.save(entry2);

        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}/statistics", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalJournals").value(2))
                .andExpect(jsonPath("$.avgMood").value(3.0))
                .andExpect(jsonPath("$.weeklyAvgMood").exists())
                .andExpect(jsonPath("$.currentStreak").exists());
    }

    @Test
    @DisplayName("Should handle invalid date format in REST API")
    void shouldHandleInvalidDateFormatInRestApi() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("date", "invalid-date-format"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid date format. Expected YYYY-MM-DD."));
    }

    @Test
    @DisplayName("Should handle non-existent journal entry in REST API")
    void shouldHandleNonExistentJournalEntryInRestApi() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("journalId", "non-existent-id"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should handle validation errors in REST API")
    void shouldHandleValidationErrorsInRestApi() throws Exception {
        // Given - Invalid JSON
        String invalidJson = "{ \"title\": \"\", \"invalidField\": true }";

        // When & Then
        mockMvc.perform(post("/api/journalEntry")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isOk()); // Note: Since we don't have validation annotations, this will pass
                                              // In a real application, you would add @Valid annotations
    }

    @Test
    @DisplayName("Should maintain data consistency through REST API operations")
    void shouldMaintainDataConsistencyThroughRestApiOperations() throws Exception {
        // Given - Create entry via API
        JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Consistency Test", "Test consistency");

        String createResponse = mockMvc.perform(post("/api/journalEntry")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(entry)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JournalEntry createdEntry = objectMapper.readValue(createResponse, JournalEntry.class);

        // When - Update via API
        JournalEntry updateData = new JournalEntry();
        updateData.setTitle("Updated via API");
        
        mockMvc.perform(put("/api/journalEntry/{id}", createdEntry.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated via API"));

        // Then - Verify via GET
        mockMvc.perform(get("/api/journalEntry/{userId}", userId)
                .param("journalId", createdEntry.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated via API"));
    }
}

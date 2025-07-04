package com.example.journal_microservice.e2e;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
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

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Import(TestMongoConfig.class)
@Testcontainers
@DisplayName("Journal Microservice E2E Tests")
class JournalMicroserviceE2ETest {

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
  private SnippetRepository snippetRepository;

  @Autowired
  private ObjectMapper objectMapper;

  @MockitoBean
  private UserService userService;

  private final String userId = "test-user-e2e";

  @BeforeEach
  void setUp() {
    // Clean database
    journalEntryRepository.deleteAll();
    snippetRepository.deleteAll();

    // Mock external dependencies
    doNothing().when(userService).addJournalEntryToUser(anyString(), anyString());
    doNothing().when(userService).addSnippetToUser(anyString(), anyString());
  }

  @Test
  @DisplayName("Complete user journey: Create, read, update, delete journal entry")
  void completeUserJourneyForJournalEntry() throws Exception {
    // Step 1: Create a journal entry
    JournalEntry newEntry = TestDataFactory.createJournalEntry(userId, "My First Entry", "Today was a good day");

    String createResponse = mockMvc.perform(post("/api/journalEntry")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(newEntry)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("My First Entry"))
        .andReturn().getResponse().getContentAsString();

    JournalEntry createdEntry = objectMapper.readValue(createResponse, JournalEntry.class);
    String entryId = createdEntry.getId();

    // Step 2: Read the journal entry
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("journalId", entryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.title").value("My First Entry"))
        .andExpect(jsonPath("$.data.summary").value("Today was a good day"));

    // Step 3: Update the journal entry
    JournalEntry updateData = new JournalEntry();
    updateData.setTitle("My Updated Entry");
    updateData.setSummary("Today was an amazing day!");
    updateData.setDailyMood(9.5);

    mockMvc.perform(put("/api/journalEntry/{id}", entryId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateData)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.title").value("My Updated Entry"))
        .andExpect(jsonPath("$.data.summary").value("Today was an amazing day!"))
        .andExpect(jsonPath("$.data.dailyMood").value(9.5));

    // Step 4: Verify the update persisted
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("journalId", entryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.title").value("My Updated Entry"));

    // Step 5: Delete the journal entry
    mockMvc.perform(delete("/api/journalEntry/{id}", entryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("Journal entry deleted successfully."));

    // Step 6: Verify deletion
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("journalId", entryId))
        .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Complete workflow: Multiple journal entries with snippets")
  void completeWorkflowWithMultipleEntriesAndSnippets() throws Exception {
    // Step 1: Create multiple journal entries
    List<String> entryIds = new ArrayList<>();

    for (int i = 1; i <= 3; i++) {
      JournalEntry entry = TestDataFactory.createJournalEntry(userId,
          "Entry " + i, "Summary for entry " + i);
      entry.setDailyMood(7.0 + i);

      String response = mockMvc.perform(post("/api/journalEntry")
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(entry)))
          .andExpect(status().isOk())
          .andReturn().getResponse().getContentAsString();

      JournalEntry created = objectMapper.readValue(response, JournalEntry.class);
      entryIds.add(created.getId());
    }

    // Step 2: Verify all entries are retrievable
    mockMvc.perform(get("/api/journalEntry/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(3)))
        .andExpect(jsonPath("$.data[*].title", containsInAnyOrder("Entry 1", "Entry 2", "Entry 3")));

    // Step 3: Add snippets to the first journal entry
    JournalEntry firstEntry = journalEntryRepository.findById(entryIds.get(0)).orElseThrow();

    for (int i = 1; i <= 2; i++) {
      Snippet snippet = TestDataFactory.createSnippet(userId,
          "Snippet content " + i, firstEntry.getId());
      snippetRepository.save(snippet);

      // Add snippet ID to journal entry
      firstEntry.getSnippetIds().add(snippet.getId());
    }
    journalEntryRepository.save(firstEntry);

    // Step 4: Verify snippets are associated
    JournalEntry entryWithSnippets = journalEntryRepository.findById(entryIds.get(0)).orElseThrow();
    assertEquals(2, entryWithSnippets.getSnippetIds().size());

    // Step 5: Get user statistics
    mockMvc.perform(get("/api/journalEntry/{userId}/statistics", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalJournals").value(3))
        .andExpect(jsonPath("$.avgMood").value(9.0)); // (8+9+10)/3

    // Step 6: Delete entry with snippets
    mockMvc.perform(delete("/api/journalEntry/{id}", entryIds.get(0)))
        .andExpect(status().isOk());

    // Step 7: Verify cleanup
    mockMvc.perform(get("/api/journalEntry/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(2)));
  }

  @Test
  @DisplayName("Data filtering and search functionality")
  void dataFilteringAndSearchFunctionality() throws Exception {
    // Step 1: Create entries for different dates
    String date1 = "2024-01-15";
    String date2 = "2024-01-16";

    JournalEntry entry1 = TestDataFactory.createJournalEntry(userId, "Monday Entry", "Monday summary");
    entry1.setDate(java.sql.Date.valueOf(date1));
    entry1.setDailyMood(7.0);

    JournalEntry entry2 = TestDataFactory.createJournalEntry(userId, "Tuesday Entry", "Tuesday summary");
    entry2.setDate(java.sql.Date.valueOf(date2));
    entry2.setDailyMood(8.5);

    JournalEntry entry3 = TestDataFactory.createJournalEntry(userId, "Another Monday", "Another Monday summary");
    entry3.setDate(java.sql.Date.valueOf(date1));
    entry3.setDailyMood(6.5);

    // Create entries
    journalEntryRepository.save(entry1);
    journalEntryRepository.save(entry2);
    journalEntryRepository.save(entry3);

    // Step 2: Filter by specific date (should return 2 entries for date1)
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("date", date1))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(2))); // Both entries for date1

    // Step 3: Filter by another date (should return 1 entry for date2)
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("date", date2))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(1)));

    // Step 4: Get all entries (should return 3)
    mockMvc.perform(get("/api/journalEntry/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(3)));

    // Step 5: Test statistics calculation
    mockMvc.perform(get("/api/journalEntry/{userId}/statistics", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalJournals").value(3))
        .andExpect(jsonPath("$.avgMood").value(7.333333333333333)); // (7.0+8.5+6.5)/3
  }

  @Test
  @DisplayName("Error handling and edge cases")
  void errorHandlingAndEdgeCases() throws Exception {
    // Test 1: Get non-existent journal entry
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("journalId", "non-existent-id"))
        .andExpect(status().isNotFound());

    // Test 2: Delete non-existent journal entry
    mockMvc.perform(delete("/api/journalEntry/{id}", "non-existent-id"))
        .andExpect(status().isNotFound());

    // Test 3: Update non-existent journal entry
    JournalEntry updateData = new JournalEntry();
    updateData.setTitle("Updated");

    mockMvc.perform(put("/api/journalEntry/{id}", "non-existent-id")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateData)))
        .andExpect(status().isNotFound());

    // Test 4: Invalid date format
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("date", "invalid-date"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Invalid date format. Expected YYYY-MM-DD."));

    // Test 5: Get journals for user with no entries
    mockMvc.perform(get("/api/journalEntry/{userId}", "user-with-no-entries"))
        .andExpect(status().isNotFound());
  }

  @Test
  @DisplayName("Performance and concurrency simulation")
  void performanceAndConcurrencySimulation() throws Exception {
    // Simulate multiple concurrent operations
    List<JournalEntry> entries = new ArrayList<>();

    // Create multiple entries quickly
    for (int i = 0; i < 10; i++) {
      JournalEntry entry = TestDataFactory.createJournalEntry(userId,
          "Performance Test " + i, "Summary " + i);
      entry.setDailyMood(5.0 + (i % 5));

      String response = mockMvc.perform(post("/api/journalEntry")
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(entry)))
          .andExpect(status().isOk())
          .andReturn().getResponse().getContentAsString();

      JournalEntry created = objectMapper.readValue(response, JournalEntry.class);
      entries.add(created);
    }

    // Verify all entries were created
    mockMvc.perform(get("/api/journalEntry/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(10)));

    // Update multiple entries
    for (int i = 0; i < 5; i++) {
      JournalEntry updateData = new JournalEntry();
      updateData.setTitle("Updated Title " + i);

      mockMvc.perform(put("/api/journalEntry/{id}", entries.get(i).getId())
          .contentType(MediaType.APPLICATION_JSON)
          .content(objectMapper.writeValueAsString(updateData)))
          .andExpect(status().isOk());
    }

    // Delete some entries
    for (int i = 5; i < 8; i++) {
      mockMvc.perform(delete("/api/journalEntry/{id}", entries.get(i).getId()))
          .andExpect(status().isOk());
    }

    // Verify final state
    mockMvc.perform(get("/api/journalEntry/{userId}", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(7)));

    // Verify statistics are calculated correctly
    mockMvc.perform(get("/api/journalEntry/{userId}/statistics", userId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalJournals").value(7));
  }

  @Test
  @DisplayName("Date handling with various formats")
  void dateHandlingWithVariousFormats() throws Exception {
    // Test ISO timestamp format extraction
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("date", "2024-01-15T10:30:00Z"))
        .andExpect(status().isNotFound()); // No entries for this date yet

    // Create entry for specific date
    JournalEntry entry = TestDataFactory.createJournalEntry(userId, "Date Test", "Testing dates");
    entry.setDate(java.sql.Date.valueOf("2024-01-15"));
    journalEntryRepository.save(entry);

    // Test different date formats that should work
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("date", "2024-01-15"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(1)));

    // Test ISO format (should extract date part)
    mockMvc.perform(get("/api/journalEntry/{userId}", userId)
        .param("date", "2024-01-15T10:30:00Z"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data", hasSize(1)));
  }
}

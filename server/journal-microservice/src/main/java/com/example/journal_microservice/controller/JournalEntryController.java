package com.example.journal_microservice.controller;

import com.example.journal_microservice.dto.wrapper.ApiResponse;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.service.JournalEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/journalEntry")
public class JournalEntryController {

    @Autowired
    private JournalEntryService journalEntryService;

    @PostMapping
    public ResponseEntity<JournalEntry> createJournalEntry(@RequestBody JournalEntry journalEntry) {
        JournalEntry newEntry = journalEntryService.createJournalEntry(journalEntry);
        return ResponseEntity.ok(newEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteJournalEntry(@PathVariable("id") String id) {
        journalEntryService.deleteJournalEntry(id);
        return ResponseEntity.ok(new ApiResponse<>("Journal entry deleted successfully.", id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JournalEntry>> updateJournalEntry(@PathVariable("id") String id,
            @RequestBody JournalEntry journalEntry) {
        JournalEntry updatedEntry = journalEntryService.updateJournalEntry(id, journalEntry);
        return ResponseEntity.ok(new ApiResponse<>("Journal entry updated successfully.", updatedEntry));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<Object>> getUserJournals(@PathVariable("userId") String userId,
            @RequestParam(name = "journalId", required = false) String journalId,
            @RequestParam(name = "date", required = false) String dateParam) {

        if (journalId != null) {
            JournalEntry journalEntry = journalEntryService.getUserJournalById(userId, journalId);
            return ResponseEntity.ok(new ApiResponse<>("Journal entry retrieved successfully.", journalEntry));
        }

        LocalDate date = null;
        if (dateParam != null) {
            try {
                // Handle both simple date format (YYYY-MM-DD) and ISO timestamp formats
                if (dateParam.contains("T")) {
                    // Extract just the date part from ISO timestamp
                    dateParam = dateParam.split("T")[0];
                }
                date = LocalDate.parse(dateParam);
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Invalid date format. Expected YYYY-MM-DD.", null));
            }
        }

        List<JournalEntry> journalEntries = journalEntryService.getUserJournals(userId, date);
        return ResponseEntity.ok(new ApiResponse<>("Journal entries retrieved successfully.", journalEntries));
    }

    @GetMapping("/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics(@PathVariable("userId") String userId) {
        Map<String, Object> stats = journalEntryService.getUserStatistics(userId);
        return ResponseEntity.ok(stats);
    }
}

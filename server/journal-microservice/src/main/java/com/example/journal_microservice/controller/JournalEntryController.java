package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journalEntry")
public class JournalEntryController {
    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @GetMapping
    public List<JournalEntry> getAllSnippets() {
        return journalEntryRepository.findAll();
    }

    @PostMapping
    public JournalEntry createJournalEntry(@RequestBody JournalEntry journalEntry) {
        return journalEntryRepository.save(journalEntry);
    }

    @DeleteMapping("/{id}")
    public void deleteJournalEntry(@PathVariable("id") String id) {
        try {
            journalEntryRepository.findById(id).orElseThrow(() -> new RuntimeException("Journal entry not found"));
            journalEntryRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw new RuntimeException("Journal entry not found or something went wrong");
        }

    }
}

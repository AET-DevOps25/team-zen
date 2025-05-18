package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class JournalEntryController {
    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @GetMapping("/journalEntry")
    public List<JournalEntry> getAllSnippets() {
        return JournalEntryRepository.findAll();
    }

    @PostMapping("/journalEntry")
    public JournalEntry createUser(@RequestBody JournalEntry journalEntry) {
        return JournalEntryRepository.save(journalEntry);
    }

    @DeleteMapping("/journalEntry/{id}")
    public void deleteUser(@PathVariable String id) {
        JournalEntryRepository.deleteById(id);
    }
}

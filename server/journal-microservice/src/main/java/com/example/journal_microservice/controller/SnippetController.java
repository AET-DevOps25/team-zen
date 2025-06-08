package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.SnippetRepository;
import com.example.journal_microservice.repository.JournalEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.journal_microservice.model.JournalEntry;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.time.ZoneId;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    @Autowired
    private SnippetRepository snippetRepository;
    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @GetMapping
    public List<Snippet> getAllSnippets() {
        return snippetRepository.findAll();
    }

    @PostMapping
    public Snippet createSnippet(@RequestBody Snippet snippet) {
        if (snippet.getTimestamp() == null) {
            snippet.setTimestamp(new Date());
        }

        Date snippetDate = getDateOnly(snippet.getTimestamp());

        JournalEntry entry = journalEntryRepository.findByDate(snippetDate);

        if (entry == null) {
            entry = new JournalEntry();
            entry.setDate(snippetDate);
            entry.setTitle("Entry for " + snippetDate.toString());
            entry.setSummary("");
            entry.setSnippetIds(new ArrayList<>());

            entry = journalEntryRepository.save(entry);
        }

        snippet.setJournalEntryId(entry.getId());
        Snippet savedSnippet = snippetRepository.save(snippet);

        entry.getSnippetIds().add(savedSnippet.getId());
        journalEntryRepository.save(entry);
        return savedSnippet;
    }

    @DeleteMapping("/{id}")
    public void deleteSnippet(@PathVariable String id) {

        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found with ID: " + id));

        Date snippetDate = getDateOnly(snippet.getTimestamp());

        JournalEntry entry = journalEntryRepository.findByDate(snippetDate);
        if (entry != null) {
            entry.getSnippetIds().remove(snippet.getId());
            journalEntryRepository.save(entry);

            if (entry.getSnippetIds().isEmpty()) {
                journalEntryRepository.delete(entry);
            }
        }

        snippetRepository.deleteById(id);
    }

    private Date getDateOnly(Date dateTime) {
        return Date.from(dateTime.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant());
    }
}



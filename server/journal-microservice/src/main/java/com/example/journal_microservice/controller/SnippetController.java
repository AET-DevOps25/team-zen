package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    @Autowired
    private SnippetRepository snippetRepository;

    @GetMapping
    public List<Snippet> getAllSnippets() {
        return snippetRepository.findAll();
    }

    @PostMapping
    public Snippet createSnippet(@RequestBody Snippet snippet) {
        return snippetRepository.save(snippet);
    }

    @DeleteMapping("/{id}")
    public void deleteSnippet(@PathVariable String id) {
        snippetRepository.deleteById(id);
    }
}

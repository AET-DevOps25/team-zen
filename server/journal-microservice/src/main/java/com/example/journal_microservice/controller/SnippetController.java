package com.example.journal_microservice.controller;

import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SnippetController {
    @Autowired
    private SnippetRepository snippetRepository;

    @GetMapping("/snippets")
    public List<Snippet> getAllSnippets() {
        return SnippetRepository.findAll();
    }

    @PostMapping("/snippets")
    public Snippet createSnippet(@RequestBody Snippet snippet) {
        return SnippetRepository.save(snippet);
    }

    @DeleteMapping("/snippets/{id}")
    public void deleteSnippet(@PathVariable String id) {
        SnippetRepository.deleteById(id);
    }
}

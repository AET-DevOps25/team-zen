package com.example.journal_microservice.exception;

public class SnippetNotFoundException extends RuntimeException {
    public SnippetNotFoundException(String message) {
        super(message);
    }
}

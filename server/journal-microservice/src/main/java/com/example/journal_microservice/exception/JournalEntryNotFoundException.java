package com.example.journal_microservice.exception;

public class JournalEntryNotFoundException extends RuntimeException {
    public JournalEntryNotFoundException(String message) {
        super(message);
    }
}

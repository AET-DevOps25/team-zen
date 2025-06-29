package com.example.journal_microservice.exception;

public class InvalidSnippetOperationException extends RuntimeException {
    public InvalidSnippetOperationException(String message) {
        super(message);
    }
}

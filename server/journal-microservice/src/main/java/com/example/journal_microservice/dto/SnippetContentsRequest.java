package com.example.journal_microservice.dto;

import java.util.List;

public class SnippetContentsRequest {

    private List<String> snippetContents;

    public SnippetContentsRequest() {
    }

    public SnippetContentsRequest(List<String> snippetContents) {
        this.snippetContents = snippetContents;
    }

    public List<String> getSnippetContents() {
        return snippetContents;
    }

    public void setSnippetContents(List<String> snippetContents) {
        this.snippetContents = snippetContents;
    }

    @Override
    public String toString() {
        return "SnippetContentsRequest{snippetContents=" + snippetContents + "}";
    }
}

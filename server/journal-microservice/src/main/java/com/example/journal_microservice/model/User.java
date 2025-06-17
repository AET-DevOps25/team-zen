package com.example.journal_microservice.model;

  public class User {
    private String id;
    private String name;
    private String email;
    private String[] journalEntries;
    private String[] snippets;

    // Default constructor for Jackson
    public User() {
    }

    // Add getters and setters for proper JSON deserialization
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String[] getJournalEntries() {
      return journalEntries;
    }

    public void setJournalEntries(String[] journalEntries) {
      this.journalEntries = journalEntries;
    }

    public String[] getSnippets() {
      return snippets;
    }

    public void setSnippets(String[] snippets) {
      this.snippets = snippets;
    }

    @Override
    public String toString() {
      return "User{id='" + id + "', name='" + name + "', email='" + email + "'}";
    }
  }


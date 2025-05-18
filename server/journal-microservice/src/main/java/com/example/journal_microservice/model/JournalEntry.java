package com.example.journal_microservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.security.Timestamp;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.journal_microservice.model.Mood;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "journalEntries")
public class JournalEntry {
    @Id
    private String id;
    private String title;
    private String summary;
    private Date date;
    // The journalEntryID that contains this snippet
    private string entry;
    private Mood mood;
    // TODO: store IDs of snippets or the snippets themselves?
    private String[] snippets;
}

package com.example.journal_microservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "snippets")
public class Snippet {
    @Id
    private String id;
    private String content;
    private Date timestamp;
    private Mood mood;
    private List<String> tags;
    // The journalEntryID that contains this snippet
    private String journalEntryId;
    private String userId;
    private Date updatedAt;
}

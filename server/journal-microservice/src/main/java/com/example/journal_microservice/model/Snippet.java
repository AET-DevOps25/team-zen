package com.example.journal_microservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;

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
    // The journalEntryID that contains this snippet
    private String journalEntryId;
    private Double moodRating;
    private List<String> tags;
    private String userId;
    private Date updatedAt;
}


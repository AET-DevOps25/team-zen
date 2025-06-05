package com.example.journal_microservice.repository;

import com.example.journal_microservice.model.JournalEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends MongoRepository<JournalEntry, String> {
    JournalEntry findByDate(Date date);
}
package com.example.journal_microservice.repository;

import com.example.journal_microservice.model.Snippet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SnippetRepository extends MongoRepository<Snippet, String> {
}
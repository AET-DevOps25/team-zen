package com.example.journal_microservice.repository;

import com.example.journal_microservice.model.Snippet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SnippetRepository extends MongoRepository<Snippet, String> {

    List<Snippet> findByUserId(String userId);

    Optional<Snippet> findByUserIdAndId(String userId, String id);
}
package com.example.journal_microservice.service;

import com.example.journal_microservice.exception.InvalidSnippetOperationException;
import com.example.journal_microservice.exception.SnippetNotFoundException;
import com.example.journal_microservice.model.JournalEntry;
import com.example.journal_microservice.model.Snippet;
import com.example.journal_microservice.repository.JournalEntryRepository;
import com.example.journal_microservice.repository.SnippetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class SnippetService {

    private static final Logger logger = LoggerFactory.getLogger(SnippetService.class);

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private UserService userService;

    public List<Snippet> getAllSnippets() {
        return snippetRepository.findAll();
    }

    public Snippet getUserSnippetById(String userId, String snippetId) {
        return snippetRepository.findByUserIdAndId(userId, snippetId)
                .orElseThrow(() -> new SnippetNotFoundException(
                        "Snippet not found for user: " + userId + " and snippetId: " + snippetId));
    }

    public List<Snippet> getUserSnippets(String userId, LocalDate date) {
        List<Snippet> snippets = snippetRepository.findByUserId(userId);

        if (snippets.isEmpty()) {
            logger.debug("No snippets found for user: {}", userId);
            throw new SnippetNotFoundException("No snippets found for user: " + userId);
        }

        if (date != null) {
            snippets = snippets.stream()
                    .filter(s -> s.getUpdatedAt() != null &&
                            s.getUpdatedAt().toInstant()
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDate()
                                    .isEqual(date))
                    .toList();
        }

        return snippets;
    }

    public Snippet createSnippet(Snippet snippet) {
        if (snippet.getTimestamp() == null) {
            snippet.setTimestamp(new Date());
        }

        Date snippetDate = getDateOnly(snippet.getTimestamp());

        JournalEntry entry = journalEntryRepository.findByDateAndUserId(snippetDate, snippet.getUserId());
        logger.debug("Found journal entry: {}", entry);

        if (entry == null) {
            logger.debug("No journal entry found for date: {} and userId: {}, creating a new one.", snippetDate,
                    snippet.getUserId());
            entry = createNewJournalEntry(snippetDate, snippet.getUserId());
        }

        snippet.setJournalEntryId(entry.getId());
        snippet.setUpdatedAt(snippetDate);
        Snippet savedSnippet = snippetRepository.save(snippet);

        updateJournalEntryWithSnippet(entry, savedSnippet);
        updateUserWithSnippet(savedSnippet);

        return savedSnippet;
    }

    private JournalEntry createNewJournalEntry(Date snippetDate, String userId) {
        JournalEntry entry = new JournalEntry();
        entry.setDate(snippetDate);
        entry.setSnippetIds(new ArrayList<>());
        entry.setUpdatedAt(snippetDate);
        entry.setUserId(userId);
        entry = journalEntryRepository.save(entry);

        try {
            logger.debug("Adding journal entry for user: {}", userId);
            userService.addJournalEntryToUser(userId, entry.getId());
        } catch (Exception e) {
            logger.error("Failed to update user with new journal entry, but journal entry was created", e);
        }

        return entry;
    }

    private void updateJournalEntryWithSnippet(JournalEntry entry, Snippet snippet) {
        int previousSnippetCount = entry.getSnippetIds().size();
        entry.getSnippetIds().add(snippet.getId());

        double currentMood = entry.getDailyMood() != null ? entry.getDailyMood() : 0.0;
        double totalMoodSum = currentMood * previousSnippetCount + snippet.getMood();
        entry.setDailyMood(totalMoodSum / entry.getSnippetIds().size());

        journalEntryRepository.save(entry);
    }

    private void updateUserWithSnippet(Snippet snippet) {
        try {
            userService.addSnippetToUser(snippet.getUserId(), snippet.getId());
        } catch (Exception e) {
            logger.error("Failed to update user with new snippet, but snippet was created", e);
        }
    }

    public void deleteSnippet(String id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new SnippetNotFoundException("Snippet not found with ID: " + id));

        Date snippetDate = getDateOnly(snippet.getTimestamp());

        JournalEntry entry = journalEntryRepository.findByDateAndUserId(snippetDate, snippet.getUserId());
        if (entry != null) {
            List<String> snippetIds = entry.getSnippetIds();

            if (snippetIds.size() <= 1) {
                logger.debug("Cannot delete the last remaining snippet in a journal entry.");
                throw new InvalidSnippetOperationException(
                        "Cannot delete the last remaining snippet in a journal entry.");
            }

            entry.setDailyMood(
                    (entry.getDailyMood() * snippetIds.size() - snippet.getMood()) / (snippetIds.size() - 1));

            snippetIds.remove(snippet.getId());
            journalEntryRepository.save(entry);
        }

        snippetRepository.deleteById(id);
    }

    public Snippet updateSnippet(String id, Snippet updatedSnippet) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new SnippetNotFoundException("Snippet not found with ID: " + id));

        if (updatedSnippet.getContent() != null) {
            snippet.setContent(updatedSnippet.getContent());
        }

        if (updatedSnippet.getTags() != null) {
            snippet.setTags(updatedSnippet.getTags());
        }

        snippet.setUpdatedAt(new Date());

        return snippetRepository.save(snippet);
    }

    private Date getDateOnly(Date dateTime) {
        return Date.from(dateTime.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant());
    }
}

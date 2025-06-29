package com.example.journal_microservice.service;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.example.journal_microservice.exception.UserServiceException;
import com.example.journal_microservice.model.User;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final RestClient restClient;

    private final String userServiceBaseUrl;

    public UserService(@Value("${user.service.base-url}") String userServiceBaseUrl) {
        this.userServiceBaseUrl = userServiceBaseUrl + "/api/users";
        this.restClient = RestClient.create();
        logger.info("UserService initialized with base URL: {}", userServiceBaseUrl);
    }

    public User getUserById(String userId) {
        try {
            User user = restClient.get()
                    .uri(userServiceBaseUrl + "/" + userId)
                    .retrieve()
                    .body(User.class);

            if (user == null) {
                throw new UserServiceException("User not found with ID: " + userId);
            }

            return user;
        } catch (RestClientException e) {
            logger.error("Error fetching user with ID: {}", userId, e);
            throw new UserServiceException("Failed to fetch user with ID: " + userId, e);
        }
    }

    public User updateUser(String userId, User user) {
        try {
            User updatedUser = restClient.put()
                    .uri(userServiceBaseUrl + "/" + userId)
                    .body(user)
                    .retrieve()
                    .body(User.class);

            if (updatedUser == null) {
                throw new UserServiceException("Failed to update user with ID: " + userId);
            }

            logger.debug("User updated successfully: {}", updatedUser);
            return updatedUser;
        } catch (RestClientException e) {
            logger.error("Error updating user with ID: {}", userId, e);
            throw new UserServiceException("Failed to update user with ID: " + userId, e);
        }
    }

    public void addJournalEntryToUser(String userId, String journalEntryId) {
        try {
            User user = getUserById(userId);
            String[] currentEntries = user.getJournalEntries() != null ? user.getJournalEntries() : new String[0];

            logger.debug("Current journal entries for user {}: {}", userId, Arrays.toString(currentEntries));

            String[] updatedEntries = Arrays.copyOf(currentEntries, currentEntries.length + 1);
            updatedEntries[currentEntries.length] = journalEntryId;
            user.setJournalEntries(updatedEntries);

            logger.debug("Updated journal entries for user {}: {}", userId, Arrays.toString(updatedEntries));

            updateUser(userId, user);
        } catch (Exception e) {
            logger.error("Error adding journal entry {} to user {}", journalEntryId, userId, e);
            throw new UserServiceException("Failed to add journal entry to user", e);
        }
    }

    public void addSnippetToUser(String userId, String snippetId) {
        try {
            User user = getUserById(userId);
            String[] currentSnippets = user.getSnippets() != null ? user.getSnippets() : new String[0];

            logger.debug("Current snippets for user {}: {}", userId, Arrays.toString(currentSnippets));

            String[] updatedSnippets = Arrays.copyOf(currentSnippets, currentSnippets.length + 1);
            updatedSnippets[currentSnippets.length] = snippetId;
            user.setSnippets(updatedSnippets);

            logger.debug("Updated snippets for user {}: {}", userId, Arrays.toString(updatedSnippets));

            updateUser(userId, user);
        } catch (Exception e) {
            logger.error("Error adding snippet {} to user {}", snippetId, userId, e);
            throw new UserServiceException("Failed to add snippet to user", e);
        }
    }
}

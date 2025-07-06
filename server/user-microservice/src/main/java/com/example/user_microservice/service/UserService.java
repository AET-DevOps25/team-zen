package com.example.user_microservice.service;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> updateUser(String id, User userDetails) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(userDetails.getName());
                    existingUser.setEmail(userDetails.getEmail());
                    if (userDetails.getJournalEntries() != null) {
                        existingUser.setJournalEntries(userDetails.getJournalEntries());
                    }
                    if (userDetails.getSnippets() != null) {
                        existingUser.setSnippets(userDetails.getSnippets());
                    }
                    return userRepository.save(existingUser);
                });
    }
    
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public User addJournalEntry(String userId, String journalEntryId) {
        return userRepository.findById(userId)
                .map(user -> {
                    String[] currentEntries = user.getJournalEntries();
                    String[] newEntries = new String[currentEntries != null ? currentEntries.length + 1 : 1];
                    
                    if (currentEntries != null) {
                        System.arraycopy(currentEntries, 0, newEntries, 0, currentEntries.length);
                    }
                    newEntries[newEntries.length - 1] = journalEntryId;
                    
                    user.setJournalEntries(newEntries);
                    return userRepository.save(user);
                })
                .orElse(null);
    }
    
    public User addSnippet(String userId, String snippetId) {
        return userRepository.findById(userId)
                .map(user -> {
                    String[] currentSnippets = user.getSnippets();
                    String[] newSnippets = new String[currentSnippets != null ? currentSnippets.length + 1 : 1];
                    
                    if (currentSnippets != null) {
                        System.arraycopy(currentSnippets, 0, newSnippets, 0, currentSnippets.length);
                    }
                    newSnippets[newSnippets.length - 1] = snippetId;
                    
                    user.setSnippets(newSnippets);
                    return userRepository.save(user);
                })
                .orElse(null);
    }
}

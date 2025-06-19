package com.example.user_microservice.controller;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping()
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable("userId") String userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable("userId") String userId, @RequestBody User newUser){
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.setName(newUser.getName());
                    if (newUser.getJournalEntries() != null && newUser.getJournalEntries().length > 0)
                        existingUser.setJournalEntries(newUser.getJournalEntries());
                    if (newUser.getSnippets() != null && newUser.getSnippets().length > 0)
                        existingUser.setSnippets(newUser.getSnippets());
                    User updatedUser = userRepository.save(existingUser);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());

    }

    @PostMapping()
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") String id) {
        userRepository.deleteById(id);
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

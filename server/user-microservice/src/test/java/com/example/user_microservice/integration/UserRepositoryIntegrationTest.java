package com.example.user_microservice.integration;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
@ActiveProfiles("test")
@Testcontainers
class UserRepositoryIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.2");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.mongodb.database", () -> "testdb");
    }

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        testUser = new User(null, "John Doe", "john@example.com", 
                           new String[]{"journal1"}, new String[]{"snippet1"});
    }

    @Test
    void save_ShouldPersistUser() {
        // When
        User savedUser = userRepository.save(testUser);

        // Then
        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getName());
        assertEquals("john@example.com", savedUser.getEmail());
        assertArrayEquals(new String[]{"journal1"}, savedUser.getJournalEntries());
        assertArrayEquals(new String[]{"snippet1"}, savedUser.getSnippets());
    }

    @Test
    void findById_WhenUserExists_ShouldReturnUser() {
        // Given
        User savedUser = userRepository.save(testUser);

        // When
        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals(savedUser.getId(), foundUser.get().getId());
        assertEquals("John Doe", foundUser.get().getName());
    }

    @Test
    void findById_WhenUserNotExists_ShouldReturnEmpty() {
        // When
        Optional<User> foundUser = userRepository.findById("nonexistent");

        // Then
        assertFalse(foundUser.isPresent());
    }

    @Test
    void findAll_ShouldReturnAllUsers() {
        // Given
        userRepository.save(testUser);
        userRepository.save(new User(null, "Jane Smith", "jane@example.com", null, null));

        // When
        List<User> users = userRepository.findAll();

        // Then
        assertEquals(2, users.size());
        assertTrue(users.stream().anyMatch(u -> u.getName().equals("John Doe")));
        assertTrue(users.stream().anyMatch(u -> u.getName().equals("Jane Smith")));
    }

    @Test
    void deleteById_ShouldRemoveUser() {
        // Given
        User savedUser = userRepository.save(testUser);

        // When
        userRepository.deleteById(savedUser.getId());

        // Then
        Optional<User> deletedUser = userRepository.findById(savedUser.getId());
        assertFalse(deletedUser.isPresent());
    }

    @Test
    void existsById_WhenUserExists_ShouldReturnTrue() {
        // Given
        User savedUser = userRepository.save(testUser);

        // When
        boolean exists = userRepository.existsById(savedUser.getId());

        // Then
        assertTrue(exists);
    }

    @Test
    void existsById_WhenUserNotExists_ShouldReturnFalse() {
        // When
        boolean exists = userRepository.existsById("nonexistent");

        // Then
        assertFalse(exists);
    }

    @Test
    void save_ShouldUpdateExistingUser() {
        // Given
        User savedUser = userRepository.save(testUser);
        savedUser.setName("John Updated");
        savedUser.setEmail("john.updated@example.com");

        // When
        User updatedUser = userRepository.save(savedUser);

        // Then
        assertEquals(savedUser.getId(), updatedUser.getId());
        assertEquals("John Updated", updatedUser.getName());
        assertEquals("john.updated@example.com", updatedUser.getEmail());
    }

    @Test
    void save_WithNullArrays_ShouldHandleGracefully() {
        // Given
        User userWithNulls = new User(null, "Test User", "test@example.com", null, null);

        // When
        User savedUser = userRepository.save(userWithNulls);

        // Then
        assertNotNull(savedUser.getId());
        assertEquals("Test User", savedUser.getName());
        assertNull(savedUser.getJournalEntries());
        assertNull(savedUser.getSnippets());
    }

    @Test
    void save_WithEmptyArrays_ShouldHandleGracefully() {
        // Given
        User userWithEmptyArrays = new User(null, "Test User", "test@example.com", 
                                           new String[]{}, new String[]{});

        // When
        User savedUser = userRepository.save(userWithEmptyArrays);

        // Then
        assertNotNull(savedUser.getId());
        assertEquals("Test User", savedUser.getName());
        assertNotNull(savedUser.getJournalEntries());
        assertNotNull(savedUser.getSnippets());
        assertEquals(0, savedUser.getJournalEntries().length);
        assertEquals(0, savedUser.getSnippets().length);
    }
}

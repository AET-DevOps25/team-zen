package com.example.user_microservice.integration;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import com.example.user_microservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@DisplayName("UserService Integration Tests")
class UserServiceIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:6.0.2");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.mongodb.database", () -> "testdb");
    }

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Clean up database before each test
        userRepository.deleteAll();
        testUser = new User(null, "John Doe", "john@example.com", 
                           new String[]{"journal1"}, new String[]{"snippet1"});
    }

    @Test
    @DisplayName("Should create and persist user successfully")
    void createUser_ShouldPersistUserSuccessfully() {
        // When
        User createdUser = userService.createUser(testUser);

        // Then
        assertNotNull(createdUser.getId());
        assertEquals("John Doe", createdUser.getName());
        assertEquals("john@example.com", createdUser.getEmail());
        
        // Verify persistence
        Optional<User> persistedUser = userRepository.findById(createdUser.getId());
        assertTrue(persistedUser.isPresent());
        assertEquals(createdUser.getName(), persistedUser.get().getName());
    }

    @Test
    @DisplayName("Should return all persisted users")
    void getAllUsers_ShouldReturnAllPersistedUsers() {
        // Given
        userService.createUser(testUser);
        userService.createUser(new User(null, "Jane Smith", "jane@example.com", null, null));

        // When
        List<User> users = userService.getAllUsers();

        // Then
        assertEquals(2, users.size());
        assertTrue(users.stream().anyMatch(u -> u.getName().equals("John Doe")));
        assertTrue(users.stream().anyMatch(u -> u.getName().equals("Jane Smith")));
    }

    @Test
    @DisplayName("Should return user by valid ID")
    void getUserById_WithValidId_ShouldReturnUser() {
        // Given
        User createdUser = userService.createUser(testUser);

        // When
        Optional<User> foundUser = userService.getUserById(createdUser.getId());

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals(createdUser.getId(), foundUser.get().getId());
        assertEquals("John Doe", foundUser.get().getName());
    }

    @Test
    @DisplayName("Should update user with valid data")
    void updateUser_WithValidData_ShouldPersistChanges() {
        // Given
        User createdUser = userService.createUser(testUser);
        User updateData = new User(null, "John Updated", "john.updated@example.com", 
                                  new String[]{"journal1", "journal2"}, 
                                  new String[]{"snippet1", "snippet2"});

        // When
        Optional<User> updatedUser = userService.updateUser(createdUser.getId(), updateData);

        // Then
        assertTrue(updatedUser.isPresent());
        assertEquals("John Updated", updatedUser.get().getName());
        assertEquals("john.updated@example.com", updatedUser.get().getEmail());
        assertEquals(2, updatedUser.get().getJournalEntries().length);
        assertEquals(2, updatedUser.get().getSnippets().length);

        // Verify persistence
        Optional<User> persistedUser = userRepository.findById(createdUser.getId());
        assertTrue(persistedUser.isPresent());
        assertEquals("John Updated", persistedUser.get().getName());
    }

    @Test
    @DisplayName("Should remove user from database")
    void deleteUser_WithValidId_ShouldRemoveFromDatabase() {
        // Given
        User createdUser = userService.createUser(testUser);
        assertTrue(userRepository.existsById(createdUser.getId()));

        // When
        boolean deleted = userService.deleteUser(createdUser.getId());

        // Then
        assertTrue(deleted);
        assertFalse(userRepository.existsById(createdUser.getId()));
    }

    @Test
    @DisplayName("Should persist new journal entry")
    void addJournalEntry_ShouldPersistNewEntry() {
        // Given
        User createdUser = userService.createUser(testUser);
        assertEquals(1, createdUser.getJournalEntries().length);

        // When
        User updatedUser = userService.addJournalEntry(createdUser.getId(), "journal2");

        // Then
        assertNotNull(updatedUser);
        assertEquals(2, updatedUser.getJournalEntries().length);
        assertEquals("journal2", updatedUser.getJournalEntries()[1]);

        // Verify persistence
        Optional<User> persistedUser = userRepository.findById(createdUser.getId());
        assertTrue(persistedUser.isPresent());
        assertEquals(2, persistedUser.get().getJournalEntries().length);
    }

    @Test
    @DisplayName("Should persist new snippet")
    void addSnippet_ShouldPersistNewSnippet() {
        // Given
        User createdUser = userService.createUser(testUser);
        assertEquals(1, createdUser.getSnippets().length);

        // When
        User updatedUser = userService.addSnippet(createdUser.getId(), "snippet2");

        // Then
        assertNotNull(updatedUser);
        assertEquals(2, updatedUser.getSnippets().length);
        assertEquals("snippet2", updatedUser.getSnippets()[1]);

        // Verify persistence
        Optional<User> persistedUser = userRepository.findById(createdUser.getId());
        assertTrue(persistedUser.isPresent());
        assertEquals(2, persistedUser.get().getSnippets().length);
    }

    @Test
    @DisplayName("Should create new array for user without entries")
    void addJournalEntry_ToUserWithoutEntries_ShouldCreateNewArray() {
        // Given
        User userWithoutEntries = new User(null, "Test User", "test@example.com", null, null);
        User createdUser = userService.createUser(userWithoutEntries);

        // When
        User updatedUser = userService.addJournalEntry(createdUser.getId(), "journal1");

        // Then
        assertNotNull(updatedUser);
        assertEquals(1, updatedUser.getJournalEntries().length);
        assertEquals("journal1", updatedUser.getJournalEntries()[0]);
    }

    @Test
    @DisplayName("Should create new array for user without snippets")
    void addSnippet_ToUserWithoutSnippets_ShouldCreateNewArray() {
        // Given
        User userWithoutSnippets = new User(null, "Test User", "test@example.com", null, null);
        User createdUser = userService.createUser(userWithoutSnippets);

        // When
        User updatedUser = userService.addSnippet(createdUser.getId(), "snippet1");

        // Then
        assertNotNull(updatedUser);
        assertEquals(1, updatedUser.getSnippets().length);
        assertEquals("snippet1", updatedUser.getSnippets()[0]);
    }

    @Test
    @DisplayName("Should handle operations on non-existent user gracefully")
    void operationsOnNonExistentUser_ShouldHandleGracefully() {
        // When/Then
        Optional<User> nonExistentUser = userService.getUserById("nonexistent");
        assertFalse(nonExistentUser.isPresent());

        Optional<User> updateResult = userService.updateUser("nonexistent", testUser);
        assertFalse(updateResult.isPresent());

        boolean deleteResult = userService.deleteUser("nonexistent");
        assertFalse(deleteResult);

        User addJournalResult = userService.addJournalEntry("nonexistent", "journal1");
        assertNull(addJournalResult);

        User addSnippetResult = userService.addSnippet("nonexistent", "snippet1");
        assertNull(addSnippetResult);
    }
}

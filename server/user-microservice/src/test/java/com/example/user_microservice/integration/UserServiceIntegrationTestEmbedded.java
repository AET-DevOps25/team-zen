package com.example.user_microservice.integration;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import com.example.user_microservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Integration-style tests for UserService.
 * These tests verify the service layer with mocked repository
 * to avoid database dependencies while testing integration logic.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceIntegrationTestEmbedded {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private User savedUser;

    @BeforeEach
    void setUp() {
        testUser = new User(null, "John Doe", "john@example.com", 
                           new String[]{"journal1"}, new String[]{"snippet1"});
        savedUser = new User("1", "John Doe", "john@example.com", 
                            new String[]{"journal1"}, new String[]{"snippet1"});
    }

    @Test
    void createUser_ShouldPersistUserSuccessfully() {
        // Given
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User createdUser = userService.createUser(testUser);

        // Then
        assertNotNull(createdUser.getId());
        assertEquals("John Doe", createdUser.getName());
        assertEquals("john@example.com", createdUser.getEmail());
        
        verify(userRepository).save(testUser);
    }

    @Test
    void getAllUsers_ShouldReturnAllPersistedUsers() {
        // Given
        List<User> users = Arrays.asList(savedUser, 
                new User("2", "Jane Smith", "jane@example.com", null, null));
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.getAllUsers();

        // Then
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(u -> u.getName().equals("John Doe")));
        assertTrue(result.stream().anyMatch(u -> u.getName().equals("Jane Smith")));
        
        verify(userRepository).findAll();
    }

    @Test
    void updateUser_WithValidData_ShouldPersistChanges() {
        // Given
        User updatedSavedUser = new User("1", "John Updated", "john.updated@example.com", 
                                        new String[]{"journal1", "journal2"}, 
                                        new String[]{"snippet1", "snippet2"});
        when(userRepository.findById("1")).thenReturn(Optional.of(savedUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedSavedUser);

        User updateData = new User(null, "John Updated", "john.updated@example.com", 
                                  new String[]{"journal1", "journal2"}, 
                                  new String[]{"snippet1", "snippet2"});

        // When
        Optional<User> updatedUser = userService.updateUser("1", updateData);

        // Then
        assertTrue(updatedUser.isPresent());
        assertEquals("John Updated", updatedUser.get().getName());
        assertEquals("john.updated@example.com", updatedUser.get().getEmail());
        assertEquals(2, updatedUser.get().getJournalEntries().length);
        assertEquals(2, updatedUser.get().getSnippets().length);

        verify(userRepository).findById("1");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deleteUser_WithValidId_ShouldRemoveFromDatabase() {
        // Given
        when(userRepository.existsById("1")).thenReturn(true);

        // When
        boolean deleted = userService.deleteUser("1");

        // Then
        assertTrue(deleted);
        verify(userRepository).existsById("1");
        verify(userRepository).deleteById("1");
    }

    @Test
    void addJournalEntry_ShouldPersistNewEntry() {
        // Given
        User updatedSavedUser = new User("1", "John Doe", "john@example.com", 
                                        new String[]{"journal1", "journal2"}, new String[]{"snippet1"});
        when(userRepository.findById("1")).thenReturn(Optional.of(savedUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedSavedUser);

        // When
        User updatedUser = userService.addJournalEntry("1", "journal2");

        // Then
        assertNotNull(updatedUser);
        assertEquals(2, updatedUser.getJournalEntries().length);
        assertEquals("journal2", updatedUser.getJournalEntries()[1]);

        verify(userRepository).findById("1");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void addSnippet_ShouldPersistNewSnippet() {
        // Given
        User updatedSavedUser = new User("1", "John Doe", "john@example.com", 
                                        new String[]{"journal1"}, new String[]{"snippet1", "snippet2"});
        when(userRepository.findById("1")).thenReturn(Optional.of(savedUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedSavedUser);

        // When
        User updatedUser = userService.addSnippet("1", "snippet2");

        // Then
        assertNotNull(updatedUser);
        assertEquals(2, updatedUser.getSnippets().length);
        assertEquals("snippet2", updatedUser.getSnippets()[1]);

        verify(userRepository).findById("1");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void operationsOnNonExistentUser_ShouldHandleGracefully() {
        // Given
        when(userRepository.findById("nonexistent")).thenReturn(Optional.empty());
        when(userRepository.existsById("nonexistent")).thenReturn(false);

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

        // Verify that methods were called appropriately
        verify(userRepository, atLeastOnce()).findById("nonexistent");
        verify(userRepository, atLeastOnce()).existsById("nonexistent");
    }
}

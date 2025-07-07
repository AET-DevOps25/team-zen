package com.example.user_microservice.service;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("1", "John Doe", "john@example.com", 
                           new String[]{"journal1"}, new String[]{"snippet1"});
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        List<User> users = Arrays.asList(testUser, 
                new User("2", "Jane Smith", "jane@example.com", null, null));
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.getAllUsers();

        // Then
        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getName());
        assertEquals("Jane Smith", result.get(1).getName());
        verify(userRepository).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Given
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.getUserById("1");

        // Then
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(userRepository).findById("1");
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldReturnEmpty() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUserById("999");

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findById("999");
    }

    @Test
    void createUser_ShouldSaveAndReturnUser() {
        // Given
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.createUser(testUser);

        // Then
        assertEquals("John Doe", result.getName());
        assertEquals("john@example.com", result.getEmail());
        verify(userRepository).save(testUser);
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateAndReturnUser() {
        // Given
        User updatedUser = new User("1", "John Updated", "john.updated@example.com", 
                                   new String[]{"journal1", "journal2"}, new String[]{"snippet1"});
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // When
        Optional<User> result = userService.updateUser("1", updatedUser);

        // Then
        assertTrue(result.isPresent());
        assertEquals("John Updated", result.get().getName());
        assertEquals("john.updated@example.com", result.get().getEmail());
        verify(userRepository).findById("1");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldReturnEmpty() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.updateUser("999", testUser);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findById("999");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldReturnTrue() {
        // Given
        when(userRepository.existsById("1")).thenReturn(true);

        // When
        boolean result = userService.deleteUser("1");

        // Then
        assertTrue(result);
        verify(userRepository).existsById("1");
        verify(userRepository).deleteById("1");
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnFalse() {
        // Given
        when(userRepository.existsById("999")).thenReturn(false);

        // When
        boolean result = userService.deleteUser("999");

        // Then
        assertFalse(result);
        verify(userRepository).existsById("999");
        verify(userRepository, never()).deleteById(anyString());
    }

    @Test
    void addJournalEntry_WhenUserExists_ShouldAddEntryAndReturnUser() {
        // Given
        User userWithNewEntry = new User("1", "John Doe", "john@example.com", 
                                        new String[]{"journal1", "journal2"}, new String[]{"snippet1"});
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(userWithNewEntry);

        // When
        User result = userService.addJournalEntry("1", "journal2");

        // Then
        assertNotNull(result);
        assertEquals(2, result.getJournalEntries().length);
        assertEquals("journal2", result.getJournalEntries()[1]);
        verify(userRepository).findById("1");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void addJournalEntry_WhenUserNotExists_ShouldReturnNull() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // When
        User result = userService.addJournalEntry("999", "journal2");

        // Then
        assertNull(result);
        verify(userRepository).findById("999");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void addJournalEntry_WhenUserHasNoEntries_ShouldCreateNewArray() {
        // Given
        User userWithoutEntries = new User("1", "John Doe", "john@example.com", null, null);
        User userWithEntry = new User("1", "John Doe", "john@example.com", 
                                     new String[]{"journal1"}, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(userWithoutEntries));
        when(userRepository.save(any(User.class))).thenReturn(userWithEntry);

        // When
        User result = userService.addJournalEntry("1", "journal1");

        // Then
        assertNotNull(result);
        assertEquals(1, result.getJournalEntries().length);
        assertEquals("journal1", result.getJournalEntries()[0]);
    }

    @Test
    void addSnippet_WhenUserExists_ShouldAddSnippetAndReturnUser() {
        // Given
        User userWithNewSnippet = new User("1", "John Doe", "john@example.com", 
                                          new String[]{"journal1"}, new String[]{"snippet1", "snippet2"});
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(userWithNewSnippet);

        // When
        User result = userService.addSnippet("1", "snippet2");

        // Then
        assertNotNull(result);
        assertEquals(2, result.getSnippets().length);
        assertEquals("snippet2", result.getSnippets()[1]);
        verify(userRepository).findById("1");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void addSnippet_WhenUserNotExists_ShouldReturnNull() {
        // Given
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        // When
        User result = userService.addSnippet("999", "snippet2");

        // Then
        assertNull(result);
        verify(userRepository).findById("999");
        verify(userRepository, never()).save(any(User.class));
    }
}

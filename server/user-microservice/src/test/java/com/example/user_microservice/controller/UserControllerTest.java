package com.example.user_microservice.controller;

import com.example.user_microservice.model.User;
import com.example.user_microservice.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("1", "John Doe", "john@example.com", 
                           new String[]{"journal1"}, new String[]{"snippet1"});
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() throws Exception {
        // Given
        List<User> users = Arrays.asList(testUser, 
                new User("2", "Jane Smith", "jane@example.com", null, null));
        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[0].email").value("john@example.com"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("Jane Smith"));

        verify(userService).getAllUsers();
    }

    @Test
    void getUser_WhenUserExists_ShouldReturnUser() throws Exception {
        // Given
        when(userService.getUserById("1")).thenReturn(Optional.of(testUser));

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.journalEntries.length()").value(1))
                .andExpect(jsonPath("$.journalEntries[0]").value("journal1"))
                .andExpect(jsonPath("$.snippets.length()").value(1))
                .andExpect(jsonPath("$.snippets[0]").value("snippet1"));

        verify(userService).getUserById("1");
    }

    @Test
    void getUser_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.getUserById("999")).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService).getUserById("999");
    }

    @Test
    void createUser_ShouldCreateAndReturnUser() throws Exception {
        // Given
        User newUser = new User(null, "Jane Smith", "jane@example.com", null, null);
        User savedUser = new User("2", "Jane Smith", "jane@example.com", null, null);
        when(userService.createUser(any(User.class))).thenReturn(savedUser);

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("2"))
                .andExpect(jsonPath("$.name").value("Jane Smith"))
                .andExpect(jsonPath("$.email").value("jane@example.com"));

        verify(userService).createUser(any(User.class));
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateAndReturnUser() throws Exception {
        // Given
        User updatedUser = new User("1", "John Updated", "john.updated@example.com", 
                                   new String[]{"journal1", "journal2"}, new String[]{"snippet1"});
        when(userService.updateUser(eq("1"), any(User.class))).thenReturn(Optional.of(updatedUser));

        // When & Then
        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("John Updated"))
                .andExpect(jsonPath("$.email").value("john.updated@example.com"))
                .andExpect(jsonPath("$.journalEntries.length()").value(2));

        verify(userService).updateUser(eq("1"), any(User.class));
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.updateUser(eq("999"), any(User.class))).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(put("/api/users/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isNotFound());

        verify(userService).updateUser(eq("999"), any(User.class));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldReturnNoContent() throws Exception {
        // Given
        when(userService.deleteUser("1")).thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser("1");
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.deleteUser("999")).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService).deleteUser("999");
    }

    @Test
    void addJournalEntry_WhenUserExists_ShouldReturnUpdatedUser() throws Exception {
        // Given
        User updatedUser = new User("1", "John Doe", "john@example.com", 
                                   new String[]{"journal1", "journal2"}, new String[]{"snippet1"});
        when(userService.addJournalEntry("1", "journal2")).thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(post("/api/users/1/journal-entries/journal2"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.journalEntries.length()").value(2))
                .andExpect(jsonPath("$.journalEntries[1]").value("journal2"));

        verify(userService).addJournalEntry("1", "journal2");
    }

    @Test
    void addJournalEntry_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.addJournalEntry("999", "journal2")).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/users/999/journal-entries/journal2"))
                .andExpect(status().isNotFound());

        verify(userService).addJournalEntry("999", "journal2");
    }

    @Test
    void addSnippet_WhenUserExists_ShouldReturnUpdatedUser() throws Exception {
        // Given
        User updatedUser = new User("1", "John Doe", "john@example.com", 
                                   new String[]{"journal1"}, new String[]{"snippet1", "snippet2"});
        when(userService.addSnippet("1", "snippet2")).thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(post("/api/users/1/snippets/snippet2"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.snippets.length()").value(2))
                .andExpect(jsonPath("$.snippets[1]").value("snippet2"));

        verify(userService).addSnippet("1", "snippet2");
    }

    @Test
    void addSnippet_WhenUserNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.addSnippet("999", "snippet2")).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/users/999/snippets/snippet2"))
                .andExpect(status().isNotFound());

        verify(userService).addSnippet("999", "snippet2");
    }
}

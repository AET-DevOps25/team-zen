package com.example.user_microservice.integration;

import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@AutoConfigureWebMvc
class UserMicroserviceIntegrationTest extends BaseIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    private String baseUrl;
    private User testUser;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api/users";
        userRepository.deleteAll();
        testUser = new User(null, "John Doe", "john@example.com", 
                           new String[]{"journal1"}, new String[]{"snippet1"});
    }

    @Test
    void createUser_ShouldReturnCreatedUser() {
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
                baseUrl, testUser, User.class);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        User createdUser = response.getBody();
        assertNotNull(createdUser);
        assertNotNull(createdUser.getId());
        assertEquals("John Doe", createdUser.getName());
        assertEquals("john@example.com", createdUser.getEmail());
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        restTemplate.postForObject(baseUrl, testUser, User.class);
        restTemplate.postForObject(baseUrl, 
                new User(null, "Jane Smith", "jane@example.com", null, null), User.class);

        // When
        ResponseEntity<List<User>> response = restTemplate.exchange(
                baseUrl, HttpMethod.GET, null, 
                new ParameterizedTypeReference<List<User>>() {});

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<User> users = response.getBody();
        assertNotNull(users);
        assertEquals(2, users.size());
        assertTrue(users.stream().anyMatch(u -> u.getName().equals("John Doe")));
        assertTrue(users.stream().anyMatch(u -> u.getName().equals("Jane Smith")));
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Given
        User createdUser = restTemplate.postForObject(baseUrl, testUser, User.class);

        // When
        ResponseEntity<User> response = restTemplate.getForEntity(
                baseUrl + "/" + createdUser.getId(), User.class);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        User foundUser = response.getBody();
        assertNotNull(foundUser);
        assertEquals(createdUser.getId(), foundUser.getId());
        assertEquals("John Doe", foundUser.getName());
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldReturnNotFound() {
        // When
        ResponseEntity<User> response = restTemplate.getForEntity(
                baseUrl + "/nonexistent", User.class);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void updateUser_WhenUserExists_ShouldReturnUpdatedUser() {
        // Given
        User createdUser = restTemplate.postForObject(baseUrl, testUser, User.class);
        User updateData = new User(null, "John Updated", "john.updated@example.com", 
                                  new String[]{"journal1", "journal2"}, 
                                  new String[]{"snippet1", "snippet2"});

        HttpEntity<User> requestEntity = new HttpEntity<>(updateData);

        // When
        ResponseEntity<User> response = restTemplate.exchange(
                baseUrl + "/" + createdUser.getId(), HttpMethod.PUT, 
                requestEntity, User.class);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        User updatedUser = response.getBody();
        assertNotNull(updatedUser);
        assertEquals(createdUser.getId(), updatedUser.getId());
        assertEquals("John Updated", updatedUser.getName());
        assertEquals("john.updated@example.com", updatedUser.getEmail());
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldReturnNotFound() {
        // Given
        HttpEntity<User> requestEntity = new HttpEntity<>(testUser);

        // When
        ResponseEntity<User> response = restTemplate.exchange(
                baseUrl + "/nonexistent", HttpMethod.PUT, 
                requestEntity, User.class);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void deleteUser_WhenUserExists_ShouldReturnNoContent() {
        // Given
        User createdUser = restTemplate.postForObject(baseUrl, testUser, User.class);

        // When
        ResponseEntity<Void> response = restTemplate.exchange(
                baseUrl + "/" + createdUser.getId(), HttpMethod.DELETE, 
                null, Void.class);

        // Then
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        
        // Verify user is deleted
        ResponseEntity<User> getResponse = restTemplate.getForEntity(
                baseUrl + "/" + createdUser.getId(), User.class);
        assertEquals(HttpStatus.NOT_FOUND, getResponse.getStatusCode());
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnNotFound() {
        // When
        ResponseEntity<Void> response = restTemplate.exchange(
                baseUrl + "/nonexistent", HttpMethod.DELETE, 
                null, Void.class);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void addJournalEntry_WhenUserExists_ShouldReturnUpdatedUser() {
        // Given
        User createdUser = restTemplate.postForObject(baseUrl, testUser, User.class);

        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
                baseUrl + "/" + createdUser.getId() + "/journal-entries/journal2", 
                null, User.class);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        User updatedUser = response.getBody();
        assertNotNull(updatedUser);
        assertEquals(2, updatedUser.getJournalEntries().length);
        assertEquals("journal2", updatedUser.getJournalEntries()[1]);
    }

    @Test
    void addJournalEntry_WhenUserNotExists_ShouldReturnNotFound() {
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
                baseUrl + "/nonexistent/journal-entries/journal1", 
                null, User.class);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void addSnippet_WhenUserExists_ShouldReturnUpdatedUser() {
        // Given
        User createdUser = restTemplate.postForObject(baseUrl, testUser, User.class);

        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
                baseUrl + "/" + createdUser.getId() + "/snippets/snippet2", 
                null, User.class);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        User updatedUser = response.getBody();
        assertNotNull(updatedUser);
        assertEquals(2, updatedUser.getSnippets().length);
        assertEquals("snippet2", updatedUser.getSnippets()[1]);
    }

    @Test
    void addSnippet_WhenUserNotExists_ShouldReturnNotFound() {
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
                baseUrl + "/nonexistent/snippets/snippet1", 
                null, User.class);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void fullUserLifecycle_ShouldWorkCorrectly() {
        // Create user
        ResponseEntity<User> createResponse = restTemplate.postForEntity(
                baseUrl, testUser, User.class);
        assertEquals(HttpStatus.OK, createResponse.getStatusCode());
        User createdUser = createResponse.getBody();
        assertNotNull(createdUser.getId());

        // Get user
        ResponseEntity<User> getResponse = restTemplate.getForEntity(
                baseUrl + "/" + createdUser.getId(), User.class);
        assertEquals(HttpStatus.OK, getResponse.getStatusCode());

        // Update user
        User updateData = new User(null, "John Updated", "john.updated@example.com", 
                                  new String[]{"journal1", "journal2"}, null);
        HttpEntity<User> updateEntity = new HttpEntity<>(updateData);
        ResponseEntity<User> updateResponse = restTemplate.exchange(
                baseUrl + "/" + createdUser.getId(), HttpMethod.PUT, 
                updateEntity, User.class);
        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());

        // Add journal entry
        ResponseEntity<User> addJournalResponse = restTemplate.postForEntity(
                baseUrl + "/" + createdUser.getId() + "/journal-entries/journal3", 
                null, User.class);
        assertEquals(HttpStatus.OK, addJournalResponse.getStatusCode());

        // Add snippet
        ResponseEntity<User> addSnippetResponse = restTemplate.postForEntity(
                baseUrl + "/" + createdUser.getId() + "/snippets/snippet2", 
                null, User.class);
        assertEquals(HttpStatus.OK, addSnippetResponse.getStatusCode());

        // Verify final state
        User finalUser = addSnippetResponse.getBody();
        assertNotNull(finalUser);
        assertEquals("John Updated", finalUser.getName());
        assertEquals(3, finalUser.getJournalEntries().length);
        assertEquals(2, finalUser.getSnippets().length);

        // Delete user
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
                baseUrl + "/" + createdUser.getId(), HttpMethod.DELETE, 
                null, Void.class);
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.getStatusCode());

        // Verify deletion
        ResponseEntity<User> finalGetResponse = restTemplate.getForEntity(
                baseUrl + "/" + createdUser.getId(), User.class);
        assertEquals(HttpStatus.NOT_FOUND, finalGetResponse.getStatusCode());
    }
}

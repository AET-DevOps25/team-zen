package com.example.user_microservice.e2e;

import com.example.user_microservice.integration.BaseIntegrationTest;
import com.example.user_microservice.model.User;
import com.example.user_microservice.repository.UserRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

class UserMicroserviceE2ETest extends BaseIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        userRepository.deleteAll();
    }

    @Test
    void createUser_ShouldReturnCreatedUserWithId() {
        User testUser = new User(null, "John Doe", "john@example.com", 
                                new String[]{"journal1"}, new String[]{"snippet1"});

        given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("id", notNullValue())
            .body("name", equalTo("John Doe"))
            .body("email", equalTo("john@example.com"))
            .body("journalEntries", hasSize(1))
            .body("journalEntries[0]", equalTo("journal1"))
            .body("snippets", hasSize(1))
            .body("snippets[0]", equalTo("snippet1"));
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        // Create test users
        User user1 = new User(null, "John Doe", "john@example.com", null, null);
        User user2 = new User(null, "Jane Smith", "jane@example.com", null, null);
        
        String user1Id = given()
            .contentType(ContentType.JSON)
            .body(user1)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        String user2Id = given()
            .contentType(ContentType.JSON)
            .body(user2)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        // Get all users
        given()
        .when()
            .get("/api/users")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("", hasSize(2))
            .body("id", hasItems(user1Id, user2Id))
            .body("name", hasItems("John Doe", "Jane Smith"));
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Create a user
        User testUser = new User(null, "John Doe", "john@example.com", 
                                new String[]{"journal1"}, new String[]{"snippet1"});
        
        String userId = given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        // Get the user
        given()
            .pathParam("userId", userId)
        .when()
            .get("/api/users/{userId}")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("id", equalTo(userId))
            .body("name", equalTo("John Doe"))
            .body("email", equalTo("john@example.com"))
            .body("journalEntries", hasSize(1))
            .body("snippets", hasSize(1));
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldReturnNotFound() {
        given()
            .pathParam("userId", "nonexistent")
        .when()
            .get("/api/users/{userId}")
        .then()
            .statusCode(404);
    }

    @Test
    void updateUser_WhenUserExists_ShouldReturnUpdatedUser() {
        // Create a user
        User testUser = new User(null, "John Doe", "john@example.com", 
                                new String[]{"journal1"}, new String[]{"snippet1"});
        
        String userId = given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        // Update the user
        User updateData = new User(null, "John Updated", "john.updated@example.com", 
                                  new String[]{"journal1", "journal2"}, 
                                  new String[]{"snippet1", "snippet2"});

        given()
            .contentType(ContentType.JSON)
            .pathParam("userId", userId)
            .body(updateData)
        .when()
            .put("/api/users/{userId}")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("id", equalTo(userId))
            .body("name", equalTo("John Updated"))
            .body("email", equalTo("john.updated@example.com"))
            .body("journalEntries", hasSize(2))
            .body("snippets", hasSize(2));
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldReturnNotFound() {
        User updateData = new User(null, "John Updated", "john.updated@example.com", null, null);

        given()
            .contentType(ContentType.JSON)
            .pathParam("userId", "nonexistent")
            .body(updateData)
        .when()
            .put("/api/users/{userId}")
        .then()
            .statusCode(404);
    }

    @Test
    void deleteUser_WhenUserExists_ShouldReturnNoContent() {
        // Create a user
        User testUser = new User(null, "John Doe", "john@example.com", null, null);
        
        String userId = given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        // Delete the user
        given()
            .pathParam("userId", userId)
        .when()
            .delete("/api/users/{userId}")
        .then()
            .statusCode(204);

        // Verify user is deleted
        given()
            .pathParam("userId", userId)
        .when()
            .get("/api/users/{userId}")
        .then()
            .statusCode(404);
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnNotFound() {
        given()
            .pathParam("userId", "nonexistent")
        .when()
            .delete("/api/users/{userId}")
        .then()
            .statusCode(404);
    }

    @Test
    void addJournalEntry_WhenUserExists_ShouldReturnUpdatedUser() {
        // Create a user
        User testUser = new User(null, "John Doe", "john@example.com", 
                                new String[]{"journal1"}, new String[]{"snippet1"});
        
        String userId = given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        // Add journal entry
        given()
            .pathParam("userId", userId)
            .pathParam("journalEntryId", "journal2")
        .when()
            .post("/api/users/{userId}/journal-entries/{journalEntryId}")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("id", equalTo(userId))
            .body("journalEntries", hasSize(2))
            .body("journalEntries", hasItems("journal1", "journal2"));
    }

    @Test
    void addJournalEntry_WhenUserNotExists_ShouldReturnNotFound() {
        given()
            .pathParam("userId", "nonexistent")
            .pathParam("journalEntryId", "journal1")
        .when()
            .post("/api/users/{userId}/journal-entries/{journalEntryId}")
        .then()
            .statusCode(404);
    }

    @Test
    void addSnippet_WhenUserExists_ShouldReturnUpdatedUser() {
        // Create a user
        User testUser = new User(null, "John Doe", "john@example.com", 
                                new String[]{"journal1"}, new String[]{"snippet1"});
        
        String userId = given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .extract().path("id");

        // Add snippet
        given()
            .pathParam("userId", userId)
            .pathParam("snippetId", "snippet2")
        .when()
            .post("/api/users/{userId}/snippets/{snippetId}")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("id", equalTo(userId))
            .body("snippets", hasSize(2))
            .body("snippets", hasItems("snippet1", "snippet2"));
    }

    @Test
    void addSnippet_WhenUserNotExists_ShouldReturnNotFound() {
        given()
            .pathParam("userId", "nonexistent")
            .pathParam("snippetId", "snippet1")
        .when()
            .post("/api/users/{userId}/snippets/{snippetId}")
        .then()
            .statusCode(404);
    }

    @Test
    void completeUserWorkflow_ShouldWorkEndToEnd() {
        // 1. Create user
        User testUser = new User(null, "Workflow User", "workflow@example.com", null, null);
        
        String userId = given()
            .contentType(ContentType.JSON)
            .body(testUser)
        .when()
            .post("/api/users")
        .then()
            .statusCode(200)
            .body("name", equalTo("Workflow User"))
            .extract().path("id");

        // 2. Get user to verify creation
        given()
            .pathParam("userId", userId)
        .when()
            .get("/api/users/{userId}")
        .then()
            .statusCode(200)
            .body("name", equalTo("Workflow User"));

        // 3. Add multiple journal entries
        given()
            .pathParam("userId", userId)
            .pathParam("journalEntryId", "journal1")
        .when()
            .post("/api/users/{userId}/journal-entries/{journalEntryId}")
        .then()
            .statusCode(200)
            .body("journalEntries", hasSize(1));

        given()
            .pathParam("userId", userId)
            .pathParam("journalEntryId", "journal2")
        .when()
            .post("/api/users/{userId}/journal-entries/{journalEntryId}")
        .then()
            .statusCode(200)
            .body("journalEntries", hasSize(2));

        // 4. Add multiple snippets
        given()
            .pathParam("userId", userId)
            .pathParam("snippetId", "snippet1")
        .when()
            .post("/api/users/{userId}/snippets/{snippetId}")
        .then()
            .statusCode(200)
            .body("snippets", hasSize(1));

        given()
            .pathParam("userId", userId)
            .pathParam("snippetId", "snippet2")
        .when()
            .post("/api/users/{userId}/snippets/{snippetId}")
        .then()
            .statusCode(200)
            .body("snippets", hasSize(2));

        // 5. Update user information
        User updateData = new User(null, "Updated Workflow User", "updated.workflow@example.com", 
                                  new String[]{"journal1", "journal2", "journal3"}, 
                                  new String[]{"snippet1", "snippet2", "snippet3"});

        given()
            .contentType(ContentType.JSON)
            .pathParam("userId", userId)
            .body(updateData)
        .when()
            .put("/api/users/{userId}")
        .then()
            .statusCode(200)
            .body("name", equalTo("Updated Workflow User"))
            .body("email", equalTo("updated.workflow@example.com"))
            .body("journalEntries", hasSize(3))
            .body("snippets", hasSize(3));

        // 6. Verify user appears in list
        given()
        .when()
            .get("/api/users")
        .then()
            .statusCode(200)
            .body("", hasSize(greaterThanOrEqualTo(1)))
            .body("name", hasItem("Updated Workflow User"));

        // 7. Delete user
        given()
            .pathParam("userId", userId)
        .when()
            .delete("/api/users/{userId}")
        .then()
            .statusCode(204);

        // 8. Verify user is deleted
        given()
            .pathParam("userId", userId)
        .when()
            .get("/api/users/{userId}")
        .then()
            .statusCode(404);
    }
}

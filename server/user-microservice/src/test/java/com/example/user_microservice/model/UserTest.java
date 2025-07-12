package com.example.user_microservice.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
    }

    @Test
    void testUserCreation() {
        User testUser = new User("1", "John Doe", "john@example.com", 
                                new String[]{"journal1", "journal2"}, 
                                new String[]{"snippet1"});
        
        assertEquals("1", testUser.getId());
        assertEquals("John Doe", testUser.getName());
        assertEquals("john@example.com", testUser.getEmail());
        assertArrayEquals(new String[]{"journal1", "journal2"}, testUser.getJournalEntries());
        assertArrayEquals(new String[]{"snippet1"}, testUser.getSnippets());
    }

    @Test
    void testDefaultConstructor() {
        User defaultUser = new User();
        assertNull(defaultUser.getId());
        assertNull(defaultUser.getName());
        assertNull(defaultUser.getEmail());
        assertNull(defaultUser.getJournalEntries());
        assertNull(defaultUser.getSnippets());
    }

    @Test
    void testSettersAndGetters() {
        user.setId("123");
        user.setName("Jane Smith");
        user.setEmail("jane@example.com");
        user.setJournalEntries(new String[]{"entry1"});
        user.setSnippets(new String[]{"snippet1", "snippet2"});

        assertEquals("123", user.getId());
        assertEquals("Jane Smith", user.getName());
        assertEquals("jane@example.com", user.getEmail());
        assertArrayEquals(new String[]{"entry1"}, user.getJournalEntries());
        assertArrayEquals(new String[]{"snippet1", "snippet2"}, user.getSnippets());
    }

    @Test
    void testEmptyArrays() {
        user.setJournalEntries(new String[]{});
        user.setSnippets(new String[]{});

        assertNotNull(user.getJournalEntries());
        assertNotNull(user.getSnippets());
        assertEquals(0, user.getJournalEntries().length);
        assertEquals(0, user.getSnippets().length);
    }

    @Test
    void testNullArrays() {
        user.setJournalEntries(null);
        user.setSnippets(null);

        assertNull(user.getJournalEntries());
        assertNull(user.getSnippets());
    }
}

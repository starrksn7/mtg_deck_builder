package org.deck_builder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude={SecurityAutoConfiguration.class})
public class DeckBuilderApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeckBuilderApplication.class, args);
    }

}

/** Tasks to complete
 * 1. Add pagination to search results, instead of returning all of them at once
 * 2. Verify functionality of all other ways to search for cards
 * 3. View a deck page
 * 4.   Set an active deck so all cards added to a deck go to that
 * 5. Login
 */
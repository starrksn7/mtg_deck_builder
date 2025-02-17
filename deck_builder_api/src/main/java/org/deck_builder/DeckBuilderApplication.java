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
 * 1. Verify function that adds card to deck
 * 2. Create a page to view a deck
 * 3. Incorporate some check that verifies if the deck is legal or not
 * 4. Set an active deck so all cards added to a deck go to that
 * 5. Login capabilities
 * 6. Style the pages
 */
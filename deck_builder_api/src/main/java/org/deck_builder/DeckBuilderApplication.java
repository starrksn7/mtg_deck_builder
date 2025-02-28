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
 * 1. Create a page to view a deck
 * 2. Incorporate some check that verifies if the deck is legal or not
 * 3. Set an active deck so all cards added to a deck go to that
 * 4. Login capabilities
 * 5. Style the pages
 */
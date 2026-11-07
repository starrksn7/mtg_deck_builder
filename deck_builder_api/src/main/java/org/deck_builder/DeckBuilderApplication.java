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
 * 1. maybe add some kind of message if a user tries to add a banned card to a deck?
 * 2. is it possible to add the flip ability for cards in the general search results?
 * 3. can i change this so that it allows users to search and do some things like that without
 *    being logged in. Creating and viewing decks should require login
 * 4. should I change the backgrounds to all match with a darker color?
 */
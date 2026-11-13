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
 * 2. can i change this so that it allows users to search and do some things like that without
 *    being logged in. Creating and viewing decks should require login
 * 3. Why are some of the images broken in the general search? It doesn't alwasy happen, but these link to
 *    scryfall, so this should be working
 */
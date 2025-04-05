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
 * 1. Incorporate some check that verifies if the deck is legal or not
 * 2. Set an active deck so all cards added to a deck go to that
 * 3. Login capabilities
 * 4. Style the pages
 * 5. Figure out a way to handle multiple commander, possibilities, like partner and background
 * 6. Figure out if I need to send an isPartner boolean from the ui or establish that value in the api
 * 7. Fix issue where decks page displays just the commander and the users page displays a list of cards
 *    that should be in the deck
 * 8. Function that was checking if a card was in the card table and adding it or not did not work,
 *    permitted duplicates to be added.
 */
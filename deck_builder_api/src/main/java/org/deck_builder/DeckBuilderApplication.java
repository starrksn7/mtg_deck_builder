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
 * 1. Style the pages
 *    a. Still need to sort out the single deck card display. Current issue is that the category is being counted as a
 *       card, so one card splits the category into one column and the card on the other side.
 * 2. Some kind of initial landing page would be nice, not sure what that would look like, can I make a page of
 *    dummy articles/images?
 *    a. Right now just using the user's deck page as the initial page after logging in
 * 3. Maybe change the image of the commander card for a deck in the deck page? Or add the full art image and use that
 *    instead of the normal card image.
 */
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
 *    a. the single deck page could still be better. the alignment of cards would be better if it just filled in and
 *       eventually spill over to another column, but right now it seems to wait for an entire category to fill out before
 *       changing sides of the grid.
 * 2. Some kind of initial landing page would be nice, not sure what that would look like, can I make a page of
 *    dummy articles/images?
 *    a. Right now just using the user's deck page as the initial page after logging in
 * 3. Maybe change the image of the commander card for a deck in the deck page? Or add the full art image and use that
 *    instead of the normal card image.
 */
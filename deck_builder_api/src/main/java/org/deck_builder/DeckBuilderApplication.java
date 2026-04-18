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
 *    a. the single deck page could still be fixed. the alignment of cards would be better if it just filled in and
 *       eventually spill over to another column, but right now it seems to wait for an entire category to fill out before
 *       changing sides of the grid.
 *    c. style the create a deck page
 * 2. Some kind of initial landing page would be nice, not sure what that would look like, can I make a page of
 *    dummy articles/images?
 * 3. Account creation enhancement
 *    a. Add something to verify password upon creating an account
 *    b. add username option
 * 4. Determine what columns to add to the db
 *    a. users
 *       i. add a username
 * 5. Maybe have a size max for the card display grid? Right now it finished an entire category of cards before going
 *    to the second column, but that leaves things unbalanced.
 * 6. Maybe change the image of the commander card for a deck in the deck page? Or add the full art image and use that
 *    instead of the normal card image.
 * 7. Add a link to register to the header if the person isn't logged in
 */
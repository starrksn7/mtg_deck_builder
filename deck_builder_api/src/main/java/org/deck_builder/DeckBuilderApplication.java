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
 * 1. Some kind of initial landing page would be nice, not sure what that would look like, can I make a page of
 *    dummy articles/images?
 *    a. What do i call this program?
 *       i. brainstorm
 *      ii. Untap, Upkeep, Draw
 *     iii. Move to combat
 *      iv. arcane encyclopedia
 * 2. Should probably change the style of the page to accommodate different screen sizes
 * 3. Partner selection
 *    i. need to verify the database is saving the color identity correctly
 * 4. something needs to handle the scenario where a commander search produces no results. Is there a fun card image
 *    I can use for this?
 * 5. maybe add some kind of message if a user tries to add a banned card?
 */
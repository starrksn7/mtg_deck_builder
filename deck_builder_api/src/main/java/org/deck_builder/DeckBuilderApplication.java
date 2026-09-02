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
 *    a. while I'm at it, increase the height of the banner commander image to better fit the size
 * 3. Need to figure out a way to incorporate partner/background/friends forever and all that similar stuff into
 *    the results search for a commander
 *    a. This is working, but needs further testing.
 *       i. Need to workout more specific partner options like partner with, partner - survivor
 *    b. need to limit the partner selections to those with only 'partner' and not the other partner caveats like
 *       sole survivor or
 * 4. The oracle text of cards when creating a deck kind of run together instead of appearing on a new line. This makes it harder
 *    to see what keywords/abilities each commander has
 * 5. something needs to handle the scenario where a commander search produces no results. Is there a fun card image
 *    I can use for this?
 * 6. maybe add some kind of message if a user tries to add a banned card?
 */
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
 *      ii. arcane encyclopedia
 * 2. Should probably change the style of the page to accommodate different screen sizes
 * 3. maybe add some kind of message if a user tries to add a banned card?
 * 4. investigate why the add collection would return a 400 error. too many cards at once?
 */
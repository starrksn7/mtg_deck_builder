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
 *    b. style the login screen
 *    c. style the create a deck page
 *    d. style the deck list page
 * 2. Some kind of initial landing page would be nice, not sure what that would look like, can I make a page of
 *    dummy articles/images?
 * 3. Account creation enhancement
 *    a. Add something to verify password upon creating an account
 *    b. add username option
 * 4. Determine what columns to add to the db
 *    a. users
 *       i. add a username
 * 6. Additionally, some kind of spinner to show that the page is thinking when submitting a collection would also be good
 */
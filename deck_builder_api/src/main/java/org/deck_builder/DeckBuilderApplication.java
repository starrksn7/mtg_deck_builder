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
 *    a. style the single deck page
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
 * 5. The ui might not be adding together all the cards of the same name correctly. For instance, added 3 swamps after
 *    9 were already on the list and the ui showed them in separate entries.
 * 6. The cards being displayed should be organized better, like by alphabetical or cmc order in each category or something.
 */
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
 * 5. When adding a collection to deck, some message that lets me know when some cards couldn't be found would be helpful
 *    a. update api to return collection result dto, this will contain both not_found and data arrays
 *    b. update the ui to accept the new collection results
 *       i. This will impact the add collection to deck on the single deck page, and when the deck tries to get
 *          prices. Can't remember right now, but the prices might only be added in the api to the results going to the ui.
 * 6. Additionally, some kind of spinner to show that the page is thinking when submitting a collection would also be good
 */
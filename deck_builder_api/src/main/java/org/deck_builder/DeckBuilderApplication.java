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
 *       a. add a username
 * 5. There's a brief error message that flickers when coming back to using the ui after leaving it previously and I
 *    click on 'my decks' before being routed to the login screen.
 * 6. Figure out why the messages that tell my deck isn't legal don't display correctly.
 * 7. Remove the prices from lands and don't count them in the overall cost of the deck
 * 8. use the newly added rarity info to display a count of cards by rarity
 * 9. use the game changer column to mark those cards somehow
 */
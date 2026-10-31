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
 * 1. maybe add some kind of message if a user tries to add a banned card to a deck?
 * 2. add search to the homepage for either decks or cards
 *   ii. definitely need to push the search results to their own page
 *       1. if the results have an exact match, send them directly to the single card page
 *       2. if there's more than one result, and no exact match, route to the results page. Clicking on any
 *          of these should route the user to a single deck page for those results.
 *          a. need to handle errors when there are no matching results.
 *       3. single page contents
 *          a. it would be cool to be able to flip the card image. Either way, both sides of the card's text should
 *             be displayed
 *
 */
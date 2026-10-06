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
 * 2. maybe add some kind of message if a user tries to add a banned card?
 * 3. add search to the homepage for either decks or cards
 *    i. maybe repurpose the dead searchbar component and search by card name and deck commander?
 *   ii. maybe change how the search works so that it doesn't just search by name, but returns a more
 *       broad search from scryfall based on the search term.
 *  iii. definitely need to push the search results to their own page
 *       1. if the results have an exact match, send them directly to the single card page
 *       2. if there's more than one result, and no exact match, route to the results page. Clicking on any
 *          of these should route the user to a single deck page for those results.
 *       3. if there's an exact match and more than one result, still send them to the single card page
 *       4. single page contents
 *          a. all of the card info in separate sections
 *          b. card price
 *          c. gatherer rulings, but I would need to figure out if there's a free gatherer api that I could pull
 *             this from. scryfall will give me the link to the actual gatherer site, but not the api.
 *             i. after some investigating it looks like I can get rulings from scryfall afterall. The route is
 *                <base scryfall api url>/cards/<scryfallId></scryfallId>/rulings
 *
 */
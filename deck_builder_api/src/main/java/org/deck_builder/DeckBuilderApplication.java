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
 * 3. Maybe include prices for cards? The scryfall response does include a prices array of objects that could be used
 *    but that likely wouldn't stay up to date if it was just saved in the db with the rest of the card data. Maybe
 *    pull this from the tcg player api somehow?
 * 4. Move scryfall api calls out of the card and deck jdbc and into a scryfall service instead
 */
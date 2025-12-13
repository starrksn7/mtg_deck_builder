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
 * 2. Change how quantity works. Make it a value in the submission and the text area in the ui will
 *    accept the quantity of the card instead of making the user list 35 basic lands or something like that.
 *    This might still make it necessary to add the cards to the database separately, but then it might also mean
 *    that I would need to change the delete logic to check if something is there more than once?
 *    a. add protection to keep people from being able to put in specialty cards/tokens
 * 3. Some kind of initial landing page would be nice, not sure what that would look like, can I make a page of
 *    dummy articles/images?
 * 4. Some kind of banner with login, create, view decks/user home page
 * --->a. make the banner just have login if they're not logged in, then logout, create, my decks when logged in
 */
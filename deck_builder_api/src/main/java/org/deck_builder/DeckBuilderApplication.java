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
 * 2. Should probably change the style of the page to accommodate different screen sizes
 * 3. Need to figure out a way to incorporate partner/background/friends forever and all that similar stuff into
 *    the results search for a commander
 *    a. background cards already show up in the search
 *    b. partner does the same thing
 * 4. Need to check out the error handling for when no search results were found. Currently getting an error
 */
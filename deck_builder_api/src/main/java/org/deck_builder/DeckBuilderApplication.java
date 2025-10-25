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
 * 1. Need to change the function checking color identity legality in the ui to allow for artifacts to go into the deck
 * 2. Need to group cards that you can have multiples of and include a number in front of each card showing the amount
 * in the deck
 * 3. Find a way to include current card prices?
 * 4. Style the pages
 */
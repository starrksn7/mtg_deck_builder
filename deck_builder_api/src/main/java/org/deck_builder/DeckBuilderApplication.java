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
 * 2. Figure out a way to make the commander stand out more, maybe a section specifically for that card and then
 *    sort all the other cards?
 * 3. Find a way to include current card prices?
 * 4. Style the pages
 */
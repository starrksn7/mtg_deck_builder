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
 * 1. Need to group cards that you can have multiples of and include a number in front of each card showing the amount
 *    in the deck
 * 2. Find a way to include current card prices?
 * 3. Maybe add a chart that will show the mana curve of the cards selected?
 * 4. Style the pages
 */
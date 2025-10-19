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
 * 1. There's an error when using the bulk card adder to a deck that causes an api crash when there's an empty line
 *    in the submission.
 * 2. Figure out a way to make the commander stand out more, maybe a section specifically for that card and then
 *    sort all the other cards?
 * 3. Style the pages
 */
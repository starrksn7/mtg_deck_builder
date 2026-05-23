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
 * 2. Maybe change the image of the commander card for a deck in the deck page? Or add the full art image and use that
 *    instead of the normal card image.
 * 3. Can I make a custom loading spinner that uses the five color symbols?
 * 4. Should probably change the style of the page to accommodate different screen sizes
 */
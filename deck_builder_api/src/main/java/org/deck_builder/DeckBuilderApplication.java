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
 * 2. Why are some of the images broken in the general search? It doesn't always happen, but these link to
 *    scryfall, so this should be working
 *    a. it looks like adventures are breaking
 *    b. same for cards with prepared spells
 *       i. is this because these have card_faces instead of the image just being there?
 *      ii. is it something else in the api not sending the right object to the ui?
 * 3. is there a better flipping animation that can be used? it's transition to the back card correctly, but
 *    it doesn't look like the card flips
 * 4. dare i attempt an advanced search feature?
 */
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
 * 1. Set an active deck so all cards added to a deck go to that
 * 2. Login capabilities
 * 3. Style the pages
 * 4. Figure out a way to handle multiple commander possibilities, like partner and background
 * 5. Figure out if I need to send an isPartner boolean from the ui or establish that value in the api
 * 6. Create a deck page
 */
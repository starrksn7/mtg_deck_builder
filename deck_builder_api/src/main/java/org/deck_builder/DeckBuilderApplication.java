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
 * 3. Account creation enhancement
 *    a. Add something to verify password upon creating an account
 *    b. add username option
 * 4. Determine what columns to add to the db
 *    a. users
 *       i. add a username
 *    b, cards
 *       i, columns for data from double faced cardsd
 * 5. The image for double faced cards is a problem and isn't showing it's mana value
 *    a. it looks like double faced cards have a different json structure, so I need to adapt to that
 *    b. Need to find out how dual faced cards work, like rooms, and possibly adjust for that too.
 *       i. From what I can tell, it looks like these cards have a "faces" property that contains information for each
 *          face like mana_cost, type_line, image_uri, name and oracle_text. This information can be saved from there.
 */
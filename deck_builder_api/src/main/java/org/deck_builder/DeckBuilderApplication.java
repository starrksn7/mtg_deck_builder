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
 *    a. while I'm at it, increase the height of the banner commander image to better fit the size
 * 3. Need to figure out a way to incorporate partner/background/friends forever and all that similar stuff into
 *    the results search for a commander
 *    a. background cards already show up in the search
 *    b. partner does the same thing
 *    c. Possible plan:
 *       i. When commander with partner is selected, offer a list of possible partners for it
 *          a. need to add a route to specifically get partner and partner like options options
 *          b. need to add a modal or new page to select the partner, background, friends forever, etc. option
 *          c. Also, need to create a route to call scryfall and get the options that coincide with this keyword in the
 *             chosen commander
 *      ii. Save to the database an id for the partner and a color identity for the partner
 *     iii. combine the two when checking in the ui, when a partner is chosen
 *      iv. I have added the is_partner, partner_id, and partner color identity values to the database
 *          and am sending them to the ui for this
 * 4. The banner image can now be changed, but sagas have a weird value for the art crop. Is there a way to fix this
 *    edge case?
 *
 */
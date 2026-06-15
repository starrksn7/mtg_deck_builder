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
 *       i. change the backend and table to save a list of commanders instead of a single commander
 *          A. this would involve changing the commander, imageLink and scryfallId to lists instead of single strings
 *          B. maybe make another class for this or save the card data instead?
 *      ii. when a person selects a commander that has a partnering keyword, display a list of options for them
 *          to select another commander
 *          A. need to create a scryfall result search that will specifically use the keyword that the original commander
 *             has to get possible options
 *          B. keep the commander deck from being created right away when one of the partnering keywords is present to allow
 *             the user to select a partner
 *          C. the ui will need a function to get the appropriate keyword
 *          D. api may need a new class with booleans for each partnering mechanic
 *          E. update commander detecting useMemo in the ui to detect more than one
 *          F. determine which image should be displayed in the deck page for the commander, maybe the creature?
 *             1. is this where I make the image default to a commander, but allow users to pick any full art image
 *                from their deck?
 *                a. can this be done by adding a new column to the deck information for the chosen bannder image, and update
 *                   it if the user changes it?  Probably should make the default a commander.
 *                b. I've started this and added an update to the api, need to get that info to the ui to use and create
 *                   a way to change to a different card picture
 *                   i. I added a small piece of state for the banner image in the ui. I need to alter the deck get route
 *                      so that it returns an object instead of just all of the cards so that the banner image link can be
 *                      returned as part of the object.
 *                  ii. I added the query to the dao and jdbc template, need to add a call from the controller
 *     iii. update the color identity check to look at both commanders
 *
 */
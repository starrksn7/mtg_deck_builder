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
 * 1. Maybe add a chart that will show the mana curve of the cards selected?
 *      a. need to figure out how to keep the chart from re-rendering after every key press in the text area
 *      b. need to figure out how to add entries for values in between what's in the object. so it shows all numbers
 * 2. Style the pages
 * 3. Change how quantity works. Make it a value in the submission and the text area in the ui will
 *    accept the quantity of the card instead of making the user list 35 basic lands or something like that.
 *    This might still make it necessary to add the cards to the database separately, but then it might also mean
 *    that I would need to change the delete logic to check if something is there more than once?
 */
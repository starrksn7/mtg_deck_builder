package org.deck_builder.controller;

import org.deck_builder.model.Card;
import org.deck_builder.model.CardSearchDTO;
import org.deck_builder.model.Deck;
import org.deck_builder.dao.DeckDao;
import org.deck_builder.model.DeckDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/decks")
@CrossOrigin
public class DeckController {
    private DeckDao deckDao;

    private DeckController(DeckDao deckDao){
        this.deckDao = deckDao;
    }

    @GetMapping(path="")
    public List<Card> getDeckById(@RequestParam int deckId){
        return deckDao.getDeckById(deckId);
    }

    @PostMapping(path="/create")
    public boolean createDeck(int userId, String deckName, CardSearchDTO cardDto){
        return deckDao.createDeck(userId, deckName, cardDto);
    }

    @PostMapping(path="/add")
    public boolean addCardToDeck(@RequestBody DeckDTO jsonBody){
        return deckDao.addCardToDeck(jsonBody.getDeckId(), jsonBody.getCardDto());
    }

    @PutMapping(path="/update")
    public boolean updateDeck(int id, String deckName, String commander){
        return deckDao.updateDeck(id, deckName, commander);
    }

    @GetMapping(path="/search")
    public List<Deck> searchForDeckByName(String deckName){
        return deckDao.searchForDeckByName(deckName);
    }

    @DeleteMapping(path="/remove")
    public boolean removeCardFromDeck(int deckId, int cardId){
        return deckDao.removeCardFromDeck(deckId, cardId);
    }

    @DeleteMapping(path="/deleteDeck")
    public boolean deleteDeck(int deckId){
        return deckDao.deleteDeck(deckId);
    }

}

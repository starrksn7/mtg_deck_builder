package org.deck_builder.controller;

import org.deck_builder.model.Deck;
import org.deck_builder.dao.DeckDao;
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

    @GetMapping(path = "")
    public List<Deck> findDecksByUser(String username){
        return deckDao.findDecksByUser(username);
    }

    @GetMapping(path="/get_by_id")
    public Deck getDeckById(int id){
        return deckDao.getDeckById(id);
    }

    @PostMapping(path="/create")
    public boolean createDeck(int userId, String deckName, String commander){
        return deckDao.createDeck(userId, deckName, commander);
    }

    @PostMapping(path="/add")
    public boolean addCardToDeck(int deckId, int cardId){
        return deckDao.addCardToDeck(deckId, cardId);
    }

    @PutMapping(path="/update")
    public boolean updateDeck(int id, String deckName, String commander){
        return deckDao.updateDeck(id, deckName, commander);
    }

    @GetMapping(path="/search")
    public List<Deck> searchForDeckByName(String name){
        return deckDao.searchForDeckByName(name);
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

package org.deck_builder.controller;

import org.deck_builder.model.*;
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

    @GetMapping(path="")
    public List<Card> getDeckById(@RequestParam int deckId){
        return deckDao.getDeckById(deckId);
    }

    @PostMapping(path="/create")
    public int createDeck(@RequestBody CreateDeckDTO createDeckDTO){
        return deckDao.createDeck(createDeckDTO.getUserId(), createDeckDTO.getDeckName(), createDeckDTO.getCardDTO());
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
    public boolean removeCardFromDeck(@RequestBody DeckDTO jsonBody){
        return deckDao.removeCardFromDeck(jsonBody.getDeckId(), jsonBody.getCardDto());
    }

    @DeleteMapping(path="/deleteDeck")
    public boolean deleteDeck(@RequestBody int deckId){
        return deckDao.deleteDeck(deckId);
    }

    @PostMapping(path="/addCollection")
    public List<Card> addCollectionToDeck(@RequestBody List<CardIdentifierDTO> cardIdentifierDTO){
        return deckDao.addCollectionToDeck(cardIdentifierDTO);
    }

}

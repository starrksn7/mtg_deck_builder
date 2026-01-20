package org.deck_builder.controller;

import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.*;
import org.deck_builder.dao.DeckDao;
import org.deck_builder.services.DeckService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/decks")
@CrossOrigin
public class DeckController {
    private DeckService deckService

    private DeckController(DeckService deckService){
        this.deckService = deckService;
    }

    @GetMapping(path="")
    public List<Card> getDeckById(@RequestParam int deckId){
        return deckService.getDeckById(deckId);
    }

    @PostMapping(path="/create")
    public int createDeck(@RequestBody CreateDeckDTO createDeckDTO){
        return deckService.createDeck(createDeckDTO);
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
    public List<String> addCollectionToDeck(@RequestBody AddToCollectionDTO addToCollectionDTO) throws MalformedJsonException {
        return deckDao.addCollectionToDeck(addToCollectionDTO.getDeckId(), addToCollectionDTO.getIdentifiers());
    }

}

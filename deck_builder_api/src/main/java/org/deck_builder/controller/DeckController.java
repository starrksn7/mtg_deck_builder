package org.deck_builder.controller;

import com.google.gson.JsonObject;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.*;
import org.deck_builder.dao.DeckDao;
import org.deck_builder.services.DeckService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/decks")
@CrossOrigin
public class DeckController {
    private DeckService deckService;

    private DeckController(DeckService deckService){
        this.deckService = deckService;
    }

    @GetMapping(path="")
    public Map<String, Object> getDeckById(@RequestParam int deckId){
        return deckService.getDeckById(deckId);
    }

    @PostMapping(path="/create")
    public int createDeck(@RequestBody CreateDeckDTO createDeckDTO){
        return deckService.createDeck(createDeckDTO);
    }

    @PostMapping(path="/add")
    public boolean addCardToDeck(@RequestBody DeckDTO jsonBody){
        return deckService.addCardToDeck(jsonBody);
    }

    @PutMapping(path="/update")
    public boolean updateDeck(@RequestBody DeckUpdateDTO dto){
        return deckService.updateDeck(dto.getDeckId(), dto.getBannerImage());
    }

    @GetMapping(path="/search")
    public List<Deck> searchForDeckByName(String deckName){
        return deckService.searchForDeckByName(deckName);
    }

    @DeleteMapping(path="/remove")
    public boolean removeCardFromDeck(@RequestBody DeckDTO jsonBody){
        return deckService.removeCardFromDeck(jsonBody);
    }

    @DeleteMapping(path="/deleteDeck")
    public boolean deleteDeck(@RequestBody int deckId){
        return deckService.deleteDeck(deckId);
    }

    @PostMapping(path="/addCollection")
    public List<String> addCollectionToDeck(@RequestBody AddToCollectionDTO addToCollectionDTO) throws MalformedJsonException {
        return deckService.addCollectionToDeck(addToCollectionDTO.getDeckId(), addToCollectionDTO.getIdentifiers());
    }

}

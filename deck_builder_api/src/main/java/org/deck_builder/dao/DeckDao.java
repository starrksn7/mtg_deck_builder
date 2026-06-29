package org.deck_builder.dao;


import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.*;

import java.util.List;

public interface DeckDao {

    List<Deck> findDecksByUser(int id);

    List<Card> getDeckById(int deckId);

    boolean addCardToDeck(int deckId, CardSearchDTO cardDto);

    boolean removeCardFromDeck(int deckId, CardSearchDTO cardDto);

    boolean updateDeck(DeckUpdateDTO deckUpdate);

    int createDeck(int userId, String deckName, CardSearchDTO cardDto);

    boolean deleteDeck(int deckId);

    List<Deck> searchForDeckByName(String deckName);

    String getDeckMetadata(int deckId);


}

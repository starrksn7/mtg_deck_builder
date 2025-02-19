package org.deck_builder.dao;


import org.deck_builder.model.Deck;

import java.util.List;

public interface DeckDao {

    List<Deck> findDecksByUser(String username);

    Deck getDeckById(int id);

    boolean addCardToDeck(int deckId, String scryfallId);

    boolean removeCardFromDeck(int deckId, int cardId);

    boolean updateDeck(int id, String deckName, String commander);

    boolean createDeck(int userId, String deckName, String commander);

    boolean deleteDeck(int deckId);

    List<Deck> searchForDeckByName(String deckName);
}

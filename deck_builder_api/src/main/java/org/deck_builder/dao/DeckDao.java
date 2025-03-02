package org.deck_builder.dao;


import org.deck_builder.model.CardSearchDTO;
import org.deck_builder.model.Deck;

import java.util.List;

public interface DeckDao {

    List<Deck> findDecksByUser(String username);

    Deck getDeckById(int id);

    boolean addCardToDeck(int deckId, CardSearchDTO cardDto);

    boolean removeCardFromDeck(int deckId, int cardId);

    boolean updateDeck(int id, String deckName, String commander);

    boolean createDeck(int userId, String deckName, CardSearchDTO cardDto);

    boolean deleteDeck(int deckId);

    List<Deck> searchForDeckByName(String deckName);

    void checkForCard(CardSearchDTO cardDto);
}

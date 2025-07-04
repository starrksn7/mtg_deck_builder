package org.deck_builder.dao;


import org.deck_builder.model.Card;
import org.deck_builder.model.CardIdentifierDTO;
import org.deck_builder.model.CardSearchDTO;
import org.deck_builder.model.Deck;

import java.util.List;

public interface DeckDao {

    List<Deck> findDecksByUser(int id);

    List<Card> getDeckById(int deckId);

    boolean addCardToDeck(int deckId, CardSearchDTO cardDto);

    boolean removeCardFromDeck(int deckId, CardSearchDTO cardDto);

    boolean updateDeck(int id, String deckName, String commander);

    int createDeck(int userId, String deckName, CardSearchDTO cardDto);

    boolean deleteDeck(int deckId);

    List<Deck> searchForDeckByName(String deckName);

    void checkForCard(CardSearchDTO cardDto);

    List<String> addCollectionToDeck(List<CardIdentifierDTO> cardIdentifierDTO);
}

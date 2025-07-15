package org.deck_builder.dao;

import com.google.gson.JsonObject;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.Card;
import org.deck_builder.model.CardIdentifierDTO;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;


public interface CardDao {
    List<String> searchForCardByName(String name) throws UnsupportedEncodingException;

    List<String> getCardsFromUri(String uri) throws IOException;

    Card mapResultToCard(JsonObject result);

    List<String> findCardByIdentityAndType(String[] colorIdentity, String type) throws UnsupportedEncodingException;

    List<String> getCardByColorAndCost(String colors, String manaCost) throws UnsupportedEncodingException;

    List<String> getCardByKeywordAndColors(String[] keyword, String colors) throws UnsupportedEncodingException;

    boolean addCardToDb(Card card);

    SqlRowSet getFromDb(String scryfallId);

    List<String> findCommanderByName(String name) throws UnsupportedEncodingException;

    List<String>  findCommanderByColors(String colors) throws UnsupportedEncodingException;

    List<String> getCardsFromCollection(List<CardIdentifierDTO> cardIdentifierDTO);

    List<String> addCollectionToDeck(int deckId, List<CardIdentifierDTO> cardIdentifierDTO) throws MalformedJsonException;
}
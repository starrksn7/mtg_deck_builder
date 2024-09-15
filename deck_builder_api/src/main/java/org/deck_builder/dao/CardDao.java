package org.deck_builder.dao;

import com.google.gson.JsonObject;
import org.deck_builder.model.Card;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;


public interface CardDao {
    List<Card> searchForCardByName(String name) throws UnsupportedEncodingException;

    String getCardsFromUri(String uri) throws IOException;

    Card mapResultToCard(JsonObject result);

    List<Card> findCardByIdentityAndType(String identity, String type) throws UnsupportedEncodingException;

    List<Card> getCardByColorAndCost(String colors, String manaCost) throws UnsupportedEncodingException;

    List<Card> getCardByKeyword(List<String> keywords) throws UnsupportedEncodingException;

    List<Card> getCardsByColors(String colors) throws UnsupportedEncodingException;

    List<Card> getCardsByColorIdentity(String colorIdentity) throws UnsupportedEncodingException;

    boolean addCardToDb(Card card);

    SqlRowSet getFromDb(String scryfallId);
}
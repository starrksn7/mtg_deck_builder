package org.deck_builder.dao;

import com.google.gson.JsonObject;
import org.deck_builder.model.Card;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;


public interface CardDao {
    List<String> searchForCardByName(String name) throws UnsupportedEncodingException;

    List<String> getCardsFromUri(String uri) throws IOException;

    Card mapResultToCard(JsonObject result);

    List<String> findCardByIdentityAndType(String colorIdentity, String type) throws UnsupportedEncodingException;

    List<String> getCardByColorAndCost(String colors, String manaCost) throws UnsupportedEncodingException;

    List<String> getCardByKeywordAndColors(String keyword, String colors) throws UnsupportedEncodingException;

    boolean addCardToDb(Card card);

    SqlRowSet getFromDb(String scryfallId);
}
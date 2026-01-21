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

    boolean addCardToDb(Card card);

    SqlRowSet getFromDb(String scryfallId);

}
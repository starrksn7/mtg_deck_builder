package org.deck_builder.dao;

import com.google.gson.*;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.Card;
import org.deck_builder.model.CardIdentifierDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;

@Component
public class JdbcCardDao implements CardDao{
    private final JdbcTemplate jdbcTemplate;

    public JdbcCardDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }
    private final String scryfallUrl = "https://api.scryfall.com";
    private final String uniqueOnly = "&unique=cards";
    private final String commanderLegal = "+format%3Acommander";

    public boolean addCardToDb(Card card){
        SqlRowSet getResults = getFromDb(card.getScryfallId());
        boolean cardExistsInDb = getResults.next();
        String insertSql = "INSERT INTO cards (card_name, scryfall_link, image_link, mana_cost, card_type, oracle_text, colors, color_identity, keywords, scryfall_id, cmc, game_changer, rarity, full_art_link)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        if (!cardExistsInDb) {
            jdbcTemplate.update(insertSql, card.getName(), card.getScryfallURL(), card.getImageLink(), card.getManaCost(), card.getType(),
                    card.getOracleText(), card.getColors(), card.getColorIdentity(), card.getKeywords(), card.getScryfallId(), card.getCmc(),
                    card.getGameChanger(), card.getRarity(), card.getFullArtLink());
            return true;
        }
        return false;
    }

    public SqlRowSet getFromDb(String scryfallId){
        String getSql = "SELECT scryfall_id FROM cards WHERE scryfall_id = ?;";
        return jdbcTemplate.queryForRowSet(getSql, scryfallId);
    }

}

package org.deck_builder.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.*;
import org.deck_builder.model.exceptions.DeckNotFoundException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcDeckDao implements DeckDao{
    private final JdbcCardDao jdbcCardDao;
    private final JdbcTemplate jdbcTemplate;

    public JdbcDeckDao(JdbcTemplate jdbcTemplate, JdbcCardDao jdbcCardDao){
        this.jdbcTemplate = jdbcTemplate;
        this.jdbcCardDao = jdbcCardDao;
    }

    public int createDeck(int userId, String deckName, CardSearchDTO cardDto){
        checkForCard(cardDto);
        String deckInsert = "INSERT INTO decks (deck_name, commander, is_partner, color_identity) VALUES (?, ?, ?, ?) RETURNING deck_id;";
        int deckId = jdbcTemplate.queryForObject(deckInsert, new Object[]{deckName, cardDto.getName(), cardDto.getIsPartner(), cardDto.getColorIdentity()},
        Integer.class);
        String userDeckMap = "INSERT INTO users_decks (user_id, deck_id) VALUES (?, ?);";
        jdbcTemplate.update(userDeckMap, userId, deckId);
        addCardToDeck(deckId, cardDto);
        return deckId;
    }

    public boolean deleteDeck(int deckId){
        String deckDelete = "DELETE FROM decks WHERE deck_id = ?;";
        String deleteFromMap = "DELETE FROM deck_cards WHERE deck_id = ?;";
        jdbcTemplate.update(deckDelete, deckId);
        jdbcTemplate.update(deleteFromMap, deckId);
        return true;
    }
    public List<Deck> searchForDeckByName(String deckName){
        String sql = "SELECT deck_name, commander FROM decks WHERE deck_name LIKE '%?%';";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, deckName);
        List<Deck> decks = new ArrayList<>();

        while(results.next()){
            decks.add(mapRowToDeck(results));
        }

        return decks;
    }

    public List<Deck> findDecksByUser(int id){
        String sql = "SELECT\n" +
                "    d.deck_id,\n" +
                "    d.deck_name,\n" +
                "    d.commander,\n" +
                "    c.scryfall_id,\n" +
                "    c.image_link\n" +
                "FROM decks d\n" +
                "JOIN users_decks ud ON ud.deck_id = d.deck_id\n" +
                "JOIN users u ON u.user_id = ud.user_id\n" +
                "JOIN cards c ON c.card_name = d.commander\n" +
                "WHERE u.user_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, id);
        List<Deck> decks = new ArrayList<>();

        while(results.next()){
            decks.add(mapRowToDeck(results));
        }
        return decks;
    }

    public List<Card> getDeckById(int deckId){
        String sql = "SELECT \n" +
                "    c.scryfall_id,\n" +
                "    c.card_name,\n" +
                "    c.scryfall_link,\n" +
                "    c.image_link,\n" +
                "    c.mana_cost,\n" +
                "    c.card_type,\n" +
                "    c.oracle_text,\n" +
                "    c.colors,\n" +
                "    c.color_identity AS card_color_identity,\n" +
                "    c.keywords,\n" +
                "    d.color_identity AS deck_color_identity,\n" +
                "    d.commander AS deck_commander,\n" +
                "    c.cmc, \n" +
                "    c.game_changer, \n" +
                "    c.rarity, \n" +
                "    c.full_art_link, \n" +
                "    COUNT(*) AS quantity, \n" +
                "    d.deck_name \n" +
                "FROM cards c\n" +
                "JOIN deck_cards dc ON dc.scryfall_id = c.scryfall_id\n" +
                "JOIN decks d ON d.deck_id = dc.deck_id\n" +
                "WHERE dc.deck_id = ?\n" +
                "GROUP BY \n" +
                "    c.scryfall_id,\n" +
                "    c.card_name,\n" +
                "    c.scryfall_link,\n" +
                "    c.image_link,\n" +
                "    c.mana_cost,\n" +
                "    c.card_type,\n" +
                "    c.oracle_text,\n" +
                "    c.colors,\n" +
                "    c.color_identity,\n" +
                "    c.keywords,\n" +
                "    d.color_identity,\n" +
                "    d.commander,\n" +
                "    c.cmc, \n" +
                "    c.game_changer, \n" +
                "    c.rarity, \n" +
                "    c.full_art_link, \n" +
                "    d.deck_name;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, deckId);
        List<Card> deckList = new ArrayList<>();
        while(result.next()){
            deckList.add(mapRowToCard(result));
        }

        if(deckList.isEmpty()) {
            throw new DeckNotFoundException();
        }
        

        return deckList;
    }

    public boolean updateDeck(int id, String deckName, String commander){
        String sql = "UPDATE decks SET deck_name = ?, commander = ? " +
                "WHERE deck_id = ?;";

        try {
            if(jdbcTemplate.update(sql, deckName, commander, id) == 1){
                return true;
            } else {
                System.err.println("This deck could not be updated");
                return false;
            }
        } catch (DeckNotFoundException d) {
            throw new DeckNotFoundException();
        }
    }

    public boolean addCardToDeck(int deckId, CardSearchDTO cardDto){
        checkForCard(cardDto);

        String sql = "INSERT INTO deck_cards (deck_id, scryfall_id) VALUES (?, ?);";
        Card card = new Card(cardDto.getScryfallId(), cardDto.getName(), cardDto.getScryfallURL(),
                cardDto.getImageLink(), cardDto.getManaCost(), cardDto.getType(), cardDto.getOracleText(),
                cardDto.getColors(), cardDto.getColorIdentity(), cardDto.getKeyword(), cardDto.getCmc(),
                cardDto.getGameChanger(), cardDto.getRarity(), cardDto.getFullArtLink());
        jdbcCardDao.addCardToDb(card);

        return jdbcTemplate.update(sql, deckId, cardDto.getScryfallId()) == 1;
    }

    public boolean removeCardFromDeck(int deckId, CardSearchDTO cardDto){
        String sql = "WITH to_delete AS (\n" +
                "  SELECT ctid\n" +
                "  FROM deck_cards\n" +
                "  WHERE deck_id = ? AND scryfall_id = ?\n" +
                "  LIMIT 1\n" +
                ")\n" +
                "DELETE FROM deck_cards\n" +
                "WHERE ctid IN (SELECT ctid FROM to_delete);";


        return jdbcTemplate.update(sql, deckId, cardDto.getScryfallId()) == 1;
    }


    private Deck mapRowToDeck(SqlRowSet row){
        Deck deck = new Deck();
        deck.setDeckName(row.getString("deck_name"));
        deck.setCommander(row.getString("commander"));
        deck.setDeckId(row.getInt("deck_id"));
        deck.setCommanderScryfallId(row.getString("scryfall_id"));
        deck.setImageLink(row.getString("image_link"));
        return deck;
    }

    private Card mapRowToCard(SqlRowSet row){
        Card card = new Card();
        card.setScryfallId(row.getString("scryfall_id"));
        card.setName(row.getString("card_name"));
        card.setScryfallURL(row.getString("scryfall_link"));
        card.setImageLink(row.getString("image_link"));
        card.setManaCost(row.getString("mana_cost"));
        card.setType(row.getString("card_type"));
        card.setOracleText(row.getString("oracle_text"));
        String colors = row.getString("colors");
        String regex = "[()\\[\\]{}\\s]";
        String cleanColors = colors.replaceAll(regex, "");
        card.setColors(cleanColors);
        String cardColorIdentity = row.getString("card_color_identity");
        String cleanColorIdentity = cardColorIdentity.replaceAll(regex, "");
        card.setColorIdentity(cleanColorIdentity.split(","));
        String keywords = row.getString("keywords");
        card.setKeywords(keywords.split(","));
        String deckColorIdentity = row.getString("deck_color_identity");
        String cleanDeckIdentity = deckColorIdentity.replaceAll(regex, "");
        card.setDeckColorIdentity(cleanDeckIdentity.split(","));
        card.setDeckCommander(row.getString("deck_commander"));
        card.setCmc(row.getBigDecimal("cmc"));
        card.setQuantity(row.getInt("quantity"));
        card.setDeckName(row.getString("deck_name"));
        return card;
    }

    public void checkForCard(CardSearchDTO cardDto){
        String checkSql = "SELECT scryfall_id from cards WHERE scryfall_id = ?;";

        SqlRowSet result = jdbcTemplate.queryForRowSet(checkSql, cardDto.getScryfallId());

        if(!result.next()){
            Card card = new Card(cardDto.getScryfallId(), cardDto.getName(), cardDto.getScryfallURL(),
                    cardDto.getImageLink(), cardDto.getManaCost(), cardDto.getType(), cardDto.getOracleText(),
                    cardDto.getColors(), cardDto.getColorIdentity(), cardDto.getKeyword(), cardDto.getCmc(),
                    cardDto.getGameChanger(), cardDto.getRarity(), cardDto.getFullArtLink());

            jdbcCardDao.addCardToDb(card);

        }
    }
}

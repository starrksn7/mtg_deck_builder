package org.deck_builder.dao;

import org.deck_builder.model.Card;
import org.deck_builder.model.CardSearchDTO;
import org.deck_builder.model.Deck;
import org.deck_builder.model.exceptions.DeckNotFoundException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;
@Component
public class JdbcDeckDao implements DeckDao{
    private JdbcCardDao jdbcCardDao;
    private final JdbcTemplate jdbcTemplate;

    public JdbcDeckDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean createDeck(int userId, String deckName, CardSearchDTO cardDto){
        checkForCard(cardDto);
        String deckInsert = "INSERT INTO decks (deck_name, commander, is_partner) VALUES (?, ?, ?) RETURNING deck_id;";
        int deckId = jdbcTemplate.update(deckInsert, deckName, cardDto.getName(), cardDto.getIsPartner());
        String userDeckMap = "INSERT INTO users_decks (user_id, deck_id) VALUES (?, ?);";
        jdbcTemplate.update(userDeckMap, userId, deckId);
        return true;
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
        String sql = "SELECT d.deck_name, d.commander, d.deck_id, c.scryfall_id, c.image_link FROM decks d " +
                "JOIN users_decks ud ON ud.deck_id = d.deck_id " +
                "JOIN users u ON u.user_id = ud.user_id " +
                "JOIN deck_cards dc ON d.deck_id = dc.deck_id " +
                "JOIN cards c ON c.scryfall_id = dc.scryfall_id " +
                "WHERE u.user_id = ? AND d.commander = c.card_name;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, id);
        List<Deck> decks = new ArrayList<>();

        while(results.next()){
            decks.add(mapRowToDeck(results));
        }
        System.out.println(decks.toString());
        return decks;
    }

    public List<Card> getDeckById(int deckId){
        String sql = "SELECT c.scryfall_id, card_name, scryfall_link, image_link, mana_cost, card_type, " +
                "oracle_text, colors, color_identity, keywords " +
                "FROM cards c " +
                "JOIN deck_cards dc ON dc.scryfall_id = c.scryfall_id " +
                "WHERE dc.deck_id = ?";
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

        return jdbcTemplate.update(sql, deckId, cardDto.getScryfallId()) == 1;
    }

    public boolean removeCardFromDeck(int deckId, int cardId){
        String sql = "DELETE FROM deck_cards WHERE deck_id = ? AND card_id = ?;";
        return jdbcTemplate.update(sql, deckId, cardId) == 1;
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
        card.setColors(colors.split(","));
        String colorIdentity = row.getString("color_identity");
        card.setColorIdentity(colorIdentity.split(","));
        String keywords = row.getString("keywords");
        card.setKeywords(keywords.split(","));

        return card;
    }

    public void checkForCard(CardSearchDTO cardDto){
        String checkSql = "SELECT scryfall_id from cards WHERE scryfall_id = ?;";

        SqlRowSet result = jdbcTemplate.queryForRowSet(checkSql, cardDto.getScryfallId());

        if(!result.next()){
            String insert = "INSERT INTO cards (scryfall_id, card_name, scryfall_link, image_link, mana_cost, " +
                    "card_type, oracle_text, colors, color_identity, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            jdbcTemplate.update(insert, cardDto.getScryfallId(), cardDto.getName(), cardDto.getScryfallURL(), cardDto.getImageLink(),
                    cardDto.getManaCost(), cardDto.getType(), cardDto.getOracleText(), cardDto.getColors(), cardDto.getColorIdentity(),
                    cardDto.getKeyword());
        }
    }
}

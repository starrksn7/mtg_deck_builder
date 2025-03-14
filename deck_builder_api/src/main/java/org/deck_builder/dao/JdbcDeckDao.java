package org.deck_builder.dao;

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
        //need to update this to pull scryfall_id from card table
        System.out.println("find deck by user was triggered!");
        String sql = "SELECT deck_name, commander, d.deck_id, scryfall_id FROM decks d " +
                "JOIN users_decks ud ON ud.deck_id = d.deck_id " +
                "JOIN users u ON u.user_id = ud.user_id " +
                "WHERE u.user_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, id);
        List<Deck> decks = new ArrayList<>();

        while(results.next()){
            decks.add(mapRowToDeck(results));
        }
        return decks;
    }

    public Deck getDeckById(int id){
        String sql = "SELECT deck_name, commander FROM decks WHERE deck_id = ?";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, id);

        if(result.next()){
            return mapRowToDeck(result);
        } else {
            throw new DeckNotFoundException();
        }
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
        return deck;
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

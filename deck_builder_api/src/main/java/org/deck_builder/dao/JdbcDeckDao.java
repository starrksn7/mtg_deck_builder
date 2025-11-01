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
                "    COUNT(*) AS quantity\n" +
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
                "    c.cmc;";
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
                cardDto.getColors().split(","), cardDto.getColorIdentity(), cardDto.getKeyword(), cardDto.getCmc());
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

    public List<String> addCollectionToDeck(int deckId, List<CardIdentifierDTO> cardIdentifierDTO) throws MalformedJsonException {
        List<String> scryfallCollectionResults = jdbcCardDao.getCardsFromCollection(cardIdentifierDTO);

        //This isn't what's going to get return in the end, I just need this as a place holder
        if(scryfallCollectionResults.get(0).equals("No cards found")){
            return jdbcCardDao.failedSearch();
        }

        for(String scryfallResult : scryfallCollectionResults){
            JsonObject jsonObject = JsonParser.parseString(scryfallResult).getAsJsonObject();
            CardSearchDTO cardSearchDTO = mapResultToCardSearchDTO(jsonObject);
            System.out.println("scryfallId = " + cardSearchDTO.getScryfallId());
            addCardToDeck(deckId, cardSearchDTO);
        }
        return scryfallCollectionResults;
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
        card.setColors(cleanColors.split(","));
        String cardColorIdentity = row.getString("card_color_identity");
        String cleanColorIdentity = cardColorIdentity.replaceAll(regex, "");
        card.setColorIdentity(cleanColorIdentity.split(","));
        String keywords = row.getString("keywords");
        card.setKeywords(keywords.split(","));
        String deckColorIdentity = row.getString("deck_color_identity");
        String cleanDeckIdentity = deckColorIdentity.replaceAll(regex, "");
        card.setDeckColorIdentity(cleanDeckIdentity.split(","));
        card.setDeckCommander(row.getString("deck_commander"));
        card.setQuantity(row.getInt("quantity"));
        card.setCmc(row.getFloat("cmc"));

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

    public CardSearchDTO mapResultToCardSearchDTO(JsonObject result){
        CardSearchDTO cardSearchDTO = new CardSearchDTO();
        cardSearchDTO.setScryfallId(result.get("id") != null ? result.get("id").getAsString() : null);
        String name = result.get("name") != null ? result.get("name").getAsString() : null;
        //regex to replace double quotes with single quotes
        cardSearchDTO.setName(name.replaceAll("\"(.*?)\"", "'$1'"));
        cardSearchDTO.setScryfallURL(result.get("scryfall_uri") != null ? result.get("scryfall_uri").getAsString() : null);
        JsonObject uris = (JsonObject) result.get("image_uris") != null ? result.get("image_uris").getAsJsonObject() : null;
        cardSearchDTO.setImageLink(uris != null ? uris.get("small").getAsString() : "");
        cardSearchDTO.setManaCost(result.get("mana_cost") != null ? result.get("mana_cost").getAsString() : "");
        cardSearchDTO.setType(result.get("type_line").getAsString());
        String oracleText = result.get("oracle_text") != null ? result.get("oracle_text").getAsString() : "";
        //regex to remove the line breaks
        oracleText = oracleText.replaceAll("\\n", " ");
        //regex to remove the escaping slashes
        oracleText = oracleText.replaceAll("\\\\", "");
        //regex to change double quotes to single quotes
        cardSearchDTO.setOracleText(oracleText.replaceAll("\"(.*?)\"", "'$1'"));
        JsonArray colors = (JsonArray) result.get("colors");
        String[] colorsArray = colors != null ? new String[colors.size()] : new String[0];
        if(colors != null) {
            for (int i = 0; i < colors.size(); i++) {
                colorsArray[i] = colors.get(i).getAsString();
            }
        }
        cardSearchDTO.setColors(String.join("", colorsArray));
        JsonArray colorIdentity = (JsonArray) result.get("color_identity");
        String[] identityArray = colorIdentity != null ? new String[colorIdentity.size()] : new String[0];
        if(colorIdentity != null){
            for (int i = 0; i < colorIdentity.size(); i++){
                identityArray[i] = colorIdentity.get(i).getAsString();
            }
        }
        cardSearchDTO.setColorIdentity(identityArray);
        JsonArray keywords = (JsonArray) result.get("keywords");
        String[] keywordsArray = keywords != null ? new String[keywords.size()] : new String[0];
        if(keywords != null){
            for (int i = 0; i < keywords.size(); i++){
                keywordsArray[i] = keywords.get(i).getAsString();
            }
        }
        cardSearchDTO.setKeyword(keywordsArray);
        return cardSearchDTO;
    }
}

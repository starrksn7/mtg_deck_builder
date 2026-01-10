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
                "    d.deck_name;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, deckId);
        List<Card> deckList = new ArrayList<>();
        while(result.next()){
            deckList.add(mapRowToCard(result));
        }

        if(deckList.isEmpty()) {
            throw new DeckNotFoundException();
        }

        /* This is where I need to build a json object using the scryfallIds from each card in the deck.
            It should use the same format as the collection POST request to scryfall. If the request is larger
            75 entries, then I'll have to make a second call to get the remaining cards. The ui will need to do the
            math to do any multiplication that is needed for duplicate cards.

            Once the card info is returned from scryfall, I can loop through the cards in the list and add the price
            to it, which is returned in "prices" and then "usd"
         */
        List<CardIdentifierDTO> cardIdsForPrice = new ArrayList<>();
        for(Card card : deckList){
           CardIdentifierDTO cardIdentifierDTO = new CardIdentifierDTO();
           cardIdentifierDTO.setId(card.getScryfallId());
           cardIdsForPrice.add(cardIdentifierDTO);
        }

        List<List<CardIdentifierDTO>> batches = chunk(cardIdsForPrice, 75);
        List<String> scryfallCollectionResults = new ArrayList<>();

        for (List<CardIdentifierDTO> batch : batches) {
            scryfallCollectionResults.addAll(
                    jdbcCardDao.getCardsFromCollection(batch)
            );
        }

        for (int i = 0; i < scryfallCollectionResults.size(); i++){
            String scryfallResult = scryfallCollectionResults.get(i);
            JsonObject jsonObject = JsonParser.parseString(scryfallResult).getAsJsonObject();
            CardSearchDTO cardSearchDTO = mapResultToCardSearchDTO(jsonObject);
            JsonObject prices = cardSearchDTO.getPrices();
            String priceInUSD = prices.get("usd").getAsString();

            Card card = deckList.get(i);
            card.setPrice(Double.parseDouble(priceInUSD));
            deckList.set(i, card);
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
                cardDto.getColors(), cardDto.getColorIdentity(), cardDto.getKeyword(), cardDto.getCmc());
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
        System.out.println("DTO received size = " + cardIdentifierDTO.size());
        List<String> scryfallCollectionResults = jdbcCardDao.getCardsFromCollection(cardIdentifierDTO);

        if(scryfallCollectionResults.isEmpty()){
            return jdbcCardDao.failedSearch();
        }

        for(String scryfallResult : scryfallCollectionResults){
            JsonObject jsonObject = JsonParser.parseString(scryfallResult).getAsJsonObject();
            CardSearchDTO cardSearchDTO = mapResultToCardSearchDTO(jsonObject);
            JsonObject legalities = cardSearchDTO.getLegalities();
            String commanderLegality = legalities.get("commander").getAsString();
            boolean isLegal = commanderLegality.equals("legal");
            if (!isLegal){
                continue;
            }
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
                    cardDto.getColors(), cardDto.getColorIdentity(), cardDto.getKeyword(), cardDto.getCmc());

            jdbcCardDao.addCardToDb(card);

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
        cardSearchDTO.setCmc(result.get("cmc").getAsBigDecimal());
        cardSearchDTO.setLegalities(result.get("legalities").getAsJsonObject());
        cardSearchDTO.setPrices(result.get("prices").getAsJsonObject());
        return cardSearchDTO;
    }

    private <T> List<List<T>> chunk(List<T> list, int size) {
        List<List<T>> chunks = new ArrayList<>();
        for (int i = 0; i < list.size(); i += size) {
            chunks.add(list.subList(i, Math.min(i + size, list.size())));
        }
        return chunks;
    }
}

package org.deck_builder.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.dao.CardDao;
import org.deck_builder.dao.DeckDao;
import org.deck_builder.dao.JdbcCardDao;
import org.deck_builder.dao.JdbcDeckDao;
import org.deck_builder.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DeckService {
    CardDao cardDao;
    DeckDao deckDao;
    CardService cardService;
    private final JdbcCardDao jdbcCardDao;

    public DeckService(CardDao cardDao, DeckDao deckDao, CardService cardService, JdbcCardDao jdbcCardDao){
        this.cardDao = cardDao;
        this.deckDao = deckDao;
        this.cardService = cardService;
        this.jdbcCardDao = jdbcCardDao;
    }

    public List<Card> addPricesToDeckList(List<Card> deckList) {
        List<CardIdentifierDTO> cardIdsForPrice = new ArrayList<>();

        for (Card card : deckList) {
            CardIdentifierDTO dto = new CardIdentifierDTO();
            dto.setId(card.getScryfallId());
            cardIdsForPrice.add(dto);
        }

        List<List<CardIdentifierDTO>> batches = chunk(cardIdsForPrice, 75);
        Map<String, Double> priceMap = new HashMap<>();

        for (List<CardIdentifierDTO> batch : batches) {
            CardCollectionResult result = cardService.getCardsFromCollection(batch);

            for (String scryfallResult : result.getFoundCards()) {
                JsonObject jsonObject = JsonParser.parseString(scryfallResult).getAsJsonObject();

                String id = jsonObject.get("id").getAsString();

                JsonObject prices = jsonObject.getAsJsonObject("prices");
                String priceStr = prices.get("usd").isJsonNull() ? "0" : prices.get("usd").getAsString();

                double price = (priceStr == null || priceStr.equals("null")) ? 0.0 : Double.parseDouble(priceStr);

                priceMap.put(id, price);
            }
        }

        // Apply prices back to deck
        for (Card card : deckList) {
            Double price = priceMap.get(card.getScryfallId());
            if (price != null) {
                card.setPrice(price);
            } else {
                card.setPrice(0.0); // or leave unchanged
            }
        }

        return deckList;
    }

    public List<String> addCollectionToDeck(int deckId, List<CardIdentifierDTO> cardIdentifierDTO)
            throws MalformedJsonException {

        CardCollectionResult collectionResult = cardService.getCardsFromCollection(cardIdentifierDTO);

        List<String> foundCards = collectionResult.getFoundCards();
        List<String> notFoundCards = collectionResult.getNotFoundCards();

        for (String scryfallResult : foundCards) {
            JsonObject jsonObject = JsonParser.parseString(scryfallResult).getAsJsonObject();

            CardSearchDTO cardSearchDTO = mapResultToCardSearchDTO(jsonObject);

            JsonObject legalities = cardSearchDTO.getLegalities();
            String commanderLegality = legalities.get("commander").getAsString();

            if (!"legal".equals(commanderLegality)) {
                continue;
            }

            Card card = new Card(
                    cardSearchDTO.getScryfallId(),
                    cardSearchDTO.getName(),
                    cardSearchDTO.getScryfallURL(),
                    cardSearchDTO.getImageLink(),
                    cardSearchDTO.getManaCost(),
                    cardSearchDTO.getType(),
                    cardSearchDTO.getOracleText(),
                    cardSearchDTO.getColors(),
                    cardSearchDTO.getColorIdentity(),
                    cardSearchDTO.getKeyword(),
                    cardSearchDTO.getCmc(),
                    cardSearchDTO.getGameChanger(),
                    cardSearchDTO.getRarity(),
                    cardSearchDTO.getFullArtLink(),
                    cardSearchDTO.getBackSideCardName(),
                    cardSearchDTO.getBackSideCardType(),
                    cardSearchDTO.getBackSideImage(),
                    cardSearchDTO.getBackSideManaCost(),
                    cardSearchDTO.getBackSideOracleText(),
                    cardSearchDTO.getBackSideColors(),
                    cardSearchDTO.getTwoCardFaces()
            );

            jdbcCardDao.addCardToDb(card);
            deckDao.addCardToDeck(deckId, cardSearchDTO);
        }

        return notFoundCards;
    }

    public CardSearchDTO mapResultToCardSearchDTO(JsonObject result){
        CardSearchDTO cardSearchDTO = new CardSearchDTO();
        cardSearchDTO.setScryfallId(result.get("id") != null ? result.get("id").getAsString() : null);
        cardSearchDTO.setScryfallURL(result.get("scryfall_uri") != null ? result.get("scryfall_uri").getAsString() : null);

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
        cardSearchDTO.setRarity(result.get("rarity").getAsString());
        cardSearchDTO.setGameChanger(result.get("game_changer").getAsBoolean());

        if (result.has("card_faces")){
            JsonArray faces = result.getAsJsonArray("card_faces");
            JsonObject front = faces.get(0).getAsJsonObject();
            JsonObject back = faces.get(1).getAsJsonObject();

            //get front side card info
            String name = front.get("name") != null ? front.get("name").getAsString() : null;
            //regex to replace double quotes with single quotes
            cardSearchDTO.setName(name.replaceAll("\"(.*?)\"", "'$1'"));
            JsonObject uris = (JsonObject) front.get("image_uris") != null ? front.get("image_uris").getAsJsonObject() : null;
            cardSearchDTO.setImageLink(uris != null ? uris.get("normal").getAsString() : "");
            cardSearchDTO.setFullArtLink(uris != null ? uris.get("art_crop").getAsString() : "");
            cardSearchDTO.setManaCost(front.get("mana_cost") != null ? front.get("mana_cost").getAsString() : "");
            cardSearchDTO.setType(front.get("type_line").getAsString());
            String oracleText = front.get("oracle_text") != null ? front.get("oracle_text").getAsString() : "";
            //regex to remove the line breaks
            oracleText = oracleText.replaceAll("\\n", " ");
            //regex to remove the escaping slashes
            oracleText = oracleText.replaceAll("\\\\", "");
            //regex to change double quotes to single quotes
            cardSearchDTO.setOracleText(oracleText.replaceAll("\"(.*?)\"", "'$1'"));
            JsonArray colors = (JsonArray) front.get("colors");
            String[] colorsArray = colors != null ? new String[colors.size()] : new String[0];
            if(colors != null) {
                for (int i = 0; i < colors.size(); i++) {
                    colorsArray[i] = colors.get(i).getAsString();
                }
            }
            cardSearchDTO.setColors(String.join(",", colorsArray));

            //get backside card info
            String backSideCardName = back.get("name") != null ? back.get("name").getAsString() : null;
            //regex to replace double quotes with single quotes
            cardSearchDTO.setBackSideCardName(backSideCardName.replaceAll("\"(.*?)\"", "'$1'"));
            JsonObject backSideUris = (JsonObject) back.get("image_uris") != null ? back.get("image_uris").getAsJsonObject() : null;
            cardSearchDTO.setBackSideImage(backSideUris != null ? backSideUris.get("normal").getAsString() : "");
            cardSearchDTO.setBackSideManaCost(back.get("mana_cost") != null ? back.get("mana_cost").getAsString() : "");
            cardSearchDTO.setBackSideCardType(back.get("type_line") != null ? back.get("type_line").getAsString() : "");
            String backSideOracleText = back.get("oracle_text") != null ? back.get("oracle_text").getAsString() : "";
            //regex to remove the line breaks
            backSideOracleText = backSideOracleText.replaceAll("\\n", " ");
            //regex to remove the escaping slashes
            backSideOracleText = backSideOracleText.replaceAll("\\\\", "");
            //regex to change double quotes to single quotes
            cardSearchDTO.setBackSideOracleText(backSideOracleText.replaceAll("\"(.*?)\"", "'$1'"));
            JsonArray backSideColors = (JsonArray) back.get("colors");
            String[] backSideColorsArray = backSideColors != null ? new String[backSideColors.size()] : new String[0];
            if(backSideColors != null) {
                for (int i = 0; i < backSideColors.size(); i++) {
                    backSideColorsArray[i] = backSideColors.get(i).getAsString();
                }
            }
            cardSearchDTO.setBackSideColors(String.join(",", backSideColorsArray));
            cardSearchDTO.setTwoCardFaces(true);
        } else {
            String name = result.get("name") != null ? result.get("name").getAsString() : null;
            //regex to replace double quotes with single quotes
            cardSearchDTO.setName(name.replaceAll("\"(.*?)\"", "'$1'"));
            JsonObject uris = (JsonObject) result.get("image_uris") != null ? result.get("image_uris").getAsJsonObject() : null;
            cardSearchDTO.setImageLink(uris != null ? uris.get("normal").getAsString() : "");
            cardSearchDTO.setFullArtLink(uris != null ? uris.get("art_crop").getAsString() : "");
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
            cardSearchDTO.setColors(String.join(",", colorsArray));
        }

        return cardSearchDTO;
    }

    private <T> List<List<T>> chunk(List<T> list, int size) {
        List<List<T>> chunks = new ArrayList<>();
        for (int i = 0; i < list.size(); i += size) {
            chunks.add(list.subList(i, Math.min(i + size, list.size())));
        }
        return chunks;
    }

    public List<Card> getDeckById(int deckId){
        List<Card> deckList = deckDao.getDeckById(deckId);

        return addPricesToDeckList(deckList);
    }

    public int createDeck(CreateDeckDTO createDeckDTO){
        CardSearchDTO dto = createDeckDTO.getCardDTO();
        Card card = new Card(dto.getScryfallId(), dto.getName(), dto.getScryfallURL(), dto.getImageLink(),
                dto.getManaCost(), dto.getType(), dto.getOracleText(), dto.getColors(), dto.getColorIdentity(),
                dto.getKeyword(), dto.getCmc(), dto.getGameChanger(), dto.getRarity(), dto.getFullArtLink(), dto.getBackSideCardName(),
                dto.getBackSideCardType(), dto.getBackSideImage(), dto.getBackSideManaCost(), dto.getBackSideOracleText(),
                dto.getBackSideColors(), dto.getTwoCardFaces());
        cardDao.addCardToDb(card);

        return deckDao.createDeck(
                createDeckDTO.getUserId(),
                createDeckDTO.getDeckName(),
                dto
        );
    }

    public boolean addCardToDeck(DeckDTO deckDTO){
        return deckDao.addCardToDeck(deckDTO.getDeckId(), deckDTO.getCardDto());
    }

    public boolean updateDeck(int id, String deckName, String commander){
        return deckDao.updateDeck(id, deckName, commander);
    }

    public List<Deck> searchForDeckByName(String deckName){
        return deckDao.searchForDeckByName(deckName);
    }

    public boolean removeCardFromDeck(DeckDTO deckDTO){
        return deckDao.removeCardFromDeck(deckDTO.getDeckId(), deckDTO.getCardDto());
    }

    public boolean deleteDeck(int deckId){
        return deckDao.deleteDeck(deckId);
    }


}

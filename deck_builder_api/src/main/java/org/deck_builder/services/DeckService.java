package org.deck_builder.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.dao.CardDao;
import org.deck_builder.dao.DeckDao;
import org.deck_builder.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeckService {
    CardDao cardDao;
    DeckDao deckDao;
    CardService cardService;

    public DeckService(CardDao cardDao, DeckDao deckDao, CardService cardService){
        this.cardDao = cardDao;
        this.deckDao = deckDao;
        this.cardService = cardService;
    }

    public List<Card> addPricesToDeckList(List<Card> deckList){
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
                    cardService.getCardsFromCollection(batch)
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

    public List<String> addCollectionToDeck(int deckId, List<CardIdentifierDTO> cardIdentifierDTO) throws MalformedJsonException {
        System.out.println("DTO received size = " + cardIdentifierDTO.size());
        List<String> scryfallCollectionResults = cardService.getCardsFromCollection(cardIdentifierDTO);

        if(scryfallCollectionResults.isEmpty()){
            return cardService.failedSearch();
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
            deckDao.addCardToDeck(deckId, cardSearchDTO);
        }
        return scryfallCollectionResults;
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
        cardSearchDTO.setRarity(result.get("rarity").getAsString());
        cardSearchDTO.setGameChanger(result.get("game_changer").getAsBoolean());
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
        return deckDao.createDeck(createDeckDTO.getUserId(), createDeckDTO.getDeckName(), createDeckDTO.getCardDTO());
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

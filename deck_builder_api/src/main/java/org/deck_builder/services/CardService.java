package org.deck_builder.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.dao.CardDao;
import org.deck_builder.model.Card;
import org.deck_builder.model.CardSearchDTO;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class CardService {

    CardDao cardDao;
    private final String scryfallUrl = "https://api.scryfall.com";
    private final String uniqueOnly = "&unique=cards";
    private final String commanderLegal = "+format%3Acommander";

    public CardService (CardDao cardDao){
        this.cardDao = cardDao;
    }

    public List<String> searchForCardByName(CardSearchDTO cardSearchDTO) throws UnsupportedEncodingException {
        String name = cardSearchDTO.getName();
        String encodedName = URLEncoder.encode(name, "UTF-8");
        String uri = scryfallUrl + "/cards/search?q=" + encodedName + commanderLegal + uniqueOnly ;
        try {
            System.out.println(uri);
            List<String> searchResults = getCardsFromUri(uri);
            //failed searches return an array that's just [No cards found]
            if(searchResults.get(0).equals("No cards found")){
                return failedSearch();
            }
            return parseSearchResults(searchResults);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> getCardsFromUri(String uri) throws IOException {
        try {
            List<String> dataSets = new ArrayList<>();
            URL scryfallUrl = new URL(uri);
            HttpURLConnection conn = (HttpURLConnection) scryfallUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                throw new RuntimeException("HttpResponseCode: " + responseCode);
            }

            Scanner scanner = new Scanner(scryfallUrl.openStream());
            while(true){
                StringBuilder body = new StringBuilder();
                while (scanner.hasNext()) {
                    body.append(scanner.nextLine());
                }
                dataSets.add(String.valueOf(body));
                JsonObject jsonObject = new JsonParser().parse(String.valueOf(body)).getAsJsonObject();

                if(!jsonObject.get("has_more").getAsBoolean()){
                    break;
                }

                scryfallUrl = new URL(jsonObject.get("next_page").getAsString());
                scanner = new Scanner(scryfallUrl.openStream());
            }

            scanner.close();
            return dataSets;
        } catch (IOException | RuntimeException e) {
            /*
            When there is no search results, it causes an error and goes to this catch
            I need to make the data returned below into good json and have the rest of my
            functions check for that before sending the response to the ui
             */
            List<String> errorMessage = new ArrayList<>();
            errorMessage.add("No cards found");
            return errorMessage;
        }

    }

    public List<String> parseSearchResults(List<String> searchResults) throws MalformedJsonException {
        ArrayList<String> result = new ArrayList<>();
        for(String dataSet : searchResults){
            JsonObject jsonObject = new JsonParser().parse(dataSet).getAsJsonObject();
            JsonArray jsonCards = (JsonArray) jsonObject.get("data");

            for(int i = 0; i < jsonCards.size(); i+=1){
                JsonObject tempObj = (JsonObject) jsonCards.get(i);
                result.add(mapResultToCard(tempObj).toJsonString());
            }
        }

        return result;
    }

    public Card mapResultToCard(JsonObject result){
        String scryfallId = result.get("id") != null ? result.get("id").getAsString() : null;
        String name = result.get("name") != null ? result.get("name").getAsString() : null;
        //regex to replace double quotes with single quotes
        name = name.replaceAll("\"(.*?)\"", "'$1'");
        String scryfallUri = result.get("scryfall_uri") != null ? result.get("scryfall_uri").getAsString() : null;
        JsonObject uris = (JsonObject) result.get("image_uris") != null ? result.get("image_uris").getAsJsonObject() : null;
        String imageLink = uris != null ? uris.get("small").getAsString() : "";
        String manaCost = result.get("mana_cost") != null ? result.get("mana_cost").getAsString() : "";
        String type = result.get("type_line").getAsString();
        String oracleText = result.get("oracle_text") != null ? result.get("oracle_text").getAsString() : "";
        //regex to remove the line breaks
        oracleText = oracleText.replaceAll("\\n", " ");
        //regex to remove the escaping slashes
        oracleText = oracleText.replaceAll("\\\\", "");
        //regex to change double quotes to single quotes
        oracleText = oracleText.replaceAll("\"(.*?)\"", "'$1'");

        JsonArray colorsArray = result.getAsJsonArray("colors");
        String colors = "";

        if (colorsArray != null) {
            List<String> list = new ArrayList<>();
            for (JsonElement c : colorsArray) {
                list.add(c.getAsString());
            }
            colors = String.join(",", list);
        }
        JsonArray colorIdentity = (JsonArray) result.get("color_identity");
        String[] identityArray = colorIdentity != null ? new String[colorIdentity.size()] : new String[0];
        if (colorIdentity != null) {
            for (int i = 0; i < colorIdentity.size(); i++) {
                identityArray[i] = colorIdentity.get(i).getAsString();
            }
        }

        JsonArray keywords = (JsonArray) result.get("keywords");
        String[] keywordsArray = keywords != null ? new String[keywords.size()] : new String[0];
        if(keywords != null){
            for (int i = 0; i < keywords.size(); i++){
                keywordsArray[i] = keywords.get(i).getAsString();
            }
        }
        BigDecimal cmc = result.get("cmc").getAsBigDecimal();
        Card newCard = new Card(scryfallId, name, scryfallUri, imageLink, manaCost, type, oracleText, colors, identityArray, keywordsArray, cmc);
        cardDao.addCardToDb(newCard);
        return newCard;
    }

    public List<String> failedSearch(){
        JsonObject object = new JsonObject();
        object.addProperty("error", "No cards found");
        List<String> failedSearch = new ArrayList<>();
        failedSearch.add(object.toString());
        return failedSearch;
    }
}

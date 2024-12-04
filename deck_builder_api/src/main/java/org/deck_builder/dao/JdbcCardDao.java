package org.deck_builder.dao;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.model.Card;
import org.json.simple.JSONObject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
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
    String scryfallUrl = "https://api.scryfall.com";
    public List<String> searchForCardByName(String name) throws UnsupportedEncodingException {
        String encodedName = URLEncoder.encode(name, "UTF-8");
        String uri = scryfallUrl + "/cards/search?q=" + encodedName;
        try {
            System.out.println(uri);
            String searchResults = getCardsFromUri(uri);
            System.out.println(searchResults);
            return parseSearchResults(searchResults);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String getCardsFromUri(String uri) throws IOException {

        URL expansionsListUrl = new URL(uri);
        HttpURLConnection conn = (HttpURLConnection) expansionsListUrl.openConnection();
        conn.setRequestMethod("GET");
        conn.connect();

        int responsecode = conn.getResponseCode();
        if (responsecode != 200) {
            throw new RuntimeException("HttpResponseCode: " + responsecode);
        }

        StringBuilder body = new StringBuilder();
        Scanner scanner = new Scanner(expansionsListUrl.openStream());

        while (scanner.hasNext()) {
            body.append(scanner.nextLine());
        }
        scanner.close();
        return String.valueOf(body);
    }

    //Just like below the identity needs to be the official name for a combo, like azorious for blue & white or just the single color
    public List<String> findCardByIdentityAndType(String identity, String type) throws UnsupportedEncodingException{
        String encodedIdentity = "id%3A" + identity;
        String encodedType = "t%3A" + type;
        String uri = scryfallUrl + "/cards/search?q=" + encodedIdentity + "+" + encodedType;
        try {
            String searchResults = getCardsFromUri(uri);
            return parseSearchResults(searchResults);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    //This function needs manaCost to be a string that is a number, due to the scryfall api for searching by cost and color appending a
    //number to the url, but needing to combine strings to make the url.  Search results from scryfall will still have mana_cost as a string, so most other places
    //like the card object and the constructor for card need to have manaCost still set as a string
    //
    //Unlike other functions, the scryfall api needs the colors variable to be one string, but not be the name for the identity
    //So black is just b and red to be r.  The colors variable for black and red should be br not rakdos
    public List<String> getCardByColorAndCost(String colors, String manaCost) throws UnsupportedEncodingException{
        String uri = scryfallUrl + "/cards/search?q=c%3" + colors + "+mv%3D" + manaCost;
        try {
            String searchResults = getCardsFromUri(uri);
            return parseSearchResults(searchResults);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> getCardByKeyword(List<String> keywords) throws UnsupportedEncodingException {
        String uri= scryfallUrl + "cards/search?q=";
        try {
            for(int i = 0; i < keywords.size(); i++){
                if(i == keywords.size() - 1){
                    uri += keywords.get(i);
                } else {
                    uri += keywords.get(i) + "+";
                }
            }
            String searchResults = getCardsFromUri(uri);
            return parseSearchResults(searchResults);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    //The colors variable going into this should be a single compact string of all of the single letter color identifiers
    //i.e. blue and white = 'uw'
    public List<String> getCardsByColors(String colorIdentity) throws UnsupportedEncodingException {
        String uri = scryfallUrl + "cards/search?q=3%A" + colorIdentity;
        try {
            String searchResults = getCardsFromUri(uri);
            return parseSearchResults(searchResults);
        } catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    //This string requires the single color, if applcable, spelled out, or the term for the combination of colors
    // like rakdos, esper or bant to go through
    public List<String> getCardsByColorIdentity(String colors) throws UnsupportedEncodingException {
        String uri = scryfallUrl + "cards/search?q=id<%3D" + colors;
        try {
            String searchResults = getCardsFromUri(uri);
            return parseSearchResults(searchResults);
        } catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    public boolean addCardToDb(Card card){
        SqlRowSet getResults = getFromDb(card.getScryfallId());
        String insertSql = "INSERT INTO cards (card_name, scryfall_link, image_link, mana_cost, card_type, oracle_text, colors, color_identity, keywords, scryfall_id)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        if (!getResults.next()) {
            jdbcTemplate.queryForRowSet(insertSql, card.getName(), card.getScryfallURL(), card.getImageLink(), card.getManaCost(), card.getType(),
                    card.getOracleText(), card.getColors(), card.getColorIdentity(), card.getKeywords(), card.getScryfallId());
            return true;
        }
        return false;
    }

    public SqlRowSet getFromDb(String scryfallId){
        String getSql = "SELECT scryfall_id from cards;";
        return jdbcTemplate.queryForRowSet(getSql);
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
        JsonArray colors = (JsonArray) result.get("colors");
        String[] colorsArray = colors != null ? new String[colors.size()] : new String[0];
        if(colors != null) {
            for (int i = 0; i < colors.size(); i++) {
                colorsArray[i] = colors.get(i).getAsString();
            }
        }

        JsonArray colorIdentity = (JsonArray) result.get("color_identity");
        String[] identityArray = colorIdentity != null ? new String[colorIdentity.size()] : new String[0];
        if(colorIdentity != null){
            for (int i = 0; i < colorIdentity.size(); i++){
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

        return new Card(scryfallId, name, scryfallUri, imageLink, manaCost, type, oracleText, colorsArray, identityArray, keywordsArray);
    }

    public List<String> parseSearchResults(String searchResults) throws MalformedJsonException{
        //Writing some psuedo code to figure out what I need to do to paginate results
        //I need to check the has_more value exists in the results before the data array. has_more is a single boolean
        //If that value is present, add the original results to a list and then call the getCardsFromURI
        //method using the value of the next_page key. This will all need to be in a loop so that it keeps recurring until the value I'm watching
        //is null. Once that happens, I can begin to parse the results that are in the list, adding each
        //individual card to the result list.
        JsonObject jsonObject = new JsonParser().parse(searchResults).getAsJsonObject();
        JsonArray jsonCards = (JsonArray) jsonObject.get("data");

        ArrayList<String> result = new ArrayList<>();
        if(jsonObject.get("has_more") != null){
            ArrayList<JsonArray> dataSets = new ArrayList<>();
            dataSets.add((JsonArray) jsonObject.get("data"));
            
            while(true){

            }
        } else {
            for(int i = 0; i < jsonCards.size(); i+=1){
                JsonObject tempObj = (JsonObject) jsonCards.get(i);
                result.add(mapResultToCard(tempObj).toJsonString());
            }
        }

        return removeDuplicatesByName(result);
    }

    public List<String> removeDuplicatesByName(List<String> searchResults) throws MalformedJsonException {
        try {
            Set<String> seenNames = new HashSet<>();
            List<String> result = new ArrayList<>();

            for (String card : searchResults) {
                JsonObject jsonObject = new JsonParser().parse(card).getAsJsonObject();
                if(jsonObject.get("name") != null){
                    String cardName = jsonObject.get("name").getAsString();
                    if (!seenNames.contains(cardName)) {
                        seenNames.add(cardName);
                        result.add(card);
                    }
                }
            }

            return result;
        } catch (Exception error){
            throw error;
        }
    }
    //original parseSearchResults function before I started working on pagination
//    public List<String> parseSearchResults(String searchResults) throws MalformedJsonException{
//        JsonObject jsonObject = new JsonParser().parse(searchResults).getAsJsonObject();
//        JsonArray jsonCards = (JsonArray) jsonObject.get("data");
//
//        ArrayList<String> result = new ArrayList<>();
//
//        for(int i = 0; i < jsonCards.size(); i+=1){
//            JsonObject tempObj = (JsonObject) jsonCards.get(i);
//            result.add(mapResultToCard(tempObj).toJsonString());
//        }
//        return removeDuplicatesByName(result);
//    }
}

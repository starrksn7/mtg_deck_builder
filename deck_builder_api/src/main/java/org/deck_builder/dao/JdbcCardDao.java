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
    private final String scryfallUrl = "https://api.scryfall.com";
    private final String uniqueOnly = "&unique=cards";
    private final String commanderLegal = "+format%3Acommander";
    public List<String> searchForCardByName(String name) throws UnsupportedEncodingException {
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

    //Just like below the identity needs to be the official name for a combo, like azorious for blue & white or just the single color
    public List<String> findCardByIdentityAndType(String colorIdentity, String type) throws UnsupportedEncodingException{
        String encodedIdentity = "id%3A" + colorIdentity;
        String encodedType = "t%3A" + type;
        String uri = scryfallUrl + "/cards/search?q=" + encodedIdentity + "+" + encodedType + commanderLegal + uniqueOnly;
        System.out.println(uri);
        try {
            List<String> searchResults = getCardsFromUri(uri);
            if(searchResults.get(0).equals("No cards found")){
                return failedSearch();
            }
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
        String uri = scryfallUrl + "/cards/search?q=c%3A" + colors + "+mv%3D" + manaCost + commanderLegal + uniqueOnly;
        System.out.println(uri);
        try {
            List<String> searchResults = getCardsFromUri(uri);
            if(searchResults.get(0).equals("No cards found")){
                return failedSearch();
            }
            return parseSearchResults(searchResults);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> getCardByKeywordAndColors(String keyword, String colors) throws UnsupportedEncodingException {
        String uri= scryfallUrl + "/cards/search?q=kw%3A" + keyword + "+c%3A" + colors + commanderLegal + uniqueOnly;
        System.out.println(uri);
        try {
            List<String> searchResults = getCardsFromUri(uri);
            if(searchResults.get(0).equals("No cards found")){
                return failedSearch();
            }
            return parseSearchResults(searchResults);
        } catch (IOException e) {
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

    public List<String> searchForCommander(String name, String colors) throws UnsupportedEncodingException {
        String commanderForUri = "is%3Acommander";
        String encodedName = URLEncoder.encode(name, "UTF-8");

        String searchUri = scryfallUrl + "/cards/search?q=" + encodedName + "+c%3A" + colors + "+" +commanderForUri + uniqueOnly;
        System.out.println(searchUri);
        try {
            List<String> results = getCardsFromUri(searchUri);
            return parseSearchResults(results);
        } catch(IOException e){
            throw new RuntimeException(e);
        }
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

    public List<String> parseSearchResults(List<String> searchResults) throws MalformedJsonException{
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

    public List<String> failedSearch(){
        JsonObject object = new JsonObject();
        object.addProperty("error", "No cards found");
        List<String> failedSearch = new ArrayList<>();
        failedSearch.add(object.toString());
        return failedSearch;
    }
}

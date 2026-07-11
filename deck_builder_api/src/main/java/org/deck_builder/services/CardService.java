package org.deck_builder.services;

import com.google.gson.*;
import com.google.gson.stream.MalformedJsonException;
import org.deck_builder.dao.CardDao;
import org.deck_builder.model.Card;
import org.deck_builder.model.CardCollectionResult;
import org.deck_builder.model.CardIdentifierDTO;
import org.deck_builder.model.CardSearchDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
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
                List<String> noCardsFound = new ArrayList<>();
                String noCards = "No cards found";
                noCardsFound.add(noCards);
                return noCardsFound;
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

    public CardCollectionResult getCardsFromCollection(List<CardIdentifierDTO> cardIdentifierDTO) {
        try {
            List<String> foundCards = new ArrayList<>();
            List<String> notFoundCards = new ArrayList<>();

            String collectionUrl = "https://api.scryfall.com/cards/collection";
            URL scryfallUrl = new URL(collectionUrl);
            HttpURLConnection conn = (HttpURLConnection) scryfallUrl.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");

            Gson gson = new Gson();
            Map<String, List<CardIdentifierDTO>> requestMap = new HashMap<>();
            requestMap.put("identifiers", cardIdentifierDTO);

            String jsonBody = gson.toJson(requestMap);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            Scanner scanner = new Scanner(conn.getInputStream()).useDelimiter("\\A");
            String responseBody = scanner.hasNext() ? scanner.next() : "";
            scanner.close();

            JsonObject jsonObject = JsonParser.parseString(responseBody).getAsJsonObject();

            //Found cards
            JsonArray dataArray = jsonObject.getAsJsonArray("data");
            if (dataArray != null) {
                for (JsonElement element : dataArray) {
                    foundCards.add(element.toString());
                }
            }

            //Not found cards
            JsonArray notFoundArray = jsonObject.getAsJsonArray("not_found");
            if (notFoundArray != null) {
                for (JsonElement element : notFoundArray) {
                    JsonObject notFoundObj = element.getAsJsonObject();

                    if (notFoundObj.has("name")) {
                        notFoundCards.add(notFoundObj.get("name").getAsString());
                    } else {
                        notFoundCards.add(notFoundObj.toString());
                    }
                }
            }

            return new CardCollectionResult(foundCards, notFoundCards);

        } catch (IOException | RuntimeException e) {
            e.printStackTrace();
            return new CardCollectionResult(
                    List.of(),
                    List.of("{\"error\": \"No cards found or request failed.\"}")
            );
        }
    }

    public List<String> getCardByKeywordAndColors(String[] keyword, String colors) throws UnsupportedEncodingException {
        String uri= scryfallUrl + "/cards/search?q=kw%3A" + Arrays.toString(keyword) + "+c%3A" + colors + commanderLegal + uniqueOnly;
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

    public List<String> findCardByIdentityAndType(String[] colorIdentity, String type) throws UnsupportedEncodingException{
        String encodedIdentity = "id%3A" + Arrays.toString(colorIdentity);
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

    public List<String> parseSearchResults(List<String> searchResults) throws MalformedJsonException {
        ArrayList<String> result = new ArrayList<>();
        for(String dataSet : searchResults){
            JsonObject jsonObject = new JsonParser().parse(dataSet).getAsJsonObject();
            JsonArray jsonCards = (JsonArray) jsonObject.get("data");

            for(int i = 0; i < jsonCards.size(); i+=1){
                JsonObject tempObj = (JsonObject) jsonCards.get(i);
                Gson gson = new Gson();
                Card card = mapResultToCard(tempObj);
                result.add(gson.toJson(card));
            }
        }

        return result;
    }

    public List<String> findCommanderByColors(String colors) throws UnsupportedEncodingException {
        String commanderForUri = "is%3Acommander";
        String colorSearch = "+id%3D" + colors;
        String searchUri = scryfallUrl + "/cards/search?q=" + colorSearch + "+" +commanderForUri;
        System.out.println(searchUri);
        try {
            List<String> results = getCardsFromUri(searchUri);
            return parseSearchResults(results);
        } catch(IOException e){
            throw new RuntimeException(e);
        }
    }

    public List<String> findCommanderByName(String searchTerm) throws UnsupportedEncodingException {
        String commanderForUri = "is%3Acommander";
        String encodedSearchTerm = URLEncoder.encode(searchTerm, "UTF-8");

        String searchUri = scryfallUrl + "/cards/search?q=" + encodedSearchTerm + "+" +commanderForUri;
        System.out.println(searchUri);
        try {
            List<String> results = getCardsFromUri(searchUri);
            if(results.get(0).equals("No cards found")){
                return failedSearch();
            }
            return parseSearchResults(results);
        } catch(IOException e){
            throw new RuntimeException(e);
        }
    }

    public boolean addCardToDb(Card card){ return cardDao.addCardToDb(card); }

    public List<String> getPartnerOptions(String partnerKeyword) throws IOException {
        //need to fill in logic here, find the scryfall search for this
        List<String> searchResults = new ArrayList<>();
        if (partnerKeyword.equals("background")){
            String backgroundSearch = "/cards/search?q=type%3Abackground&unique=cards&as=grid&order=name";
            String fullUri = scryfallUrl + backgroundSearch;
            searchResults = getCardsFromUri(fullUri);
        } else if (partnerKeyword.equals("partner")){
            String partnerSearch = "/cards/search?q=keyword%3Apartner&unique=cards&as=grid&order=name";
            String fullUri = scryfallUrl + partnerSearch;
            searchResults = getCardsFromUri(fullUri);
        }
        return parseSearchResults(searchResults);
    }

    public Card mapResultToCard(JsonObject result){
        String scryfallId = result.get("id") != null ? result.get("id").getAsString() : null;
        String scryfallUri = result.get("scryfall_uri") != null ? result.get("scryfall_uri").getAsString() : null;

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
        String rarity = result.get("rarity").getAsString();
        boolean gameChanger = result.get("game_changer").getAsBoolean();

        if (result.has("card_faces")){
            JsonArray faces = result.getAsJsonArray("card_faces");
            JsonObject front = faces.get(0).getAsJsonObject();
            JsonObject back = faces.get(1).getAsJsonObject();

            //Get the info for the front side of the card
            String name = front.get("name") != null ? front.get("name").getAsString() : null;
            //regex to replace double quotes with single quotes
            name = name.replaceAll("\"(.*?)\"", "'$1'");
            String manaCost = front.get("mana_cost") != null ? front.get("mana_cost").getAsString() : "";
            String type = front.get("type_line").getAsString();
            String oracleText = front.get("oracle_text") != null ? front.get("oracle_text").getAsString() : "";
            //regex to remove the line breaks
            oracleText = oracleText.replaceAll("\\n", " ");
            //regex to remove the escaping slashes
            oracleText = oracleText.replaceAll("\\\\", "");
            //regex to change double quotes to single quotes
            oracleText = oracleText.replaceAll("\"(.*?)\"", "'$1'");
            JsonArray colorsArray = front.getAsJsonArray("colors");
            String colors = "";

            if (colorsArray != null) {
                List<String> list = new ArrayList<>();
                for (JsonElement c : colorsArray) {
                    list.add(c.getAsString());
                }
                colors = String.join(",", list);
            }

            JsonObject uris = (JsonObject) front.get("image_uris") != null ? front.get("image_uris").getAsJsonObject() : null;
            String imageLink = uris != null ? uris.get("normal").getAsString() : "";
            String fullArtLink = uris != null ? uris.get("art_crop").getAsString() : "";

            //Get the info for the back side of the card
            boolean twoFaces = true;
            String backSideCardName = back.get("name") != null ? back.get("name").getAsString() : null;
            //regex to replace double quotes with single quotes
            backSideCardName = backSideCardName.replaceAll("\"(.*?)\"", "'$1'");
            String backSideManaCost = back.get("mana_cost") != null ? back.get("mana_cost").getAsString() : "";
            String backSideCardType = back.get("type_line").getAsString();
            String backSideOracleText = back.get("oracle_text") != null ? back.get("oracle_text").getAsString() : "";
            //regex to remove the line breaks
            backSideOracleText = backSideOracleText.replaceAll("\\n", " ");
            //regex to remove the escaping slashes
            backSideOracleText = backSideOracleText.replaceAll("\\\\", "");
            //regex to change double quotes to single quotes
            backSideOracleText = backSideOracleText.replaceAll("\"(.*?)\"", "'$1'");

            //Need to add backSideColors to the db before proceeding with this
            JsonArray backSideColorsArray = back.getAsJsonArray("colors");
            String backSideColors = "";

            if (backSideColorsArray != null) {
                List<String> list = new ArrayList<>();
                for (JsonElement c : backSideColorsArray) {
                    list.add(c.getAsString());
                }
                backSideColors = String.join(",", list);
            }

            JsonObject backSideUris = (JsonObject) back.get("image_uris") != null ? back.get("image_uris").getAsJsonObject() : null;
            String backSideImage = backSideUris != null ? backSideUris.get("normal").getAsString() : "";

            Card newCard = new Card(scryfallId, name, scryfallUri, imageLink, manaCost, type, oracleText, colors, identityArray,
                    keywordsArray, cmc, gameChanger, rarity, fullArtLink, backSideCardName, backSideCardType, backSideImage,
                    backSideManaCost, backSideOracleText, backSideColors, twoFaces);

            return newCard;

        } else {
            String name = result.get("name") != null ? result.get("name").getAsString() : null;
            //regex to replace double quotes with single quotes
            name = name.replaceAll("\"(.*?)\"", "'$1'");
            JsonObject uris = (JsonObject) result.get("image_uris") != null ? result.get("image_uris").getAsJsonObject() : null;
            String imageLink = uris != null ? uris.get("normal").getAsString() : "";
            String fullArtLink = uris != null ? uris.get("art_crop").getAsString() : "";
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

            Card newCard = new Card(scryfallId, name, scryfallUri, imageLink, manaCost, type, oracleText, colors, identityArray, keywordsArray, cmc, gameChanger, rarity, fullArtLink);

            return newCard;
        }
    }

    public List<String> failedSearch(){
        JsonObject object = new JsonObject();
        object.addProperty("error", "No cards found");
        List<String> failedSearch = new ArrayList<>();
        failedSearch.add(object.toString());
        return failedSearch;
    }
}

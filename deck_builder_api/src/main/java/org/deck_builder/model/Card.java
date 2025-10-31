package org.deck_builder.model;

import com.google.gson.annotations.SerializedName;

import java.util.Arrays;

public class Card {
    @SerializedName("id")
    private int id;
    @SerializedName("scryfall_id")
    private String scryfallId;
    @SerializedName("name")
    private String name;
    @SerializedName("scryfall_uri")
    private String scryfallURL;
    @SerializedName("image_uris")
    private String imageLink;
    @SerializedName("mana_cost")
    private String manaCost;
    @SerializedName("type_line")
    private String type;
    @SerializedName("oracle_text")
    private String oracleText;
    @SerializedName("colors")
    private String[] colors;
    @SerializedName("color_identity")
    private String[] colorIdentity;
    @SerializedName("keywords")
    private String[] keywords;
    @SerializedName("deck_color_identity")
    private String[] deckColorIdentity;
    @SerializedName("deck_commander")
    private String deckCommander;
    @SerializedName("quantity")
    private int quantity;
    @SerializedName("cmc")
    private float cmc;

    public Card (String scryfallId, String name, String scryfallURL, String imageLink, String manaCost, String type, String oracleText, String[] colors, String[] colorIdentity, String[] keywords){
        this.scryfallId = scryfallId;
        this.name = name;
        this.scryfallURL = scryfallURL;
        this.imageLink = imageLink;
        this.manaCost = manaCost;
        this.type = type;
        this.oracleText = oracleText;
        this.colors = colors;
        this.colorIdentity = colorIdentity;
        this.keywords = keywords;
    }

    public Card(){
    };

    public int getId(){
        return id;
    }

    public void setId(int id){
        this.id = id;
    }

    public String getScryfallId(){
        return scryfallId;
    }

    public void setScryfallId(String scryfallId){
        this.scryfallId = scryfallId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScryfallURL() {
        return scryfallURL;
    }

    public void setScryfallURL(String scryfallURL) {
        this.scryfallURL = scryfallURL;
    }

    public String getImageLink() {
        return imageLink;
    }

    public void setImageLink(String imageLink) {
        this.imageLink = imageLink;
    }

    public String getManaCost() {
        return manaCost;
    }

    public void setManaCost(String manaCost) {
        this.manaCost = manaCost;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOracleText() {
        return oracleText;
    }

    public void setOracleText(String oracleText) {
        this.oracleText = oracleText;
    }

    public String[] getColors() {
        return colors;
    }

    public void setColors(String[] colors) {
        this.colors = colors;
    }

    public String[] getColorIdentity() {
        return colorIdentity;
    }

    public void setColorIdentity(String[] colorIdentity) {
        this.colorIdentity = colorIdentity;
    }

    public String[] getKeywords() {
        return keywords;
    }

    public void setKeywords(String[] keywords) {
        this.keywords = keywords;
    }

    public String[] getDeckColorIdentity() { return deckColorIdentity; }

    public void setDeckColorIdentity(String[] deckColorIdentity) { this.deckColorIdentity = deckColorIdentity; }

    public String getDeckCommander(){ return deckCommander; }

    public void setDeckCommander(String deckCommander){ this.deckCommander = deckCommander;}

    public int getQuantity(){ return quantity; }

    public void setQuantity(int quantity){ this.quantity = quantity; }

    public float getCmc(){ return cmc; }

    public void setCmc(float cmc){ this.cmc = cmc; }

    public String toJsonString(){
        return String.format("{\"scryfallId\" : \"%s\", \"name\" : \"%s\", \"scryfall_url\" : \"%s\", \"image_link\" : \"%s\", \"mana_cost\" : \"%s\", \"type\" : \"%s\", \"oracle_text\" : \"%s\", \"colors\" : \"%s\", \"color_identity\" : \"%s\", \"keywords\" : \"%s\"}", this.scryfallId, this.name, this.scryfallURL, this.imageLink, this.manaCost, this.type, this.oracleText, Arrays.toString(this.colors), Arrays.toString(this.colorIdentity), Arrays.toString(this.keywords));
    }
}

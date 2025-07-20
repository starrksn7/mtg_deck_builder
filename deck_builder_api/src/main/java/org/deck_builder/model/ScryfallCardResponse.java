package org.deck_builder.model;

import jakarta.validation.constraints.NotEmpty;

public class ScryfallCardResponse {
    //id is the equivalent of scryfallId in the cardSearchDTO
    @NotEmpty
    private String id;
    @NotEmpty
    private String name;
    @NotEmpty
    private String scryfall_uri;
    @NotEmpty
    private String image_link;
    @NotEmpty
    private String mana_cost;
    @NotEmpty
    private String type;
    @NotEmpty
    private String oracle_text;
    @NotEmpty
    private String colors;
    @NotEmpty
    private String[] color_identity;
    @NotEmpty
    private String[] keywords;
    private boolean isPartner = false;
    @NotEmpty
    private String searchTerm;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScryfall_uri() {
        return scryfall_uri;
    }

    public void setScryfall_uri(String scryfall_uri) {
        this.scryfall_uri = scryfall_uri;
    }

    public String getImage_link() {
        return image_link;
    }

    public void setImage_link(String image_link) {
        this.image_link = image_link;
    }

    public String getMana_cost() {
        return mana_cost;
    }

    public void setMana_cost(String mana_cost) {
        this.mana_cost = mana_cost;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOracle_text() {
        return oracle_text;
    }

    public void setOracle_text(String oracle_text) {
        this.oracle_text = oracle_text;
    }

    public String getColors() {
        return colors;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public String[] getColor_identity() {
        return color_identity;
    }

    public void setColor_identity(String[] color_identity) {
        this.color_identity = color_identity;
    }

    public String[] getKeywords() {
        return keywords;
    }

    public void setKeywords(String[] keywords) {
        this.keywords = keywords;
    }

    public boolean isPartner() {
        return isPartner;
    }

    public void setPartner(boolean partner) {
        isPartner = partner;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }
}

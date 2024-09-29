package org.deck_builder.model;

import com.google.gson.annotations.SerializedName;
import jakarta.validation.constraints.NotEmpty;

public class CardSearchDTO {
    @NotEmpty
    private int id;
    @NotEmpty
    private String scryfallId;
    @NotEmpty
    private String name;
    @NotEmpty
    private String scryfallURL;
    @NotEmpty
    private String imageLink;
    @NotEmpty
    private String manaCost;
    @NotEmpty
    private String type;
    @NotEmpty
    private String oracleText;
    @NotEmpty
    private String[] colors;
    @NotEmpty
    private String[] colorIdentity;
    @NotEmpty
    private String[] keywords;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getScryfallId() {
        return scryfallId;
    }

    public void setScryfallId(String scryfallId) {
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
}
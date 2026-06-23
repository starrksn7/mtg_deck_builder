package org.deck_builder.model;

public class DeckUpdateDTO {
    int deckId;
    String bannerImage;

    public int getDeckId(){ return this.deckId; }

    public void setDeckId(int deckId){ this.deckId = deckId; }

    public String getBannerImage(){ return this.bannerImage; }

    public void setBannerImage(String bannerImage){ this.bannerImage = bannerImage; }
}

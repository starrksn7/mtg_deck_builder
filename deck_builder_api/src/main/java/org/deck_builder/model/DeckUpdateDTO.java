package org.deck_builder.model;

public class DeckUpdateDTO {
    int deckId;
    String deckName;
    String commander;
    boolean isPartner;
    String colorIdentity;
    String bannerImage;
    String partnerId;
    String partnerColorIdentity;

    public int getDeckId(){ return this.deckId; }

    public void setDeckId(int deckId){ this.deckId = deckId; }

    public String getBannerImage(){ return this.bannerImage; }

    public void setBannerImage(String bannerImage){ this.bannerImage = bannerImage; }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public String getCommander() {
        return commander;
    }

    public void setCommander(String commander) {
        this.commander = commander;
    }

    public boolean isPartner() {
        return isPartner;
    }

    public void setPartner(boolean partner) {
        isPartner = partner;
    }

    public String getColorIdentity() {
        return colorIdentity;
    }

    public void setColorIdentity(String colorIdentity) {
        this.colorIdentity = colorIdentity;
    }

    public String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(String partnerId) {
        this.partnerId = partnerId;
    }

    public String getPartnerColorIdentity() {
        return partnerColorIdentity;
    }

    public void setPartnerColorIdentity(String partnerColorIdentity) {
        this.partnerColorIdentity = partnerColorIdentity;
    }
}

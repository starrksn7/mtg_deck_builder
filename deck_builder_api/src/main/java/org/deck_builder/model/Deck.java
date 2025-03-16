package org.deck_builder.model;

public class Deck {

    private int id;
    private String deckName;
    private String commander;
    private String commanderScryfallId;
    private String imageLink;

    public Deck(int deckId, String deckName, String commander, String commanderScryfallId, String imageLink){
        this.id = deckId;
        this.deckName = deckName;
        this.commander = commander;
        this.commanderScryfallId = commanderScryfallId;
        this.imageLink = imageLink;
    }

    public Deck(){
    }
    public int getDeckId() {
        return id;
    }

    public void setDeckId(int deckId) {
        this.id = deckId;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public String getCommander(){
        return commander;
    }

    public void setCommander(String commander){
        this.commander = commander;
    }

    public String getCommanderScryfallId(){ return commanderScryfallId; }

    public void setCommanderScryfallId(String commanderScryfallId) { this.commanderScryfallId = commanderScryfallId; }

    public String getImageLink() { return imageLink; }

    public void setImageLink(String imageLink){ this.imageLink = imageLink; }
}

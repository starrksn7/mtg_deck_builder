package org.deck_builder.model;

public class Deck {

    private int id;
    private String deckName;
    private String commander;

    public Deck(int deckId, String deckName, String commander){
        this.id = deckId;
        this.deckName = deckName;
        this.commander = commander;
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
}

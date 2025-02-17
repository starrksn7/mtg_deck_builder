package org.deck_builder.model;

import jakarta.validation.constraints.NotEmpty;

public class DeckDTO {
    @NotEmpty
    int deckId;
    @NotEmpty
    String deckName;
    @NotEmpty
    String commander;
    @NotEmpty
    String username;
    @NotEmpty
    String cardId;

    public int getDeckId() {
        return deckId;
    }

    public void setDeckId(int deckId) {
        this.deckId = deckId;
    }

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

}

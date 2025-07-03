package org.deck_builder.model;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

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
    CardSearchDTO cardDto;
    @NotEmpty
    List<CardIdentifierDTO> identifiers;

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

    public CardSearchDTO getCardDto(){ return cardDto; }

    public void setCardDto(CardSearchDTO cardDto){ this.cardDto = cardDto;};

    public List<CardIdentifierDTO> getIdentifiers() { return identifiers; }

    public void setIdentifiers(List<CardIdentifierDTO> identifiers) { this.identifiers = identifiers;}

}

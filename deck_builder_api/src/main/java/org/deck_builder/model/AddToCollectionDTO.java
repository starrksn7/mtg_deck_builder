package org.deck_builder.model;

import java.util.List;

public class AddToCollectionDTO {
    int deckId;
    List<CardIdentifierDTO> identifiers;

    public int getDeckId() {
        return deckId;
    }

    public void setDeckId(int deckId) {
        this.deckId = deckId;
    }

    public List<CardIdentifierDTO> getIdentifiers() {
        return identifiers;
    }

    public void setCardIdentifierDTO(List<CardIdentifierDTO> identifiers) {
        this.identifiers = identifiers;
    }
}

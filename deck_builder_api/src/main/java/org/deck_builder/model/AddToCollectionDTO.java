package org.deck_builder.model;

import java.util.List;

public class AddToCollectionDTO {
    int deckId;
    CardIdentifierDTO cardIdentifierDTO;

    public int getDeckId() {
        return deckId;
    }

    public void setDeckId(int deckId) {
        this.deckId = deckId;
    }

    public List<CardIdentifierDTO> getCardIdentifierDTO() {
        return (List<CardIdentifierDTO>) cardIdentifierDTO;
    }

    public void setCardIdentifierDTO(CardIdentifierDTO cardIdentifierDTO) {
        this.cardIdentifierDTO = cardIdentifierDTO;
    }
}

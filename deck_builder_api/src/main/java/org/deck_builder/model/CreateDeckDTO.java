package org.deck_builder.model;

public class CreateDeckDTO {
    int userId;
    String deckName;
    CardSearchDTO cardDTO;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public CardSearchDTO getCardDTO() {
        return cardDTO;
    }

    public void setCardDTO(CardSearchDTO cardDTO) {
        this.cardDTO = cardDTO;
    }
}

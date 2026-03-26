package org.deck_builder.model;

import java.util.List;

public class CardCollectionResult {
    private List<String> foundCards;
    private List<String> notFoundCards;

    public CardCollectionResult(List<String> foundCards, List<String> notFoundCards) {
        this.foundCards = foundCards;
        this.notFoundCards = notFoundCards;
    }

    public List<String> getFoundCards() {
        return foundCards;
    }

    public List<String> getNotFoundCards() {
        return notFoundCards;
    }
}
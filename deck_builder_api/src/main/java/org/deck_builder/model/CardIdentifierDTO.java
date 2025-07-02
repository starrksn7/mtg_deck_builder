package org.deck_builder.model;

public class CardIdentifierDTO {

    private String name;

    public CardIdentifierDTO() {}

    public CardIdentifierDTO(String name) {
        this.name = name;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

}

package org.deck_builder.model;

public class CardIdentifierDTO {

    private String name;

    private String id;

    public CardIdentifierDTO() {}

    public CardIdentifierDTO(String name) {
        this.name = name;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getId(){ return id; }

    public void setId(String id){ this.id = id; }

}

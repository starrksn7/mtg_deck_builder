package org.deck_builder.controller;

import org.deck_builder.model.Card;
import org.deck_builder.dao.CardDao;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/card")
@CrossOrigin
public class CardController {
    private CardDao cardDao;

    private CardController(CardDao cardDao){
        this.cardDao = cardDao;
    }
    @GetMapping(path="/searchByName")
    public List<Card> searchForCardByName(String name) throws UnsupportedEncodingException {
        return cardDao.searchForCardByName(name);
    }

    @GetMapping(path="/getFromUri")
    public String getCardsFromUri(String uri) throws IOException {
        return cardDao.getCardsFromUri(uri);
    }

    @GetMapping(path="/searchByIdentityAndType")
    public List<Card> findCardByType(String identity, String type) throws UnsupportedEncodingException{
        return cardDao.findCardByIdentityAndType(identity, type);
    }

    @GetMapping(path="/searchByColorAndCost")
    public List<Card> getCardByColorAndCost(String colors, String manaCost) throws UnsupportedEncodingException{
        return cardDao.getCardByColorAndCost(colors, manaCost);
    }

    @GetMapping(path="/searchByKeyword")
    public List<Card> getCardByKeyword(List<String> keywords) throws UnsupportedEncodingException{
        return cardDao.getCardByKeyword(keywords);
    }

    @GetMapping(path="/searchByColors")
    public List<Card> getCardsByColors(String colors) throws UnsupportedEncodingException{
        return cardDao.getCardsByColors(colors);
    }

    @GetMapping(path="/searchByColorIdentity")
    public List<Card> getCardsByColorIdentity(String colorIdentity) throws UnsupportedEncodingException {
        return cardDao.getCardsByColorIdentity(colorIdentity);
    }

    @PostMapping(path="/addToDb")
    public boolean addCardToDb(Card card){
        return cardDao.addCardToDb(card);
    }
}

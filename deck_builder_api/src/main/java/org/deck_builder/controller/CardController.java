package org.deck_builder.controller;

import org.deck_builder.model.Card;
import org.deck_builder.dao.CardDao;
import org.deck_builder.model.CardSearchDTO;
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
    @PostMapping(path="/searchByName")
    public List<String> searchForCardByName(@RequestBody CardSearchDTO jsonBody) throws UnsupportedEncodingException {
        return cardDao.searchForCardByName(jsonBody.getName());
    }

    @PostMapping(path="/searchByIdentityAndType")
    public List<String> findCardByType(@RequestBody CardSearchDTO jsonBody) throws UnsupportedEncodingException{
        return cardDao.findCardByIdentityAndType(jsonBody.getColorIdentity(), jsonBody.getType());
    }

    @PostMapping(path="/searchByColorAndCost")
    public List<String> getCardByColorAndCost(@RequestBody CardSearchDTO jsonBody) throws UnsupportedEncodingException{
        return cardDao.getCardByColorAndCost(jsonBody.getColors(), jsonBody.getManaCost());
    }

    @PostMapping(path="/searchByKeywordAndColors")
    public List<String> getCardByKeyword(@RequestBody CardSearchDTO jsonBody) throws UnsupportedEncodingException{
        return cardDao.getCardByKeywordAndColors(jsonBody.getKeyword(), jsonBody.getColors());
    }

    @PostMapping(path="/addToDb")
    public boolean addCardToDb(Card card){
        return cardDao.addCardToDb(card);
    }

    @PostMapping(path="/searchForCommander")
    public List<String> searchForCommander(@RequestBody String name, String colors) throws UnsupportedEncodingException {
        return cardDao.searchForCommander(name, colors);
    }
}

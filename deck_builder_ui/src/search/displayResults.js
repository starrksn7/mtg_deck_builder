import React from "react"
import axios from 'axios'
import { replaceTextWithManaSymbols } from "../helperFunctions"


export const DisplayResults = ({searchResults, deckId, setIsError}) => {
    console.log("searchResults in displayResults = ")
    console.log(searchResults)

    const addToDeck = async (card) => {
        // e.preventDefault();
        // const card = e.target;
        // console.log("e =")
        // console.log(e)
        console.log("target card = ")
        console.log(card)
        let cardObject = {
            scryfallId: card.scryfallId,
            name: card.name,
            scryfallURL: card.scryfall_url,
            imageLink: card.image_link,
            type: card.type,
            oracleText: card.oracle_text,
            manaCost: card.mana_cost,
            colors: card.colors,
            colorIdentity: card.color_identity,
            keyword: card.keywords
        }
        const res = await axios.post('http://localhost:8080/decks/add', { deckId: 1, cardDto: cardObject})
        if(res) console.log("added card to deck. Need to find a better notification than this")
        else console.log("Couldn't add the card to deck, for some reason")
   }

    if(searchResults[0]?.error) {
        setIsError(true)
        return (
            <div>
                No results found for that search term
            </div>
        )
    } else {
        setIsError(false)
        return searchResults.map((card, index) => (
            <div key={index}>
                <div>
                    <img src={card.image_link} alt='alternate text'/>
                    <div>{card.name}</div>
                    <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.mana_cost) }} ></div>
                    <div>Type: {card.type}</div>
                    <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.oracle_text) }} ></div>
                    {/* <form onSubmit={addToDeck}> */}
                        <button type="submit" onClick={() => addToDeck(card)}>Add to Deck</button>
                    {/* </form> */}
                </div>  
            </div>
    ))
    }
}
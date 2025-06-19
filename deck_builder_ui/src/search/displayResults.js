import React from "react"
import axios from 'axios'
import { replaceTextWithManaSymbols, createCardObject } from "../helperFunctions"
import { useLocation } from "react-router-dom"


export const DisplayResults = ({searchResults, deckId, setIsError}) => {
    console.log("searchResults in displayResults = ")
    console.log(searchResults)
    const location = useLocation();
    const isOnCreatePage = location.pathname === '/create' 

    const addToDeck = async (card) => {
        let cardObject = createCardObject(card)
        
        const res = await axios.post('http://localhost:8080/decks/add', { deckId: 1, cardDto: cardObject})
        if(res) console.log("added card to deck. Need to find a better notification than this")
        else console.log("Couldn't add the card to deck, for some reason")
   }

   const setAsCommander = async (card) => {
        let cardObject = createCardObject(card)

        const res = await axios.post('http://localhost:8080/decks/create', { userId: 1, deckName, cardObject})
        if(res) console.log("deck created")
        else console.log("new deck could not be created")
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
                        <button type="submit" onClick={() => isOnCreatePage ? setAsCommander(card) : addToDeck(card)}>
                            {isOnCreatePage ? 'Set as Commander' : 'Add to Deck'}
                        </button>
                    {/* </form> */}
                </div>  
            </div>
    ))
    }
}